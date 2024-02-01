import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ErrorDialog = (props) => {

  return (
    <div>
      <Dialog
        open={props.isDialogOpened}
        onClose={props.handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Error
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.errors}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color='secondary' autoFocus onClick={props.handleCloseDialog}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ErrorDialog;