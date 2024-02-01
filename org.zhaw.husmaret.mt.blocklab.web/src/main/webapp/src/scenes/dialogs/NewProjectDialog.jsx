import * as React from 'react';
import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const NewProjectDialog = (props) => {

  const newProjectName = props.newProjectName;
  const setNewProjectName = props.setNewProjectName;
  const isDuplicateDialog = props.isDuplicateDialog;

  return (
    <div>
      <Dialog
        disableRestoreFocus
        open={props.isDialogOpened}
        onClose={props.handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {isDuplicateDialog ? 'Duplicate Project' : 'New Project'}
        </DialogTitle>
        <DialogContent>
          <form target='/' onSubmit={e => e.preventDefault()}>
            <div style={{ paddingTop: '8px'}}>
              <TextField
                required
                size='small'
                color='secondary'
                label='New project name'
                value={newProjectName}
                inputRef={input => input && input.focus()}
                onChange={event => setNewProjectName(event.target.value)}
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={props.handleCloseDialog}>Cancel</Button>
          <div style={{ flex: '1 0 0' }} />
          <Button color='secondary' onClick={props.handleCreateNewProject}>{isDuplicateDialog ? 'Duplicate Project' : 'Create Project'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default NewProjectDialog;