import { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, Divider, Button, IconButton, List, Typography, ListItemButton, ListItemSecondaryAction, useTheme, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import CustomWidthTooltip from '../../components/CustomWidthTooltip';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SlowMotionVideoOutlinedIcon from '@mui/icons-material/SlowMotionVideoOutlined';
import NewProjectDialog from '../dialogs/NewProjectDialog';
import { setAndSaveProjects } from '../../App';
import { auctionExample, becomeRichestExample, counterExample, purchaseExample, timelockExample } from '../../data/defaultProjects';

const DashboardSidebar = (props) => {

  const projects = props.projects;
  const isCollapsed = props.isCollapsed;
  const setIsCollapsed = props.setIsCollapsed;
  const isReset = props.isReset;
  const setIsReset = props.setIsReset;
  const setInitialState = props.setInitialState;
  const openProjectIndex = props.openProjectIndex;
  const setOpenProjectIndex = props.setOpenProjectIndex;
  const setProjects = props.setProjects;
  const setErrors = props.setErrors;
  const editorErrors = props.editorErrors;

  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false); 
  const [newProjectName, setNewProjectName] = useState('');
  const [newBlocklyJSON, setNewBlocklyJSON] = useState({});
  const [isDuplicateDialog, setIsDuplicateDialog] = useState(false);
  
  let navigate = useNavigate();

  const onReset = (projectIndex) => {
    const exampleNr = projects[projectIndex].example
    if (exampleNr) {
      if (exampleNr === 1) {
        projects[projectIndex].blocklyJSON = counterExample.blocklyJSON;
      } else if (exampleNr === 2) {
        projects[projectIndex].blocklyJSON = timelockExample.blocklyJSON;
      } else if (exampleNr === 3) {
        projects[projectIndex].blocklyJSON = becomeRichestExample.blocklyJSON;
      } else if (exampleNr === 4) {
        projects[projectIndex].blocklyJSON = purchaseExample.blocklyJSON;
      } else if (exampleNr === 5) {
        projects[projectIndex].blocklyJSON = auctionExample.blocklyJSON;
      }
      setAndSaveProjects(setProjects, projects);
      setIsReset(!isReset);
    }
  }

  const onDuplicate = (projectIndex) => {
    setNewProjectName(projects[projectIndex].name + '_Copy')
    setNewBlocklyJSON(projects[projectIndex].blocklyJSON)
    setIsDuplicateDialog(true)
    setIsNewProjectDialogOpen(true)
  }
  
  const onDelete = (projectIndex) => {
    let projectsTmp = [...projects]
    projectsTmp.splice(projectIndex, 1)
    setAndSaveProjects(setProjects, projectsTmp)
  }

  useEffect(() => {
    if (openProjectIndex >= 0) {
      setIsCollapsed(true);
    }
  }, [openProjectIndex])

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
              >
                <Typography variant='h3' color={colors.grey[100]} margin={'auto'} fontWeight='600'>
                  Projects
                </Typography>
                <Tooltip arrow placement='right' title='Collapse sidebar'>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}  
          </MenuItem>
        </Menu>
        <Divider />
        <br />
        {!isCollapsed && (
        <div>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            width='80%'
            margin={'auto'}
          >
            <Button 
              type='submit'
              fullWidth
              variant='contained' 
              color='success' 
              endIcon={<NoteAddOutlinedIcon />}
              onClick={() => {
                setIsDuplicateDialog(false);
                setIsNewProjectDialogOpen(true);
              }}>
                Create new project
            </Button>
          </Box>
          <List
            sx={{ width: '100%' }}
            component="nav"
          >
            {projects.map((project, projectIndex) => (
              <div key={project + '-' + projectIndex}>
                <ListItemButton 
                  selected={openProjectIndex === projectIndex}
                  onClick={() => setOpenProjectIndex(projectIndex)}>
                  <ListItemIcon>
                    <AppsOutlinedIcon />
                  </ListItemIcon>

                  <ListItemText primary={openProjectIndex === projectIndex ? <strong>{project.name}</strong> : project.name} />

                  <ListItemSecondaryAction hidden={openProjectIndex !== projectIndex}>
                    <>
                      <Tooltip arrow placement='top' title={'Duplicate '+project.name}>
                        <IconButton aria-label="duplicate" onClick={() => onDuplicate(projectIndex)}>
                          <ContentCopyOutlinedIcon sx={{width: '18px', height: '18px'}} />
                        </IconButton>
                      </Tooltip>
                      {openProjectIndex >= 0 && projects[openProjectIndex] && projects[openProjectIndex].example > 0 ? (
                        <Tooltip arrow placement='top' title={'Reset '+project.name}>
                          <IconButton aria-label="reset" onClick={() => onReset(projectIndex)}>
                            <RotateLeftOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip arrow placement='top' title={'Delete '+project.name}>
                          <IconButton edge="end" aria-label="delete" onClick={() => onDelete(projectIndex)}>
                            <DeleteOutlineOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  </ListItemSecondaryAction>
                </ListItemButton>
              </div>
            ))}
          </List>

        <br />
        <Divider />
        <br />

      </div>
      )}

      {openProjectIndex >= 0 && projects[openProjectIndex] && (
        <Box
          width='80%'
          margin={'auto'}
        >
          <CustomWidthTooltip placement={isCollapsed ? 'right' : 'bottom'} title={props.errorTooltipContent('Simulate')}>
            <span>
              <Button 
                disabled={editorErrors.length > 0}
                fullWidth
                variant='contained' 
                color='secondary' 
                endIcon={!isCollapsed && <SlowMotionVideoOutlinedIcon />}
                onClick={() => {
                  props.xtextEditor.xtextServices.generate().then((response) => {
                    setInitialState(JSON.parse(response));
                  }).catch((error) => setErrors(["Could not parse the content of the editor. Try again later."]));
                  setIsCollapsed(false);
                  navigate('/blocklabIDE/simulator');
                }}
              >
                {isCollapsed ? <SlowMotionVideoOutlinedIcon className='iconStyle' /> : 'Simulate ' + projects[openProjectIndex].name}
              </Button>
            </span>
          </CustomWidthTooltip>

          <br />
          <br />

          <CustomWidthTooltip placement={isCollapsed ? 'right' : 'bottom'} title={props.errorTooltipContent('Generate')}>
            <span>
              <Button 
                disabled={editorErrors.length > 0}
                fullWidth
                variant='contained' 
                color='secondary' 
                endIcon={!isCollapsed && <SettingsOutlinedIcon />}
                onClick={() => {
                  props.xtextEditor.xtextServices.generate().then((response) => {
                    const initialState = JSON.parse(response);
                    if (initialState.ecosystem === 'Cardano') {
                      setErrors(["Generation of Cardano Smart Contract code is not supported yet."])
                      return
                    } 
                    if (initialState.ecosystem === 'Solana') {
                      setErrors(["Generation of Solana Smart Contract code is not supported yet."])
                      return
                    } 
                    setInitialState(JSON.parse(response));
                  }).catch((error) => {
                    setErrors(["Could not parse the content of the editor. Try again later."])
                    return
                  });
                  setIsCollapsed(false);
                  navigate('/blocklabIDE/generator');
                }}
              >
                {isCollapsed ? <SettingsOutlinedIcon className='iconStyle' /> : 'Generate ' + projects[openProjectIndex].name}
              </Button>
            </span>
          </CustomWidthTooltip>
        </Box>
      )}
      </Sidebar>
      <NewProjectDialog
        isDialogOpened={isNewProjectDialogOpen}
        isDuplicateDialog={isDuplicateDialog}
        handleCloseDialog={() => {
          setIsNewProjectDialogOpen(false);
        }}
        handleCreateNewProject={() => {
          setIsNewProjectDialogOpen(false);

          var projectsTmp = [...projects];
          projectsTmp.push({
            name: newProjectName,
            blocklyJSON: newBlocklyJSON
          });
          setAndSaveProjects(setProjects, projectsTmp);
          
          setOpenProjectIndex(projectsTmp.length - 1);

          // reset the value in dialog
          setNewProjectName('');
          setNewBlocklyJSON({});

        }}
        newProjectName={newProjectName}
        setNewProjectName={setNewProjectName}
      />
    </Box>
  );
};

// function async handleOpenGenerator => {
//   await 

export default DashboardSidebar;