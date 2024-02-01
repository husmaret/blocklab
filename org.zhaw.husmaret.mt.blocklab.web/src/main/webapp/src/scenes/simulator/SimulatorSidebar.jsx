import { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, IconButton, Button, Typography, TextField, Divider, Tooltip, useTheme, Checkbox, FormControlLabel } from '@mui/material';
import { withStyles } from '@mui/styles';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { tokens } from '../../theme';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useNavigate } from 'react-router-dom';

const SimulatorSidebar = (props) => {

  const ExitSimulatorIcon = withStyles((theme) => ({
    root: {
      transform: "scaleX(-1)"
    }
  }))(LogoutOutlinedIcon);

  dayjs.extend(duration);

  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [contractParamErrors, setContractParamErrors] = useState([]);
  
  const simulationState = props.simulationState;
  const setSimulationState = props.setSimulationState;
  const setIsSimulationRestartDialogOpen = props.setIsSimulationRestartDialogOpen;
  const isCollapsed = props.isCollapsed;
  const setIsCollapsed = props.setIsCollapsed;

  const updateSimulationStart = (date) => {

    let dateTmp = date.format();

    let timeouts = [...simulationState.timeouts];
    // also update all timeout values with offsets
    timeouts.map((timeout, timeoutIndex) => {
      if (timeout.offsetInSeconds > 0) {
        timeouts[timeoutIndex].value = date.add(timeout.offsetInSeconds, 'seconds');
      }
      return timeouts;
    });

    setSimulationState({
      ...simulationState,
      simulationStart: dateTmp,
      timeouts: timeouts
    });
  }
  
  const updateContractParam = (event, contractParamIndex) => {
    let timeouts = [...simulationState.timeouts];
    let participantsTmp = [...simulationState.participants];
    let contractParamsTmp = [...simulationState.contractParams];
    if(contractParamsTmp[contractParamIndex].type === 'Date') {
      contractParamsTmp[contractParamIndex].value = event.format();
      timeouts.map((timeout) => {
        if (timeout.contractParam === contractParamsTmp[contractParamIndex].paramName) {
          timeout.value = event.format();
        }
        return timeouts;
      });
    } else if (contractParamsTmp[contractParamIndex].type === 'Boolean') {
      contractParamsTmp[contractParamIndex].value = event.target.checked;
    } else if (contractParamsTmp[contractParamIndex].type === 'Participant') {
      contractParamsTmp[contractParamIndex].value = event.target.value;
      console.log('Set new participant value: '+event.target.value)
      // also update all participants addresses with the new value
      participantsTmp.map((participant, participantIndex) => {
        if (participant.contractParam === contractParamsTmp[contractParamIndex].paramName) {
          participantsTmp[participantIndex].address = event.target.value;
        }
        return participantsTmp;
      });
    } else {
      contractParamsTmp[contractParamIndex].value = event.target.value;
    }
    
    setSimulationState({
      ...simulationState,
      participants: participantsTmp,
      contractParams: contractParamsTmp,
      timeouts: timeouts
    });
  }
  
  const onSubmit = (e) => {
    setIsCollapsed(!isCollapsed);
    setSimulationState({...simulationState, state: 'Running'});
    e.preventDefault();
  };
  
  const formatDuration = (durationInSeconds) => {
    return dayjs.duration(durationInSeconds, 'seconds')
    .format('Y[y] D[d] H[h] m[m]')
    .replace(/\b0y\b/, '')
    .replace(/\b0m\b/, '')
    .replace(/\b0d\b/, '')
    .replace(/\b0h\b/, '')
  }
  
  return (
    <Box style={{ height: '100vh', marginTop: '-53px' }}>
      <Sidebar
        backgroundColor={colors.primary[400]}
        collapsed={isCollapsed}
        width={'450px'}
      >
        <Menu menuItemStyles={{
          button: {
            backgroundColor: colors.primary[400],
            '&:hover': {
              backgroundColor: colors.primary[400],
            },
          },
        }} iconShape='square' closeOnClick='true'>

          {/* LOGO AND MENU ICON */}
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: '8px 0px',
                color: colors.grey[100],
              }}
            >
              {!isCollapsed && (
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  // ml='16px'
                >
                  <Tooltip arrow placement='right' title='Exit Simulaton'>
                    <IconButton onClick={() => navigate(-1)}>
                      <ExitSimulatorIcon />
                    </IconButton>
                  </Tooltip>
                  <Typography variant='h3' color={colors.grey[100]} margin={'auto'} fontWeight='600'>
                    Initial values
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>
          <Divider />
          <br />
          {!isCollapsed && (
            <Box m='16px'>
              <form target='/' onSubmit={e => onSubmit(e)}>

                <Typography color={colors.grey[100]} variant='h5' fontWeight='600'>
                  Simulation start
                </Typography>
                
                <br />

                <Box
                  display='grid'
                  gridTemplateColumns='repeat(4, 1fr)'
                  gridAutoRows='60px'
                  rowGap='0px'
                  columnGap='12px'
                  marginBottom='0px'
                >
                  <Box
                    gridColumn='span 2'
                    gridRow='span 1'
                    backgroundColor={colors.primary[400]}
                    overflow='auto'
                    paddingTop='8px'
                  >
                    <DateTimePicker
                      disabled={simulationState.state !== 'Initializing'}
                      label='Simulation start'
                      format='DD.MM.YYYY HH:mm'
                      slotProps={{ textField: { size: 'small', required: true, color: 'secondary' } }}
                      value={dayjs(simulationState.simulationStart) || dayjs(Date.now())}
                      onChange={date => updateSimulationStart(date)}
                    />
                  </Box>

                </Box>

                {simulationState.contractParams.length > 0 && (
                <div>
                

                  <Divider />
                  <br />

                  <Typography color={colors.grey[100]} variant='h5' fontWeight='600'>
                    Contract parameters
                  </Typography>

                  <br />

                  <Box
                    display='grid'
                    gridTemplateColumns='repeat(4, 1fr)'
                    gridAutoRows='60px'
                    rowGap='0px'
                    columnGap='12px'
                    marginBottom='0px'
                  >
                    {simulationState.contractParams.map((contractParam, contractParamIndex) => {
                      return (
                        <Box
                          key={`${'contractParam'}_${contractParamIndex}`}
                          gridColumn='span 2'
                          gridRow='span 1'
                          backgroundColor={colors.primary[400]}
                          overflow='auto'
                          paddingTop='8px'
                        >
                          {contractParam.type === 'Date'  &&
                            <DateTimePicker
                            required
                            disabled={simulationState.state !== 'Initializing'}
                            label={contractParam.paramName}
                            minDateTime={dayjs(simulationState.simulationStart).add(1, 'minutes')}
                            onError={(reason, value) => {
                              var contractParamErrorsTmp = [...contractParamErrors];
                              if (reason === 'minTime' || reason === 'minDate') {
                                contractParamErrorsTmp[contractParamIndex] = 'Has to be after Simulation start';
                              } else {
                                contractParamErrorsTmp[contractParamIndex] = null;
                              }
                              setContractParamErrors(contractParamErrorsTmp);
                            }}
                            format='DD.MM.YYYY HH:mm'
                            slotProps={{ textField: { size: 'small', required: true, color: 'secondary', helperText: contractParamErrors[contractParamIndex] }}}
                            value={dayjs(contractParam.value)}
                            onChange={date => updateContractParam(date, contractParamIndex)}
                          />
                          }

                          {contractParam.type === 'Number'  &&
                            <TextField
                              type='number'
                              required
                              inputProps={{ min: 0, step: 1, style: { textAlign: 'right' } }}
                              size='small'
                              color='secondary'
                              disabled={simulationState.state !== 'Initializing'}
                              label={contractParam.paramName}
                              value={contractParam.value}
                              onChange={event => updateContractParam(event, contractParamIndex)}
                            />
                          }
                          
                          {contractParam.type === 'Text' && (
                            <TextField
                              required
                              size='small'
                              color='secondary'
                              disabled={simulationState.state !== 'Initializing'}
                              label={contractParam.paramName}
                              value={contractParam.value || ''}
                              onChange={event => updateContractParam(event, contractParamIndex)}
                            />
                          )}

                          {contractParam.type === 'Participant' && (
                            <TextField
                              required
                              size='small'
                              color='secondary'
                              disabled={simulationState.state !== 'Initializing'}
                              label={contractParam.paramName + ' (Address)'}
                              value={contractParam.value || ''}
                              onChange={event => updateContractParam(event, contractParamIndex)}
                            />
                          )}
                          
                          {contractParam.type === 'Boolean'  &&
                            <FormControlLabel control={<Checkbox
                              color='secondary'
                              disabled={simulationState.state !== 'Initializing'}
                              checked={contractParam.value}
                              onChange={event => updateContractParam(event, contractParamIndex)}
                            />} label={contractParam.paramName} labelPlacement='start' />
                          }


                        </Box>
                      )})
                    }
                  </Box>
                </div>)}
                
                <Divider />
                <br />
              
                <Typography color={colors.grey[100]} variant='h5' fontWeight='600'>
                  Timeouts
                </Typography>
                <br />

                <Box
                  display='grid'
                  gridTemplateColumns='repeat(4, 1fr)'
                  gridAutoRows='60px'
                  rowGap='0px'
                  columnGap='12px'
                  marginBottom='0px'
                >
                  {simulationState.timeouts.map((timeout, timeoutIndex) => {
                    return (
                      <Box
                        key={`${'timeout'}_${timeoutIndex}`}
                        gridColumn='span 2'
                        gridRow='span 1'
                        backgroundColor={colors.primary[400]}
                        overflow='auto'
                        paddingTop='8px'
                      >
                        <Tooltip arrow placement={'bottom'} title={timeout.offsetInSeconds > 0 ? '+ ' + (formatDuration(timeout.offsetInSeconds)) + ' from Simulation start' : (timeout.contractParam ? 'Contract parameter: ' + timeout.contractParam : 'Fixed date')}>
                          <span>
                            <DateTimePicker
                              disabled
                              label={timeout.name}
                              format='DD.MM.YYYY HH:mm'
                              slotProps={{ textField: { size: 'small', required: true, color: 'secondary'} }}
                              value={dayjs(timeout.value)}
                            />
                          </span>
                        </Tooltip>
                      </Box>
                    )})
                  }
                </Box>

                <Divider />
                <br />

                {simulationState.state === 'Initializing' && (
                  <div>
                    <Box
                      display='flex'
                      justifyContent='space-between'
                      alignItems='center'
                      width='80%'
                      margin={'auto'}
                    >
                      <Button 
                        fullWidth
                        type='submit' 
                        variant='contained' 
                        color='secondary' 
                        endIcon={<PlayArrowOutlinedIcon className='iconStyle' />}
                      >
                        Start simulation
                      </Button>
                    </Box>
                  </div>)}

                  
              </form>
            </Box>
          )}
          {simulationState.state !== 'Initializing' && (
            <div>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                width='80%'
                margin={'auto'}
              >
                <Tooltip arrow placement={'bottom'} title='Restart simulation'>
                  <Button 
                    fullWidth
                    variant='contained' 
                    color='secondary' 
                    endIcon={!isCollapsed && <ReplayOutlinedIcon />}
                    onClick={() => setIsSimulationRestartDialogOpen(true)}
                  >
                    {isCollapsed ? <ReplayOutlinedIcon className='iconStyle' /> : 'Restart simulation'}
                  </Button>
                </Tooltip>
              </Box>

            </div>)}
            {isCollapsed && (
              <Box
                width='64px'
                p={'24px 8px'}
                margin={'auto'}
                bottom={'0px'}
                position={'fixed'}
              >
                <Tooltip arrow placement='right' title='Exit Simulaton'>
                  <Button 
                    fullWidth
                    variant='contained' 
                    color='secondary' 
                    onClick={() => navigate(-1)}
                  >
                    <ExitSimulatorIcon />
                  </Button>
                </Tooltip>
              </Box>
            )}
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default SimulatorSidebar;