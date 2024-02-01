import { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, Divider, Button, List, Typography, ListItemButton, Collapse, useTheme, ListItemIcon, ListItemText, Tooltip, IconButton, Alert, AlertTitle } from '@mui/material';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';

const GeneratorSidebar = (props) => {

  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialState = props.initialState;
  const ecosystem = initialState.ecosystem;

  const generatedFiles = initialState.generatedFiles;

  const showFileIndex = props.showFileIndex;
  const setShowFileIndex = props.setShowFileIndex;

  let foldersTmp = [];
  let openTmp = [];
  generatedFiles.map((generatedFile) => {
    // build the folder objects, open per default
    if (generatedFile.folder != null && generatedFile.folder.length > 0) {
      if (!foldersTmp.includes(generatedFile.folder)) {
        foldersTmp.push(generatedFile.folder);
        openTmp.push(true);
      }
    }
  });

  const [open, setOpen] = useState(openTmp);
  const [folders, setFolders] = useState(foldersTmp);

  // toggle open
  const handleFolderClick = (index) => {
    var openTmp = [...open];
    openTmp[index] = !openTmp[index];
    setOpen(openTmp);
  };

  return (
    <Box style={{ height: '100vh', marginTop: '-53px' }}>
      <Sidebar
        backgroundColor={colors.primary[400]}
        collapsed={false}
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
            style={{
              margin: '8px 0',
              color: colors.grey[100],
            }}
          >
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
              >
                <Tooltip arrow placement='right' title='Back to editor'>
                  <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <Typography variant='h3' color={colors.grey[100]} margin={'auto'} fontWeight='600'>
                  Generated files
                </Typography>
                <div></div>
              </Box>
          </MenuItem>
          <Divider />
          <Box p={'16px'}>
            <Alert variant="outlined" severity="warning">
              <AlertTitle><strong>Disclaimer</strong></AlertTitle>
              Use the generated code provided on this website on your own risk. Review and test the code thoroughly before implementing it in any production or critical environment. We are not responsible for any damage or issues that may arise from its use.
            </Alert>
          </Box>
            <div>
              <List
                sx={{ width: '100%' }}
                component="nav"
              >
                {folders.map((folder, folderIndex) => (
                  <div key={folder + '-' + folderIndex}>
                    <ListItemButton onClick={() => handleFolderClick(folderIndex)}>
                      <ListItemIcon>
                        {open[folderIndex] ? <FolderOpenOutlinedIcon /> : <FolderOutlinedIcon />}
                      </ListItemIcon>
                      <ListItemText primary={<strong>{folder}</strong>} />
                      {open[folderIndex] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open[folderIndex]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {generatedFiles.map((file, fileIndex) => (
                          <div key={file.fileName + '-' + fileIndex}>
                            {file.folder === folder && (
                              <ListItemButton selected={showFileIndex === fileIndex} sx={{ pl: 4 }} onClick={() => setShowFileIndex(fileIndex)}>
                                <ListItemIcon>
                                  <DescriptionOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={file.fileName} />
                              </ListItemButton>
                            )}
                          </div>
                        ))}
                      </List>
                    </Collapse>
                  </div>
                ))}
                {/* files without a folder */}
                {generatedFiles.map((file, fileIndex) => (
                  <div key={file.fileName + '-' + fileIndex}>
                    {file.folder === '' && (
                      <ListItemButton selected={showFileIndex === fileIndex} onClick={() => setShowFileIndex(fileIndex)}>
                        <ListItemIcon>
                          <DescriptionOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={file.fileName} />
                      </ListItemButton>
                    )}
                  </div>
                ))}
              </List>
            </div>
        </Menu>
        
        <Divider />
        <br />
        
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
              color='primary' 
              endIcon={<ContentCopyOutlinedIcon />}
              onClick={() => navigator.clipboard.writeText(generatedFiles[showFileIndex].content)}>
                Copy editor content to clipboard
            </Button>
          </Box>
        </div>

        <br/>
        
        {/* Currently deactivated */}
        {false && ecosystem === 'Ethereum' && (
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
              color='secondary' 
              endIcon={<KeyboardArrowRightIcon />}>
                Open in Remix IDE
            </Button>
          </Box>
        </div>
        )}
      </Sidebar>
    </Box>
  );
};

export default GeneratorSidebar;