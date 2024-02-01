import * as React from 'react';
import { Dialog, Box, Button, TextField, Checkbox, FormControlLabel, Divider } from '@mui/material';
import * as dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const TransactionDialog = (props) => {

  const executeTransactionData = props.executeTransactionData;
  const setExecuteTransactionData = props.setExecuteTransactionData;

  const updateTransactionParam = (event, transactionParamIndex) => {
    let transactionParamsTmp = [...executeTransactionData.transaction.params];
    if(transactionParamsTmp[transactionParamIndex].type === 'Date') {
      transactionParamsTmp[transactionParamIndex].value = event.format();
    } else if (transactionParamsTmp[transactionParamIndex].type === 'Boolean') {
      transactionParamsTmp[transactionParamIndex].value = event.target.checked;
    } else {
      transactionParamsTmp[transactionParamIndex].value = event.target.value;
    }

    setExecuteTransactionData({
      ...executeTransactionData,
      transaction: {
        ...executeTransactionData.transaction,
        params: transactionParamsTmp
      }
    })
  }

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <Dialog
        open={props.isDialogOpened}
        onClose={props.handleCloseDialog}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      > 

        {executeTransactionData.transaction != null && (
        <div>
          <DialogTitle id='alert-dialog-title' fontWeight={600}>
            Parameters for transaction: {executeTransactionData.transaction.name}
          </DialogTitle>
          <DialogContent>
            <Divider />
            <br />
            <form target='/' onSubmit={e => onSubmit(e)}>
              
            {executeTransactionData.transaction.params !== undefined && executeTransactionData.transaction.params.length > 0 && (
            <div>
                <Box
                  display='grid'
                  gridTemplateColumns='repeat(2, 1fr)'
                  gridAutoRows='60px'
                  rowGap='0px'
                  columnGap='12px'
                  marginBottom='0px'
                >
                  {executeTransactionData.transaction.params.map((transactionParam, transactionParamIndex) => {
                  return (
                    <Box
                      key={`${'transactionParam'}_${transactionParamIndex}`}
                      gridColumn='span 1'
                      gridRow='span 1'
                      overflow='auto'
                      paddingTop='4px'
                    >
                      {transactionParam.type === 'Date'  &&
                        <DateTimePicker
                          required
                          label={transactionParam.paramName}
                          format='DD.MM.YYYY HH:mm'
                          slotProps={{ textField: { size: 'small', required: true, color: 'secondary' }}}
                          value={dayjs(transactionParam.value)}
                          onChange={date => updateTransactionParam(date, transactionParamIndex)}
                        />
                      }

                      {transactionParam.type === 'Number'  &&
                        <TextField
                          type='number'
                          required
                          inputProps={{ min: 0, step: 1, style: { textAlign: 'right' } }}
                          size='small'
                          color='secondary'
                          label={transactionParam.paramName}
                          value={transactionParam.value}
                          onChange={event => updateTransactionParam(event, transactionParamIndex)}
                        />
                      }
                      
                      {transactionParam.type === 'Text'  &&
                        <TextField
                          required
                          size='small'
                          color='secondary'
                          label={transactionParam.paramName}
                          value={transactionParam.value || ''}
                          onChange={event => updateTransactionParam(event, transactionParamIndex)}
                        />
                      }
                      
                      {transactionParam.type === 'Boolean'  &&
                        <FormControlLabel control={<Checkbox
                          color='secondary'
                          checked={transactionParam.value}
                          onChange={event => updateTransactionParam(event, transactionParamIndex)}
                        />} label={transactionParam.paramName} labelPlacement='start' />
                        
                      }
                    </Box>
                  );})
                }
              </Box>

            </div>
            )}

            </form>
          </DialogContent>
          </div>
        )}
        <DialogActions>
          <Button color='secondary' onClick={props.handleCloseDialog}>Cancel</Button>
          <div style={{flex: '1 0 0'}} />
          <Button color='secondary' autoFocus onClick={props.handleTransactionDialogExecute}>Execute</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TransactionDialog;