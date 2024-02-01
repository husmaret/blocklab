import { Autocomplete, Box, Button, IconButton, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import * as dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { convertExpressionHumanReadable, convertStatementsHumanReadable, getDefaultCurrency, replaceVariablesinExpression } from '../../scenes/global/SimulationHelper';
import CustomWidthTooltip from '../CustomWidthTooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const TransactionControl = (props) => {

    const simulationState = props.simulationState;

    const [participantSelected, setParticipantSelected] = useState(false);
    const [participantLabel, setParticipantLabel] = useState(null);
    const [participantNameReadOnly, setParticipantNameReadOnly] = useState(false);

    const getRoleOptions = () => {
      const roleOptions = [];
      
      props.currentParticipants.map((participant) => {
        roleOptions.push({ label: participant.name + ' (' + participant.role + ')', role: participant.role, name: participant.name, nameReadOnly: true });
      });
      
      if (simulationState.transactions.some((t) => t.allowedByAnyone)) {
        roleOptions.push({ label: 'New participant (Anyone)', role: 'Anyone', name: '', nameReadOnly: false });
      }
      simulationState.roles.map((role) => {
        var counter = 1;
        while (props.currentParticipants.some((p) => p.name === role + '_' + counter)) {
          counter += 1;
        }
        roleOptions.push({ label: 'New participant (' + role + ')', role: role, name: role + '_' + counter, nameReadOnly: false });
      });

      return roleOptions;
    }

    const valuesContainer = {
      transactionValue: props.nextTransactionValue,
      transactionParams: [],
      contractParams: simulationState.contractParams,
      currentProperties: props.currentProperties,
      currentParticipants: props.currentParticipants
    }

    const [nextTransactionDateTimeError, setNextTransactionDateTimeError] = useState();
    const [nextTransactionValueError, setNextTransactionValueError] = useState();
    const [nextTransactionParticipantNameError, setNextTransactionParticipantNameError] = useState();
    const [nextTransactionParticipantRoleError, setNextTransactionParticipantRoleError] = useState();

    const simulationEnded = () => { return props.simulationEndData.date != null }

    useEffect(() => {
        // reset the conditions
        setConditions([]);
        // recalculate the conditions for all transactions
        var conditionsTmp = [];
        simulationState.transactions.map((transaction, i) => {
          return conditionsTmp[i] = checkConditions(transaction);
        });
        setConditions(conditionsTmp);
    }, [props.nextTransactionDateTime, props.nextTransactionParticipantRole, props.nextTransactionParticipantName, props.nextTransactionValue, nextTransactionDateTimeError])

    // add empty condition arrays for each transaction
    const [conditions, setConditions] = useState(simulationState.transactions.map((_) => {
        return [];
    }));

    const getDateFromTimeout = (timeout, contractParams, simulationStart) => {
      if (timeout.contractParam != null) {

        const indexOfContractParam = contractParams.findIndex((contractParam) => contractParam.paramName === timeout.contractParam);
        if (indexOfContractParam >= 0){
          return contractParams[indexOfContractParam].value;
        } else {
          alert('Contract parameter \'' + timeout.contractParam + '\' not found');
        }
      } else if (timeout.offsetInSeconds > 0) {
        return dayjs(simulationStart).add(timeout.offsetInSeconds, 'seconds');
      } 
      return timeout.value;
    }

    const checkConditions = (transaction) => {
        var conditionsTmp = [];
        
        if (simulationEnded()){
          conditionsTmp.push({
            error: 'Simulation has already finished',
            value: false
          });
          return conditionsTmp;
        }
        
        if (nextTransactionDateTimeError != null) {
          conditionsTmp.push({
            error: 'Next transaction date has to be after current simulation time',
            value: false
          });
        }
        
        if (!participantSelected) {
          conditionsTmp.push({
            error: 'Select a participant first',
            value: false
          });
        }
        
        if (nextTransactionParticipantNameError) {
          conditionsTmp.push({
            error: 'Participant name has to be unique for a new participant',
            value: false
          });
        }

        // return the errors from the transaction form if any before checking the other conditions
        if (conditionsTmp.length > 0) {
          return conditionsTmp;
        }
        // set the current transactionsparameter
        const valuesContainerWithTransactionParams = {...valuesContainer, transactionParams: transaction.params};

        if (transaction.condition != null && transaction.condition !== '' && transaction.condition !== 'true') {	

            const transactionConditionValue = replaceVariablesinExpression(transaction.condition, true, valuesContainerWithTransactionParams);
            const transactionConditionHumanReadable = replaceVariablesinExpression(transaction.condition, false, valuesContainerWithTransactionParams);
            // try catch exception
            try {
              var evaluatedTransactionCondition = eval(transactionConditionValue);
              conditionsTmp.push({
                name: convertExpressionHumanReadable(transactionConditionHumanReadable, true),
                error: convertExpressionHumanReadable(transactionConditionHumanReadable, false),
                value: evaluatedTransactionCondition,
              });
            } catch (err) {
              console.log('*****************************');
              console.log(transactionConditionValue);
              console.log(err);
              console.log('*****************************');
            }
        }

        if (transaction.allowed != null) {
            
            if (transaction.allowed === 'Anyone' || transaction.allowed === '${TransactionCaller}') {
              // ignore any checks here
            } else if (
              transaction.allowed.startsWith('Anyone(') && transaction.allowed.endsWith(')') || 
              transaction.allowed === '${Creator}' || 
              transaction.allowed.startsWith('$R{') && transaction.allowed.endsWith('}')
            ) {
              // check if the role matches the selected role
              var role = transaction.allowed.substring(3, transaction.allowed.length-1);
              if (transaction.allowed === '${Creator}'){
                role = 'Creator';
              } else if (transaction.allowed.startsWith('Anyone(') && transaction.allowed.endsWith(')')) {
                role = transaction.allowed.substring(7, transaction.allowed.length-1)
              }
              conditionsTmp.push({
                name: 'Participant role is \'' + role + '\'',
                error: 'Participant role is not \'' + role + '\'',
                value: role === props.nextTransactionParticipantRole
              });
            } else if (transaction.allowed.startsWith('$P{') && transaction.allowed.endsWith('}')){
              const participant = transaction.allowed.substring(3, transaction.allowed.length-1);
              conditionsTmp.push({
                name: 'Participant name is \'' + participant + '\'',
                error: 'Participant name is not \'' + participant + '\'',
                value: participant === props.nextTransactionParticipantName
              });
            }
        }
        
        if (transaction.onlyOnce) {
          conditionsTmp.push({
            name: 'This transaction has not been executed yet',
            error: 'This transaction has already been executed',
            value: !props.currentTransactions.some((tx) => tx.transaction === transaction.name)
           });
        };
        
        transaction.previousTransactions.map((previousTransaction) => {
          return conditionsTmp.push({
            name: 'Transaction \'' + previousTransaction + '\' has been executed',
            error: 'Transaction \''+previousTransaction+'\' has not been executed yet',
            value: props.currentTransactions.some((transaction) => transaction.transaction === previousTransaction)
          });
        });

        transaction.beforeTimeouts.map((beforeTimeout) => {
          const beforeTimeoutValue = getDateFromTimeout(beforeTimeout, simulationState.contractParams, simulationState.simulationStart);
          if (beforeTimeoutValue != null) {
            conditionsTmp.push({
              name: 'Next transaction date is before Timeout \'' + dayjs(beforeTimeoutValue).format("DD.MM.YYYY HH:mm") + '\'',
              error: 'Next transaction date is not before Timeout \'' + dayjs(beforeTimeoutValue).format("DD.MM.YYYY HH:mm") + '\'',
              value: props.nextTransactionDateTime.isBefore(dayjs(beforeTimeoutValue))
            });
          }
          return conditionsTmp;
        });
        
        transaction.afterTimeouts.map((afterTimeout) => {
          const afterTimeoutValue = getDateFromTimeout(afterTimeout, simulationState.contractParams, simulationState.simulationStart);
            if (afterTimeoutValue != null) {
              conditionsTmp.push({
                  name: 'Next transaction date is after Timeout \'' + dayjs(afterTimeoutValue).format("DD.MM.YYYY HH:mm") + '\'',
                  error: 'Next transaction date is not after Timeout \'' + dayjs(afterTimeoutValue).format("DD.MM.YYYY HH:mm") + '\'',
                  value: props.nextTransactionDateTime.isAfter(dayjs(afterTimeoutValue))
              });
            }
            return conditionsTmp;
        });

        return conditionsTmp;
    }

    return (
        <div>
        <Box
            display='grid'
            gridTemplateColumns={'repeat('+(simulationState.useAccountBalances ? '2' : '1')+', 1fr)'}
            gridAutoRows='44px'
            gap='0px 32px'
            p='16px 16px 0px 16px '
          >
            <DateTimePicker
              required
              disabled={simulationEnded()}
              label='Next transaction on'
              format='DD.MM.YYYY HH:mm'
              slotProps={{ textField: { size: 'small', required: true, color: 'secondary', helperText: nextTransactionDateTimeError } }}
              value={props.nextTransactionDateTime}
              onChange={date => 
                props.setNextTransactionDateTime(dayjs(date))
              }
              minDateTime={dayjs(props.currentSimulationDate).add(1, 'minutes')}
              onError={(reason, value) => {
                if (reason === 'minTime' || reason === 'minDate') {
                  setNextTransactionDateTimeError('Has to be after the current simulation time');
                } else {
                  setNextTransactionDateTimeError(null);
                }
              }}
            />

            <TextField
              type='number'
              disabled={simulationEnded()}
              inputProps={{ required: true, min: 0, step: 1, style: { textAlign: 'right' } }}
              size='small'
              color='secondary'
              label={'Transaction value ('+getDefaultCurrency(simulationState.ecosystem)+')'}
              value={props.nextTransactionValue}
              onChange={event => props.setNextTransactionValue(Number(event.target.value))}
            />

            <Autocomplete
              disableClearable
              options={getRoleOptions()}
              disabled={simulationEnded()}
              isOptionEqualToValue={(option, value) => option.label === value}
              color='secondary'
              size='small'
              renderInput={(params) => <TextField {...params} required={true} color='secondary' label='Participant' />}
              value={participantLabel}
              onChange={(_, data) => {
                props.setNextTransactionParticipantRole(data.role);
                props.setNextTransactionParticipantName(data.name);
                setParticipantNameReadOnly(data.nameReadOnly);
                setParticipantLabel(data.label);
                // set if there is a name set already
                setParticipantSelected(data.name);
              }}
            />

            <TextField
              disabled={simulationEnded() || participantNameReadOnly}
              size='small'
              color='secondary'
              label='Participant name'
              value={props.nextTransactionParticipantName}
              error={!participantNameReadOnly && props.currentParticipants.some(p => p.name === props.nextTransactionParticipantName)}
              helperText={nextTransactionParticipantNameError}
              required={true}
              onChange={event => {
                props.setNextTransactionParticipantName(event.target.value);
                setParticipantSelected(event.target.value);
                if (!participantNameReadOnly && props.currentParticipants.some(p => p.name === event.target.value)) {
                  setNextTransactionParticipantNameError('Name has to be unique among participants');
                  setParticipantSelected(false);
                } else {
                  setNextTransactionParticipantNameError('');
                  setParticipantSelected(true);
                }
              }}
            />

          </Box>
          
          <Box
            display='grid'
            gridTemplateColumns='repeat(2, 1fr)'
            gridAutoRows='48px'
            gap='0px'
          >
          
          {simulationState.transactions.map((transaction, transactionIndex) => (
          
            <div key={transactionIndex} style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                padding: '8px 16px',
            }}>
            
            <CustomWidthTooltip placement={'bottom'} title={<div style={{ whiteSpace: 'pre-line', fontSize: '1.5em' }}><strong>{'Conditions:\n'}</strong>{conditions[transactionIndex].map(condition => (condition.value ? '✅ ' + condition.name : '❌ ' + condition.error) + '\n')}</div>}>
              <span style={{ width: '85%' }}>
                <Button 
                  type='submit'
                  variant='contained' 
                  color='secondary' 
                  fullWidth={true}
                  endIcon={<KeyboardArrowRightIcon />}
                  sx={{
                    whiteSpace: 'nowrap',
                  }}
                  disabled={conditions[transactionIndex].some((condition) => !condition.value)}
                  value={transaction}
                  onClick={() => {
                    props.setExecuteTransactionData(
                      {
                        executeTransaction: true,
                        transaction: transaction,
                        transactionCaller: {
                          name: props.nextTransactionParticipantName,
                          address: null,
                          role: props.nextTransactionParticipantRole,
                        },
                        transactionValue: props.nextTransactionValue,
                      }
                    )
                  }}
                >
                  {transaction.name.length > 20 ? transaction.name.substring(0, 20) + '...' : transaction.name}
                </Button>
              </span>
            </CustomWidthTooltip>

            {!simulationEnded() && (
            <CustomWidthTooltip placement={'bottom'} title={<div style={{ whiteSpace: 'pre-line', fontSize: '1.5em' }}><strong>{"Statements:\n"}</strong>{convertStatementsHumanReadable(transaction.statements, 1, 0, false, {...valuesContainer, transactionParams: transaction.params})}</div>}>
              <span style={{ width: '15%' }}>
                <IconButton>
                  <InfoOutlinedIcon />
                </IconButton>
              </span>
            </CustomWidthTooltip>
            )}

          </div>
          ))}
            
        </Box>
    </div>
    );
}

TransactionControl.propTypes = {
    simulationState: PropTypes.object.isRequired,
    nextTransactionDateTime: PropTypes.object.isRequired,
    setNextTransactionDateTime: PropTypes.func.isRequired,
    nextTransactionValue: PropTypes.number,
    setNextTransactionValue: PropTypes.func.isRequired,
    nextTransactionParticipantName: PropTypes.string,
    setNextTransactionParticipantName: PropTypes.func.isRequired,
    nextTransactionParticipantRole: PropTypes.string,
    setNextTransactionParticipantRole: PropTypes.func.isRequired,
    simulationEndData: PropTypes.object.isRequired,
    currentProperties: PropTypes.array.isRequired,
    currentParticipants: PropTypes.array.isRequired,
    currentTransactions: PropTypes.array.isRequired,
    setExecuteTransactionData: PropTypes.func.isRequired,
}

export default TransactionControl;
