import * as React from 'react';
import * as dayjs from "dayjs";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const SimulationEndDialog = (props) => {

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
          Smart Contract Simulation finished
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The smart contract has finished at <span style={{color: colors.accent[500], fontWeight: 'bold'}}>{dayjs(props.simulationEndData.date).format('DD.MM.YYYY HH:mm')}</span>.<br />
            {props.simulationEndData.accountBalances !== null && props.simulationEndData.accountBalances.participants.length > 0 && (
              <div>The following balances will be refunded to the participants:</div>
            )}
            {props.simulationEndData.accountBalances !== null && props.simulationEndData.accountBalances.participants.map((participant, index) => (
              <div key={index}>
                <br />
                <span style={{color: colors.accent[500], fontWeight: 'bold'}}>{participant.name}:</span><br />
                {participant.balances.map((balance) => (
                  <div key={balance.token}>
                    <span style={{fontWeight: 'bold'}}>{balance.token}</span>: {balance.value}<br />
                  </div>
                ))}
              </div>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color='secondary' autoFocus onClick={props.handleCloseDialog}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SimulationEndDialog;