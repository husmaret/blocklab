import * as React from 'react';
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const SimulationRestartDialog = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div>
      <Dialog
        open={props.isDialogOpened}
        onClose={props.handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Simulation restart
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you really want to restart the simulation?<br />
            With <span style={{color: colors.accent[500], fontWeight: 'bold'}}>Restart with new values</span> you can alter the initial values for the simulation.<br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={props.handleCloseDialog}>No</Button>
          <div style={{flex: '1 0 0'}} />
          <Button color='secondary' autoFocus onClick={props.handleSimulationRestartDialogExecute}>Restart</Button>
          <Button color='secondary' onClick={props.handleSimulationRestartDialogExecuteNewValues}>Restart with new values</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SimulationRestartDialog;