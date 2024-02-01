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

const TimeoutAlertDialog = (props) => {

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
          {props.timeoutAlertData.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to forward to this timeout at <span style={{color: colors.accent[500], fontWeight: 'bold'}}>{dayjs(props.timeoutAlertData.date).format('DD.MM.YYYY HH:mm')}</span>?<br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={props.handleCloseDialog}>No</Button>
          <div style={{flex: '1 0 0'}} />
          <Button color='secondary' autoFocus onClick={props.handleCloseDialogAgree}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TimeoutAlertDialog;