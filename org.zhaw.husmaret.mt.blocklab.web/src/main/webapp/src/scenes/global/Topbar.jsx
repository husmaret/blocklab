import { Box, IconButton, Menu, MenuItem, Typography, useTheme, FormControlLabel, Switch, Tooltip } from '@mui/material';
import { tokens } from '../../theme';
import { useContext, useEffect, useState } from 'react';
import { ColorModeContext } from '../../theme';
import { useLocation } from 'react-router-dom'
import CustomWidthTooltip from '../../components/CustomWidthTooltip';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const Topbar = (props) => {

  const isCollapsed = props.isCollapsed;
  const editorErrors = props.editorErrors;
  const dashboardOptions = props.dashboardOptions;
  const setDashboardOptions = props.setDashboardOptions;
  const openProjectIndex = props.openProjectIndex;

  const [anchorOptionMenu, setAnchorOptionMenu] = useState(null);
  const open = Boolean(anchorOptionMenu);
  const onOptionsClick = (event) => {
    setAnchorOptionMenu(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorOptionMenu(null);
  };
  const [isProjectRoute, setIsProjectRoute] = useState(false); 
  
  const location = useLocation();
  useEffect(() => {
    setIsProjectRoute(location.pathname.indexOf('simulator') < 0 && location.pathname.indexOf('generator') < 0);
  }, [location]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const errorTooltipContent = () => {
    if (editorErrors.length > 0) {
      let editorErrorstr = '';
      editorErrors.map((editorError) => {
        editorErrorstr += 'Row ' + (editorError.row + 1) + ': ' + editorError.text + '\n';
      })
      return <div style={{ whiteSpace: 'pre-line', fontSize: '1.5em' }}><strong>{'Violations:\n'}</strong>{editorErrorstr}</div>;
    } else {
      return 'No violations in current project';
    }
  }

  return (
    <Box marginLeft={isCollapsed ? '80px' : '450px'} display='flex' justifyContent='space-between' p='16px 16px 0px 16px'>
      {/* State */}
      <Box />

      {/* Title */}
      <span>
        <Typography
          color={colors.grey[100]}
          variant='h3'
          fontWeight='600'
        >
          {props.title}
        </Typography>
      </span>

      {/* ICONS */}
      <Box display='flex'>
        {isProjectRoute && (
          <div>
          {openProjectIndex >= 0 && (
            <CustomWidthTooltip placement={'left'} title={errorTooltipContent()}>
              <span>
                <IconButton 
                  disabled={editorErrors.length === 0}  
                  color='error'
                >
                  <InfoOutlinedIcon />
                </IconButton>
              </span>
            </CustomWidthTooltip>
          )}

          <Tooltip arrow placement='bottom' title='Settings'>
            <span> 
              <IconButton onClick={onOptionsClick}>
                <TuneOutlinedIcon />
              </IconButton>
            </span>  
          </Tooltip>
          <Menu
            anchorEl={anchorOptionMenu}
            open={open}
            onClose={handleClose}
          >
            <MenuItem>
              <FormControlLabel control={<Switch
                color='secondary'
                checked={dashboardOptions.autoUpdateDSLCode}
                onChange={event => {
                  setDashboardOptions({
                    ...dashboardOptions,
                    autoUpdateDSLCode: event.target.checked
                  });
                }}
              />} label={'Auto Update DSL Code'} labelPlacement='end' />
            </MenuItem>
          </Menu>
          </div>
        )}
        <Tooltip arrow placement='bottom' title={theme.palette.mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <span>
            <IconButton onClick={colorMode.toggleColorMode}>
              {theme.palette.mode === 'dark' ? (
                <LightModeOutlinedIcon />
                ) : (
                <DarkModeOutlinedIcon />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Topbar;