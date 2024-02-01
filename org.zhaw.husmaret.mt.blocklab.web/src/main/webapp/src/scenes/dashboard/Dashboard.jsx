import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import { Box, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { dslGenerator } from '../../blockly/BlockLabGenerator.js';
import BlocklyEditor from '../../components/BlocklyEditor';
import { tokens } from '../../theme';
import xtext from '../../xtext/xtext-ace';
import DashboardSidebar from './DashboardSidebar';

import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-github_dark';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import '../../components/mode/mode-blocklab';

import 'ace-builds/src-noconflict/theme-cloud9_day';
import 'ace-builds/src-noconflict/theme-cloud9_night';
import 'ace-builds/src-noconflict/theme-solarized_light';
import { setAndSaveProjects } from '../../App.js';

const Dashboard = (props) => {

  const setInitialState = props.setInitialState;
  const projects = props.projects;
  const setProjects = props.setProjects;
  const openProjectIndex = props.openProjectIndex;
  const setOpenProjectIndex = props.setOpenProjectIndex;
  const setErrors = props.setErrors;
  const editorErrors = props.editorErrors;
  const setEditorErrors = props.setEditorErrors;
  const isCollapsed = props.isCollapsed;
  const setIsCollapsed = props.setIsCollapsed;
  const isReset = props.isReset;
  const setIsReset = props.setIsReset;
  const dashboardOptions = props.dashboardOptions;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const xtextEditorRef = useRef(null);
  const [xtextEditor, setXtextEditor] = useState(null);
  const [previousGeneratedCode, setPreviousGeneratedCode] = useState('');
  
  useEffect(() => {
    
    const xtextEditorElement = xtextEditorRef.current;
    
    const editorTheme = theme.palette.mode === 'dark' ? 'ace/theme/cloud9_night' : 'ace/theme/cloud9_day';
    // const editorTheme = theme.palette.mode === 'dark' ? 'ace/theme/github_dark' : 'ace/theme/github';
    // const editorTheme = theme.palette.mode === 'dark' ? 'ace/theme/solarized_dark' : 'solarized_light';
    
    const portToUse = process.env.REACT_APP_BLOCKLAB_PORT ? process.env.REACT_APP_BLOCKLAB_PORT : 8080;
    const serverURL = process.env.REACT_APP_SERVER_URL ? `https://${process.env.REACT_APP_SERVER_URL}` : `http://localhost:${portToUse}`

    var dslEditor = xtext.createEditor({
      container: xtextEditorElement,
      serviceUrl: `${serverURL}/xtext-service`,
      tabSize: 2,
      useSoftTabs: true,
      syntaxDefinition: 'ace/mode/blocklab',
      theme: editorTheme,
      xtextLang: 'blocklab',
      sendFullText: true,
    });
    
    dslEditor.getSession().on('changeAnnotation', function () {
      setEditorErrors(dslEditor.session.getAnnotations());
     });
    setXtextEditor(dslEditor);
  }, []);

  useEffect(() => {
    if (xtextEditor !== null) {
      // const editorTheme = theme.palette.mode === 'dark' ? 'ace/theme/github_dark' : 'ace/theme/github';
      const editorTheme = theme.palette.mode === 'dark' ? 'ace/theme/cloud9_night' : 'ace/theme/cloud9_day';
      xtextEditor.setTheme(editorTheme);
    }
  }, [theme])

  const errorTooltipContent = (buttonName) => {
    if (editorErrors.length > 0) {
      let editorErrorstr = '';
      editorErrors.map((errorAnnotation) => {
        editorErrorstr += 'Line ' + (errorAnnotation.row + 1) + ': ' + errorAnnotation.text + '\n';
      })
      return <div style={{ whiteSpace: 'pre-line', fontSize: '1.5em' }}><strong>{'Violations:\n'}</strong>{editorErrorstr}</div>;
    } else if (openProjectIndex >= 0) {
      return buttonName + ' ' + projects[openProjectIndex].name;
    }
  }

  return (
    <div style={{display: 'grid', gridTemplateColumns: isCollapsed ? '80px 1fr' : '450px 1fr'}}>
      <DashboardSidebar 
        projects={projects} 
        setProjects={setProjects} 
        openProjectIndex={openProjectIndex} 
        setOpenProjectIndex={setOpenProjectIndex} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isReset={isReset}
        setIsReset={setIsReset}
        editorErrors={editorErrors}
        xtextEditor={xtextEditor}
        setInitialState={setInitialState}
        setErrors={setErrors}
        errorTooltipContent={errorTooltipContent}
      />
        <Box key={dashboardOptions} display='flex' p={'16px'}>

          <BlocklyEditor
            key={`${openProjectIndex}_${isReset}`}
            value={openProjectIndex >= 0 && projects[openProjectIndex] ? projects[openProjectIndex].blocklyJSON : null}
            className={isCollapsed ? 'blocklyWorkspaceCollapsed' : 'blocklyWorkspace'}
            onChange={(json) => {
              if (openProjectIndex >= 0 && projects[openProjectIndex]) {
                console.log(JSON.stringify(json));
                projects[openProjectIndex].blocklyJSON = json;
                setAndSaveProjects(setProjects, projects);
              }
            }}
            onWorkspaceChange={(ws) => {
              if (openProjectIndex >= 0) {
                var generatedCode = dslGenerator.workspaceToCode(ws);

                // replace the contract parameter placeholder
                if (dslGenerator.contractParams.length > 0){
                  generatedCode = generatedCode.replace(dslGenerator.CONTRACTPARAMS_PLACEHOLDER, '(' +dslGenerator.contractParams.toString() + ')');
                } else {
                  generatedCode = generatedCode.replace(dslGenerator.CONTRACTPARAMS_PLACEHOLDER, '');
                }
                
                // replace the transaction parameter placeholder for each transaction
                for (let [key, value] of  dslGenerator.transactionParams.entries()) {
                  generatedCode = generatedCode.replace(dslGenerator.TRANSACTIONPARAMS_PLACEHOLDER_PREFIX + key, '(' +value.toString() + ')');
                }
                dslGenerator.transactionIds.forEach(transactionId => {
                  generatedCode = generatedCode.replace(dslGenerator.TRANSACTIONPARAMS_PLACEHOLDER_PREFIX + transactionId, '');
                });

                // reset for the next generation
                dslGenerator.contractParams = [];				
                dslGenerator.transactionIds = [];
                dslGenerator.transactionParams = new Map([]);

                // if the generated code differs, update the state and the xtext editor content
                if (previousGeneratedCode !== generatedCode) {
                  projects[openProjectIndex].dslCode = generatedCode;
                  setAndSaveProjects(setProjects, projects);
                  setPreviousGeneratedCode(generatedCode);
                  if (dashboardOptions.autoUpdateDSLCode) {
                    xtextEditor.setValue('');
                    xtextEditor.session.insert(xtextEditor.getCursorPosition(), generatedCode);
                  }
                }
              }
            }}
            theme={theme}  
          />
          <div ref={xtextEditorRef} style={{height: '100%', width: '33%', float: 'left', border: '1px solid ' + colors.grey[500] }} />
        </Box>
        
        {openProjectIndex < 0 && (
          <Box key={isCollapsed} 
            marginLeft={isCollapsed ? '80px' : '450px'}
            zIndex={100}
            position='fixed'
            color={colors.grey[100]}
            backgroundColor={colors.primary[500]}
            width={'100%'}
            height={'100%'}
            >
            <Box 
              fontSize={'20px'}
              display={'flex'}
              paddingRight={isCollapsed ? '50%' : '60%'}
              justifyContent={'right'}
              marginTop={'300px'} 
              position={'fixed'} 
              width={'100%'}
              height={'100%'}
            >
              <span> 
                Select a project from <br /> 
                the sidebar to the left or <br /> 
                create a new project <NoteAddOutlinedIcon style={{position: 'fixed', marginTop: '5px', marginLeft: '5px'}} /> 
              </span>
            </Box>
          </Box>
        )}
    </div>
  );
};

export default Dashboard;