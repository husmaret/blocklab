import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Simulator from "./scenes/simulator/Simulator";
import Generator from "./scenes/generator/Generator";
import Dashboard from "./scenes/dashboard/Dashboard";
import Topbar from "./scenes/global/Topbar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { deDE } from '@mui/x-date-pickers/locales';
import ErrorDialog from "./scenes/dialogs/ErrorDialog";
import { auctionExample, becomeRichestExample, counterExample, purchaseExample, timelockExample } from "./data/defaultProjects";

export const setAndSaveProjects = (setProjects, projects) => {
  window.localStorage.setItem('PROJECTS', JSON.stringify(projects));
  setProjects(projects);
}

function App() {
  const [theme, colorMode] = useMode();

  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errors, setErrors] = useState([]);
  const [editorErrors, setEditorErrors] = useState([]);
  const [dashboardOptions, setDashboardOptions] = useState({
    autoUpdateDSLCode: true
  });
  
  const [initialState, setInitialState] = useState({
    properties: [],
    contractParams: [],
    timeouts: [],
    transactions: [],
    roles: [],
    participants: [],
    generatedFiles: []
  });
  const [title, setTitle] = useState("BlockLab Development Environment");

  const defaultProjects = [];
  defaultProjects.push(counterExample);
  defaultProjects.push(timelockExample);
  defaultProjects.push(becomeRichestExample);
  defaultProjects.push(purchaseExample);
  defaultProjects.push(auctionExample);

  useEffect(() => {
    if (errors !== undefined && errors.length > 0) {
      setIsErrorDialogOpen(true);
    }
  }, [errors]);

  const [projects, setProjects] = useState(JSON.parse(window.localStorage.getItem('PROJECTS')) ?? defaultProjects);
  const [openProjectIndex, setOpenProjectIndex] = useState(-1);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isReset, setIsReset] = useState(false);

  useEffect(() => {
    if (openProjectIndex >= 0) {
      setTitle("Project: " + projects[openProjectIndex].name);
    }
  }, [openProjectIndex])
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}>
          <CssBaseline />
          <div className="app">
            <main className="content">
              <Topbar 
                title={title} 
                isCollapsed={isCollapsed} 
                editorErrors={editorErrors}
                dashboardOptions={dashboardOptions} 
                setDashboardOptions={setDashboardOptions} 
                openProjectIndex={openProjectIndex}
              />
              <Routes>
                <Route path="*" element={
                  <Dashboard 
                    setInitialState={setInitialState} 
                    projects={projects}
                    setProjects={setProjects}
                    openProjectIndex={openProjectIndex}
                    setOpenProjectIndex={setOpenProjectIndex}
                    setErrors={setErrors}
                    editorErrors={editorErrors}
                    setEditorErrors={setEditorErrors}
                    isCollapsed={isCollapsed} 
                    setIsCollapsed={setIsCollapsed}
                    isReset={isReset} 
                    setIsReset={setIsReset}
                    dashboardOptions={dashboardOptions}
                  />
                } />
                <Route path="/blocklabIDE/simulator" element={<Simulator initialState={initialState} setErrors={setErrors} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />} />
                <Route path="/blocklabIDE/generator" element={<Generator initialState={initialState} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />} />
              </Routes>
            </main>
            <ErrorDialog
              isDialogOpened={isErrorDialogOpen}
              handleCloseDialog={() => setIsErrorDialogOpen(false)}
              errors={errors}
            />
          </div>
        </LocalizationProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;