import { Box, Chip, Typography, IconButton, useTheme, Tooltip, Icon } from '@mui/material';
import * as dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import BarChart from '../../components/simulator/BarChart';
import HorizontalTimelineContent from '../../components/timeline/HorizontalTimelineContent';
import { tokens } from '../../theme';
import SimulatorSidebar from './SimulatorSidebar';
import EventNavigation from '../../components/simulator/EventNavigation';
import TransactionControl from '../../components/simulator/TransactionControl';
import CustomWidthTooltip from '../../components/CustomWidthTooltip';
import TransactionDialog from '../dialogs/TransactionDialog';
import SimulationEndDialog from '../dialogs/SimulationEndDialog';
import TimeoutAlertDialog from '../dialogs/TimeoutAlertDialog';
import SimulationRestartDialog from '../dialogs/SimulationRestartDialog';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';

import { replaceVariablesinExpression, parseParticipantExpression, showTransactionData, getDefaultCurrency } from '../global/SimulationHelper';

const Simulator = (props) => {

  const initialState = props.initialState;
  const setErrors = props.setErrors;
  const isCollapsed = props.isCollapsed;
  const setIsCollapsed = props.setIsCollapsed;

  const [simulationState, setSimulationState] = useState({...initialState, state: 'Initializing'});
  const [simulationStateToReset, setSimulationStateToReset] = useState(JSON.parse(JSON.stringify(simulationState)));

  console.log(simulationState)

  const defaultExecuteTransactionData = {
    executeTransaction: false,
    transaction: {
      statements: [],
      params: [],
      name: null,
    },
    transactionCaller: {
      name: null,
      address: null,
      role: null,
    },
    transactionValue: null,
  }

  const defaultSimulationEndData = {
    date: null,
    accountBalances: null,
    endSimulation: false,
  };

  Object.freeze(defaultExecuteTransactionData);

  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [executeTransactionData, setExecuteTransactionData] = useState(defaultExecuteTransactionData);
  
  const [isTimeoutAlertOpen, setIsTimeoutAlertOpen] = useState(false);
  const [timeoutAlertData, setTimeoutAlertData] = useState({
    index: null,
    date: null,
    name: null,
  });

  const [isSimulationEndDialogOpen, setIsSimulationEndDialogOpen] = useState(false);
  const [simulationEndData, setSimulationEndData] = useState(defaultSimulationEndData);
  
  const [isSimulationRestartDialogOpen, setIsSimulationRestartDialogOpen] = useState(false);

  const [nextTransactionDateTime, setNextTransactionDateTime] = useState(dayjs());
  const [nextTransactionValue, setNextTransactionValue] = useState(0);
  const [nextTransactionParticipantName, setNextTransactionParticipantName] = useState('');
  const [nextTransactionParticipantRole, setNextTransactionParticipantRole] = useState('');

  const [state, setState] = useState({
    value: 0,
    previous: 0,
    maxIndex: 0,
    timelineData: [{
      date: dayjs().format(),
      title: '',
      isTimeout: false,
      timeoutStatements: [],
    }],
  });

  const [properties, setProperties] = useState([[]]);
  const [transactionLog, setTransactionLog] = useState([[]]);
  
  const [participants, setParticipants] = useState([]);
  
  const [accountBalances, setAccountBalances] = useState([{
    participants: []
  }]);
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  useEffect(() => {

    const initialStateTmp = JSON.parse(JSON.stringify(initialState));

    let initialParticipantsTmp = [];
    
    let contractParams = JSON.parse(JSON.stringify(initialStateTmp.contractParams));
    contractParams.map((contractParam, contractParamIndex) => {
      if (contractParam.type === 'Date') {
        contractParams[contractParamIndex].value = dayjs().add(contractParamIndex + 1, 'hours');
      }
    });

    let timeouts = JSON.parse(JSON.stringify(initialStateTmp.timeouts));
    timeouts.map((timeout, timeoutIndex) => {
      if (timeout.contractParam != null) {
        const indexOfContractParam = contractParams.findIndex((contractParam) => contractParam.paramName === timeout.contractParam);
        if (indexOfContractParam >= 0) {
          timeouts[timeoutIndex].value = contractParams[indexOfContractParam].value;
        }
      } else if (timeout.offsetInSeconds > 0) {
        timeouts[timeoutIndex].value = dayjs(initialStateTmp.simulationStart).add(timeout.offsetInSeconds, 'seconds');
      }
    });

    const newSimulationState = {
      ...initialStateTmp,
      contractParams: contractParams,
      timeouts: timeouts
    }

    setSimulationState({
      ...newSimulationState,
      state: 'Initializing'
    })
    
    if (initialStateTmp.useCreatorRole) {
      initialParticipantsTmp.push({
        name: 'Creator',
        address: null,
        role: 'Creator',
      });
    }

    initialStateTmp.participants.map((participant) => {
      initialParticipantsTmp.push({
        name: participant.name,
        address: participant.address,
        role: 'Anyone',
      });
    })
    setParticipants([initialParticipantsTmp]);
    setNextTransactionParticipantRole(initialStateTmp.useAnyoneRole ? 'Anyone' : '');

  }, [initialState]);

  const restartSimulator = (newInitialValues) => {
    // reset simulation end data
    setSimulationEndData(defaultSimulationEndData);

    if (newInitialValues) {
      setSimulationState({...simulationStateToReset, state: 'Initializing'});
    } else {
      setSimulationState({...simulationStateToReset, state: 'Restart'});
    }

    setNextTransactionDateTime(dayjs());
    setNextTransactionValue(0);
    setNextTransactionParticipantName('');
    setNextTransactionParticipantRole(simulationState.useAnyoneRole ? 'Anyone' : '');

    setIsCollapsed(!newInitialValues);
  }

  const handleIndexChange = (index) => {
    if (index > state.maxIndex) {

      if (simulationEndData.date != null) {
        // ignore forward clicks on timeline when simulation is finished
        return;
      }

      // if the new index is a timout, open a dialog (only for the first time)
      if (state.timelineData[index].isTimeout) {
        
        const maxDiff = index - state.maxIndex;
        if (maxDiff > 1) {
          setErrors(['It is not allowed to skip a timeout.']);
          return;
        }
        setTimeoutAlertData({
          index: index,
          date: state.timelineData[index].date,
          name: state.timelineData[index].title
        })
        setIsTimeoutAlertOpen(true);
        return;
      }                       
    }
    const calcMaxIndex = index >= state.maxIndex ? index : state.maxIndex;
    setState({ 
      value: index, 
      previous: state.value, 
      maxIndex: calcMaxIndex,
      timelineData: state.timelineData,
    });
    // always have the next event after the last event
    setNextTransactionDateTime(dayjs(state.timelineData[calcMaxIndex].date).add(1, 'minutes'));
  }

  const addBalanceToAccount = (accountBalances, amount, token, account, currentProperties) => {
    account = parseParticipantExpression(account, currentProperties, nextTransactionParticipantName);
    const indexOfParticipant = accountBalances.participants.findIndex((participant) => participant.name === account);
    if (indexOfParticipant >= 0){
      var participantBalance = accountBalances.participants[indexOfParticipant].balances;
      const indexOfToken = participantBalance.findIndex((balance) => balance.token === token);
      if (indexOfToken >= 0) {
        // add deposit to existing balance
        participantBalance[indexOfToken].value = participantBalance[indexOfToken].value  + amount;
      } else {
        // new token
        participantBalance.push({
          token: token,
          value: amount
        })
      }
    } else {
      // new participant
      accountBalances.participants.push({
        name: account,
        address: account,
        balances: [{
          token: token,
          value: amount
        }]
      });
    }
  }
  
  const removeBalanceFromAccount = (statementErrors, accountBalances, amount, token, account, statementType, currentProperties) => {
    account = parseParticipantExpression(account, currentProperties, nextTransactionParticipantName);
    const indexOfFromParticipant = accountBalances.participants.findIndex((participant) => participant.name === account);
    if (indexOfFromParticipant >= 0){
      var participantBalance = accountBalances.participants[indexOfFromParticipant].balances;
      const indexOfToken = participantBalance.findIndex((balance) => balance.token === token);
      if (indexOfToken >= 0) {
        const balanceOfToken = participantBalance[indexOfToken].value;
        if (balanceOfToken >= amount) {
          participantBalance[indexOfToken].value = balanceOfToken - amount;
        } else {
          statementErrors.push('Account of ['+account+'] does not have enough balance to ' + statementType + ' ' + token + ' ' + amount);
        }
      } else {
        statementErrors.push('Account of ['+account+'] does not have enough balance to ' + statementType + ' ' + token + ' ' + amount);
      }
    } else {
      statementErrors.push('Account of ['+account+'] does not have enough balance to ' + statementType + ' ' + token + ' ' + amount);
    }
  }

  const executeStatements = (statements, transactionParams, newProperties, newParticipants, newAccountBalance, statementErrors) => {
    
    statements.forEach((statement) => {
      if (statement !== null) {

        const valuesContainer = {
          transactionValue: nextTransactionValue,
          transactionCallerName: nextTransactionParticipantName,
          transactionParams: transactionParams,
          contractParams: simulationState.contractParams,
          currentProperties: newProperties,
          currentParticipants: newParticipants
        } 

        if (statement.type === 'SetProperty') {
          const indexOfProperty = newProperties.findIndex((property) => property.name === statement.instructions.propertyName);
          if (newProperties[indexOfProperty].type === 'Participant') {
            newProperties[indexOfProperty].value = parseParticipantExpression(statement.instructions.expression, newProperties, nextTransactionParticipantName);
          } else if (newProperties[indexOfProperty].type === 'Date') {
            console.log(statement.instructions.expression)
            newProperties[indexOfProperty].value = new Date(statement.instructions.expression).toISOString();
          } else {
            var expression = replaceVariablesinExpression(statement.instructions.expression, true, valuesContainer);
            newProperties[indexOfProperty].value = eval(expression)
          }
        } else if (statement.type === 'Deposit') {
          const newAmountValue  = eval(replaceVariablesinExpression(statement.instructions.amount, true, valuesContainer));
          addBalanceToAccount(newAccountBalance, newAmountValue, statement.instructions.token, statement.instructions.account, newProperties);
        } else if (statement.type === 'Transfer') {
          const newAmountValue  = eval(replaceVariablesinExpression(statement.instructions.amount, true, valuesContainer));
          removeBalanceFromAccount(statementErrors, newAccountBalance, newAmountValue, statement.instructions.token, statement.instructions.fromAccount, statement.type, newProperties);
          addBalanceToAccount(newAccountBalance, newAmountValue, statement.instructions.token, statement.instructions.toAccount, newProperties);
        } else if (statement.type === 'Withdraw') {
          const newAmountValue  = eval(replaceVariablesinExpression(statement.instructions.amount, true, valuesContainer));
          removeBalanceFromAccount(statementErrors, newAccountBalance, newAmountValue, statement.instructions.token, statement.instructions.account, statement.type, newProperties);
        } else if (statement.type === 'If') {
          var ifCondition = replaceVariablesinExpression(statement.instructions.condition, true, valuesContainer);
          const ifConditionValue  = eval(ifCondition);
          if (ifConditionValue) {
            executeStatements(statement.instructions.statements, transactionParams, newProperties, newParticipants, newAccountBalance, statementErrors);
          }
        } else if (statement.type === 'IfElse') {
          var ifElseCondition = replaceVariablesinExpression(statement.instructions.condition, true, valuesContainer);
          const ifElseConditionValue  = eval(ifElseCondition);
          if (ifElseConditionValue) {
            executeStatements(statement.instructions.statements, transactionParams, newProperties, newParticipants, newAccountBalance, statementErrors);
          } else {
            executeStatements(statement.instructions.elseStatements, transactionParams, newProperties, newParticipants, newAccountBalance, statementErrors);
          }
        } else if (statement.type === 'Finish') {
          if (statementErrors.length === 0) {
            // only finish the simulation when there was no previous error
            setSimulationEndData({
              endSimulation: true,
              date: nextTransactionDateTime.format(),
              accountBalances: newAccountBalance
            });
          }
        }
      }
    })
  }

  const executeTransaction = (currentExecuteTransactionData) => {

    const nextStateValue = state.maxIndex + 1;
                  
    // make a deep copy of the properties
    var newProperties = JSON.parse(JSON.stringify([...properties[state.maxIndex]]));
    
    // make a deep copy of the account balances
    var newAccountBalance = JSON.parse(JSON.stringify(accountBalances[state.maxIndex]));
    
    // make a deep copy of the participants
    var newParticipants = JSON.parse(JSON.stringify([...participants[state.maxIndex]]));
      
    var statementErrors = [];
    executeStatements(currentExecuteTransactionData.transaction.statements, currentExecuteTransactionData.transaction.params, newProperties, newParticipants, newAccountBalance, statementErrors);
    
    if (statementErrors.length > 0){
      setErrors(statementErrors);
      // dont do any update of the state
    } else {
      // update the state when there is no error
      var newPropertiesState = [...properties]
      newPropertiesState.splice(nextStateValue, 0, newProperties);
      setProperties(newPropertiesState);
      
      // add a transaction to the transaction log
      var newTransactionLogState = [...transactionLog]
      // make a deep copy of the transaction log
      var newTransactions = JSON.parse(JSON.stringify([...transactionLog[state.maxIndex]]));
      newTransactions.push({
        date: nextTransactionDateTime.format(),
        transaction: currentExecuteTransactionData.transaction.name,
        participant: currentExecuteTransactionData.transactionCaller.name,
        role: currentExecuteTransactionData.transactionCaller.role,
        // only add amount if the transaction uses the transaction value
        amount: currentExecuteTransactionData.transaction.useTransactionValue ? currentExecuteTransactionData.transactionValue : null,
        transactionParams: currentExecuteTransactionData.transaction.params
      })
      newTransactionLogState.splice(nextStateValue, 0, newTransactions);
      setTransactionLog(newTransactionLogState);
      
      // add a participant to the participants
      var newParticipantState = [...participants]
      const found = newParticipants.some(entry => (entry.name === currentExecuteTransactionData.transactionCaller.name));
      if(!found) {
        newParticipants.push({
          name: currentExecuteTransactionData.transactionCaller.name,
          address: currentExecuteTransactionData.transactionCaller.address,
          role: currentExecuteTransactionData.transactionCaller.role
        });
      }
      newParticipantState.splice(nextStateValue, 0, newParticipants);
      setParticipants(newParticipantState);

      var newAccountBalanceState = [...accountBalances]
      newAccountBalanceState.splice(nextStateValue, 0, newAccountBalance);
      setAccountBalances(newAccountBalanceState);
      
      // also set the next state
      var newTimeLineData = [...state.timelineData]
      newTimeLineData.splice(nextStateValue, 0, {
        date: nextTransactionDateTime.format(),
        title: currentExecuteTransactionData.transaction.name,
        isTimeout: false
      });
      const calcMaxIndex = nextStateValue >= state.maxIndex ? nextStateValue : state.maxIndex;
      setState({ value: nextStateValue, previous: state.value, maxIndex: calcMaxIndex, timelineData: newTimeLineData });
    }
    
    // reset the next transaction data
    setNextTransactionDateTime(dayjs(nextTransactionDateTime).add(1, 'minutes'));
    setNextTransactionParticipantName('');
    setNextTransactionParticipantRole(simulationState.useAnyoneRole ? 'Anyone' : '');
    setNextTransactionValue(0);
  }

  useEffect(() => {
    // execute the transaction as soon as the executeTransactionData changes, if the flag 'executeTransaction' is true
    if (!executeTransactionData.executeTransaction || defaultExecuteTransactionData === executeTransactionData) {
      // ignore if its the default
      return;
    }

    if (executeTransactionData.transaction.params !== undefined && executeTransactionData.transaction.params.length > 0) {
      setIsTransactionDialogOpen(true);
    } else {
      executeTransaction(executeTransactionData);
    }
    // turn flag to false to not execute the transaction twice and reset transaction values
    setExecuteTransactionData({
      ...executeTransactionData,
      transaction: {
        ...executeTransactionData.transaction,
        params: executeTransactionData.transaction.params.map((param) => {
          return {
            ...param,
            value: ''
          }
        })
      },
      executeTransaction: false
    });
  }, [executeTransactionData])

  useEffect(() => {

    // end the simulation as soon as the simulationEndData changes, if the flag 'endSimulation' is true
    if (!simulationEndData.endSimulation || simulationEndData.date == null) {
      // ignore if date is null
      return;
    }

    setIsSimulationEndDialogOpen(true);

    setSimulationEndData({
      ...simulationEndData,
      endSimulation: false,
    })

  }, [simulationEndData])

  
  useEffect(() => {
    if (simulationState.state === 'Running' || simulationState.state === 'Restart'){

      setSimulationStateToReset(JSON.parse(JSON.stringify(simulationState)));

      // do this only when the state is switched to Running
      setNextTransactionDateTime(dayjs(simulationState.simulationStart).add(1, 'minutes'));

      let timeline = [{
        date: dayjs(simulationState.simulationStart).format(),
        title: 'Simulation Start',
        isTimeout: true,
        timeoutStatements: []
      }];
      
      const valuesContainer = {
        transactionValue: nextTransactionValue,
        transactionCallerName: nextTransactionParticipantName,
        transactionParams: [],
        contractParams: simulationState.contractParams,
        currentProperties: [],
        currentParticipants: participants[state.maxIndex]
      }

      simulationState.timeouts.map((timeout) => {
        timeline.push({
          date: dayjs(timeout.value).format(),
          title: timeout.name,
          isTimeout: true,
          timeoutStatements: timeout.statements
        });
      })
    
      // order timeline by date
      timeline = timeline.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return dayjs(a.date).valueOf() - dayjs(b.date).valueOf();
      });
    
      let propertiesTmp = [];
    
      simulationState.properties.map((property) => {
        return propertiesTmp.push({
          type: property.type,
          name: property.name,
          value: replaceVariablesinExpression(property.value, true, valuesContainer),
        });
      })

      setState({
          value: 0,
          previous: 0,
          maxIndex: 0,
          timelineData: timeline,
      });

      setProperties([propertiesTmp]);
    }
  }, [simulationState])
  
  return (
    <div style={{display: 'grid', gridTemplateColumns: '80px 1fr'}}>
      <SimulatorSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} simulationState={simulationState} setSimulationState={setSimulationState} setIsSimulationRestartDialogOpen={setIsSimulationRestartDialogOpen} />
      <div>
        {simulationState.state !== 'Initializing' && (
          <Box m='16px'>
            <div key={state.value}>
            {/* GRID */}

            <Box
              display='grid'
              gridTemplateColumns='repeat(12, 1fr)'
              gridAutoRows='80px'
              paddingBottom={'16px'}
            >
              {/* timeline */}
              <Box
                gridColumn='span 12'
                gridRow='span 1'
                backgroundColor={colors.primary[400]}
              >
                <div key={state.value}>
                  <HorizontalTimelineContent
                    value={state.value}
                    maxIndex={state.maxIndex}
                    previous={state.previous}
                    indexClick={(index) => {
                      handleIndexChange(index)
                    }}
                    timelineData={state.timelineData}
                    theme={theme}
                  />
                </div>
              </Box>
            </Box>
            <Box
              display='grid'
              gridTemplateColumns='repeat(12, 1fr)'
              gridAutoRows='calc((100vh - 196px) / 2)'
              gap='16px'
            >
              {/* transactions */}
              <Box
                gridColumn={simulationState.useAccountBalances ? 'span 4' : 'span 4'}
                gridRow={simulationState.useAccountBalances ? 'span 1' : 'span 2'}
                backgroundColor={colors.primary[400]}
                overflow='auto'
              >
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  borderBottom={`4px solid`}
                  borderColor={colors.primary[500]}
                  colors={colors.grey[100]}
                  p='8px 16px'
                >
                  <Typography color={colors.grey[100]} variant='h5' fontWeight='600'>
                    Transactions
                  </Typography>
                  {(simulationState.state === 'Running' || simulationState.state === 'Restart') && (
                    <Chip label={<div style={{ whiteSpace: 'pre-line', fontSize: '1.2em' }}>Running ...</div>} color='success' />
                  )}
                  {simulationState.state === 'Finished' && (
                    <Chip label={<div style={{ whiteSpace: 'pre-line', fontSize: '1.2em' }}>Finished</div>} color='error' icon={<CancelIcon />} />
                  )}
                  {simulationState.state === 'Initializing' && (
                    <Chip label={<div style={{ whiteSpace: 'pre-line', fontSize: '1.2em' }}>Initializing</div>} color='primary' />
                  )}

                  <EventNavigation 
                    state={state}
                    handleIndexChange={handleIndexChange}
                  />
                </Box>
                
                <TransactionControl 
                  simulationState={simulationState}
                  nextTransactionDateTime={nextTransactionDateTime}
                  setNextTransactionDateTime={setNextTransactionDateTime}
                  nextTransactionValue={nextTransactionValue}
                  setNextTransactionValue={setNextTransactionValue}
                  nextTransactionParticipantName={nextTransactionParticipantName}
                  setNextTransactionParticipantName={setNextTransactionParticipantName}
                  nextTransactionParticipantRole={nextTransactionParticipantRole}
                  setNextTransactionParticipantRole={setNextTransactionParticipantRole}
                  simulationEndData={simulationEndData}
                  currentProperties={[...properties[state.maxIndex]]}
                  currentTransactions={[...transactionLog[state.maxIndex]]}
                  currentParticipants={[...participants[state.maxIndex]]}
                  setExecuteTransactionData={setExecuteTransactionData}
                  currentSimulationDate={state.timelineData[state.maxIndex].date}
                >

                </TransactionControl>
                
              </Box>

              {/* Properties */}
              <Box
                gridColumn={simulationState.useAccountBalances ? 'span 3' : 'span 4'}
                gridRow={'span 1'}
                backgroundColor={colors.primary[400]}
                overflow='auto'
              >
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  borderBottom={`4px solid`}
                  borderColor={colors.primary[500]}
                  color={colors.grey[100]}
                  p='16px'
                >
                  <Typography variant='h5' fontWeight='600'>
                    Asset (Properties)
                  </Typography>
                  <StorageOutlinedIcon />
                </Box>
                
                {properties[state.value].map((property, i) => (
                  <Box
                    key={`${property.name}-${i}`}
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    borderBottom={`4px solid`}
                    borderColor={colors.primary[500]}
                    p='8px 16px'
                  >
                    <Box>
                      <Typography
                        color={colors.accent[500]}
                        variant='h5'
                        fontWeight='600'
                      >
                        <Tooltip arrow placement='top' title={'Property name'}>
                          <span>
                            {property.name} 
                          </span>
                        </Tooltip>
                      </Typography>
                      <Typography color={colors.grey[100]}>
                        <CustomWidthTooltip arrow placement='bottom' title={'Property type'}>
                          <span>
                            {property.type}
                          </span>
                        </CustomWidthTooltip>
                      </Typography>
                    </Box>
                    
                    <Tooltip arrow placement='top' title={'Property value'}>
                      <span>
                        <Box
                          backgroundColor={colors.primary[500]}
                          p='8px 12px'
                          borderRadius='4px'
                          color={colors.grey[100]}
                        >
                            {property.type === 'Date' && 
                              (property.value ? 
                              <Box>{dayjs(property.value).format('DD.MM.YYYY HH:mm')}</Box>
                              :
                              <Box>{'undefined'}</Box>
                              )
                            }
                            {property.type === 'Boolean' &&
                              <Box>{property.value ? 'true' : 'false'}</Box>
                            }
                            {property.type !== 'Date' && property.type !== 'Boolean' &&
                              <Box>{property.value === undefined ? 'undefined' : property.value}</Box>
                            }
                        </Box>
                      </span>
                    </Tooltip>
                  </Box>
                ))}

              </Box>

              {/* state */}
              {simulationState.useAccountBalances && 
                <Box
                  gridColumn='span 5'
                  gridRow='span 2'
                  backgroundColor={colors.primary[400]}
                >
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    borderBottom={`4px solid`}
                    borderColor={colors.primary[500]}
                    color={colors.grey[100]}
                    p='16px'
                  >
                    <Typography variant='h5' fontWeight='600'>
                      Asset (Account balances)
                    </Typography>
                    <AccountBalanceOutlinedIcon  />
                  </Box>
                  {/*
                  <Box
                    mt='24px'
                    p='0 32px'
                    display='flex '
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <Box>
                      <Typography
                        variant='h5'
                        fontWeight='600'
                        color={colors.grey[100]}
                      >
                        {state.timelineData[state.value].title}
                      </Typography>
                      <Typography
                        variant='h3'
                        fontWeight='bold'
                        color={colors.accent[500]}
                      >
                        {dayjs(state.timelineData[state.value].date).format('DD.MM.YYYY HH:mm')}
                      </Typography>
                    </Box>
                  </Box>
                  */}
                  <Box height='580px' m='-20px 0 0 0'>
                    <BarChart data={accountBalances[state.value]} />
                  </Box>
                </Box>
              }
              
              {/* transaction log */}
              <Box
                gridColumn={'span 4'}
                gridRow={simulationState.useAccountBalances ? 'span 1' : 'span 2'}
                backgroundColor={colors.primary[400]}
                overflow='auto'
              >
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  borderBottom={`4px solid`}
                  borderColor={colors.primary[500]}
                  color={colors.grey[100]}
                  p='16px'
                >
                  <Typography variant='h5' fontWeight='600'>
                    Transaction log
                  </Typography>
                  <ReceiptLongOutlinedIcon />
                </Box>
                {transactionLog[state.value].map((transaction, i) => (
                  <Box
                    key={`${transaction.transaction}-${i}`}
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    borderBottom={`4px solid`}
                    borderColor={colors.primary[500]}
                    p='16px'
                  >
                    <Box 
                    //sx={{ maxWidth: '50%', minWidth: '50%'}}
                    >
                      <Typography
                        color={colors.accent[500]}
                        variant='h5'
                        fontWeight='600'
                      >
                        <Tooltip arrow placement='top' title={'Executed transaction'}>
                          <span>
                            {transaction.transaction}
                          </span>
                        </Tooltip>
                      </Typography>
                      <Typography color={colors.grey[100]}>
                        <Tooltip arrow placement='top' title={'Transaction date and time'}>
                          <span>
                            {dayjs(transaction.date).format('DD.MM.YYYY HH:mm')}
                          </span>
                        </Tooltip>
                      </Typography>
                    </Box>

                    <Typography color={colors.grey[100]}>
                      <Tooltip arrow placement='bottom' title={'Transaction caller'}>
                        <span>
                          {transaction.participant} {transaction.role ? ' (' + transaction.role + ')' : ''}
                        </span>
                      </Tooltip>
                    </Typography>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}>
                      {transaction.amount != null && transaction.amount > 0 && (
                        <Box
                          backgroundColor={colors.primary[500]}
                          p='8px 12px'
                          borderRadius='4px'
                          color={colors.grey[100]}
                        >
                          {getDefaultCurrency(simulationState.ecosystem) + ' ' + transaction.amount}
                        </Box>
                      )}
                      <CustomWidthTooltip placement={'right'} title={<div style={{ whiteSpace: 'pre-line', fontSize: '1.5em' }}>{showTransactionData(transaction)}</div>}>
                        <IconButton>
                          <InfoOutlinedIcon />
                        </IconButton>
                      </CustomWidthTooltip>
                    </div>
                  </Box>
                ))}
              </Box>

              {/* participants */}
              <Box
                gridColumn={simulationState.useAccountBalances ? 'span 3' : 'span 4'}
                gridRow={'span 1'}
                backgroundColor={colors.primary[400]}
                overflow='auto'
                >
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  borderBottom={`4px solid`}
                  borderColor={colors.primary[500]}
                  color={colors.grey[100]}
                  p='16px'
                >
                  <Typography variant='h5' fontWeight='600'>
                    Participants
                  </Typography>
                  <GroupOutlinedIcon />
                </Box>
                {participants[state.value].map((participant, i) => (
                  <Box
                    key={`${participant.name}-${i}`}
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    borderBottom={`4px solid`}
                    borderColor={colors.primary[500]}
                    p='16px'
                  >
                    <Box>
                      <Typography
                        color={colors.accent[500]}
                        variant='h5'
                        fontWeight='600'
                      >
                        <Tooltip arrow placement='top' title={'Participant name'}>
                          <span>
                            {participant.name}
                          </span>
                        </Tooltip>
                      </Typography>
                      <Typography color={colors.grey[100]}>
                        <CustomWidthTooltip arrow placement='bottom' title={<div style={{ whiteSpace: 'pre-line', fontSize: '1.5em' }}><strong>{'Public key address:\n'}</strong>{participant.address}</div>}>
                          <span>
                            {participant.address != null && participant.address.length > 30 ? participant.address.substring(0, 15) + '...' + participant.address.substring(participant.address.length - 15, participant.address.length) : participant.address}
                          </span>
                        </CustomWidthTooltip>
                      </Typography>
                    </Box>
                    <Box
                      backgroundColor={colors.primary[500]}
                      p='8px 12px'
                      borderRadius='4px'
                      color={colors.grey[100]}
                    >
                      <Tooltip arrow placement='top' title={'Participant role'}>
                        <span>
                          {participant.role}
                        </span>
                      </Tooltip>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
            </div>

            <TimeoutAlertDialog
              isDialogOpened={isTimeoutAlertOpen}
              handleCloseDialog={() => setIsTimeoutAlertOpen(false)}
              handleCloseDialogAgree={() => {
                setIsTimeoutAlertOpen(false);
                
                var newProperties = [...properties]
                var newTransactionLog = [...transactionLog]
                var newParticipantState = [...participants]
                var newAccountBalances = [...accountBalances]
                
                // make a deep copy of the properties
                // var newProperties = JSON.parse(JSON.stringify([...properties[state.maxIndex]]));
                
                // make a deep copy of the account balances
                var newAccountBalance = JSON.parse(JSON.stringify(accountBalances[state.maxIndex]));
                
                // make a deep copy of the transaction log
                var newTransactions = JSON.parse(JSON.stringify([...transactionLog[state.maxIndex]]));
                
                // make a deep copy of the participants
                var newParticipants = JSON.parse(JSON.stringify([...participants[state.maxIndex]]));
                
                // const timeoutStatements = state.timelineData[timeoutAlertData.index].timeoutStatements;
                // if (timeoutStatements){
                //   var statementErrors = [];
                //   // TODO: check the transaction params?? or somehow ignore it
                //   executeStatements(timeoutStatements, [], newProperties, newParticipants, newAccountBalance, statementErrors);
                //   if (statementErrors.length > 0){
                //     setErrors(statementErrors);
                //     // dont do any update of the state
                //     return;
                //   }

                //   newTransactions.push({
                //     date: dayjs(state.timelineData[timeoutAlertData.index].date).format(),
                //     transaction: state.timelineData[timeoutAlertData.index].title,
                //     participant: 'Smart Contract',
                //     role: null,
                //     amount: null,
                //     transactionParams: null,
                //   })
                // }

                // newProperties.splice(state.maxIndex + 1, 0, newProperties[state.maxIndex]);
                newProperties.push(properties[state.maxIndex])
                // newTransactionLog.splice(state.maxIndex + 1, 0, newTransactions[state.maxIndex]);
                newTransactionLog.push(transactionLog[state.maxIndex])
                // newParticipantState.splice(state.maxIndex + 1, 0, newParticipants[state.maxIndex]);
                newParticipantState.push(participants[state.maxIndex])
                // newAccountBalances.splice(state.maxIndex + 1, 0, newAccountBalance[state.maxIndex]);
                newAccountBalances.push(accountBalances[state.maxIndex])

                setProperties(newProperties);
                setTransactionLog(newTransactionLog);
                setParticipants(newParticipantState);
                setAccountBalances(newAccountBalances);

                const calcMaxIndex = timeoutAlertData.index >= state.maxIndex ? timeoutAlertData.index : state.maxIndex;

                setState({ value: timeoutAlertData.index, previous: state.value, maxIndex: calcMaxIndex, timelineData: state.timelineData});
                setNextTransactionDateTime(dayjs(state.timelineData[timeoutAlertData.index].date).add(1, 'minutes'))
              }}
              timeoutAlertData={timeoutAlertData}
            />
            <SimulationEndDialog
              isDialogOpened={isSimulationEndDialogOpen}
              handleCloseDialog={() => {
                setSimulationState({...simulationState, state: 'Finished'});
                setIsSimulationEndDialogOpen(false);
              }}
              simulationEndData={simulationEndData}
            />
            <TransactionDialog
              isDialogOpened={isTransactionDialogOpen}
              handleCloseDialog={() => setIsTransactionDialogOpen(false)}
              handleTransactionDialogExecute={() => {
                setIsTransactionDialogOpen(false);
                executeTransaction(executeTransactionData);
              }}
              executeTransactionData={executeTransactionData}
              setExecuteTransactionData={setExecuteTransactionData}
            />
            <SimulationRestartDialog
              isDialogOpened={isSimulationRestartDialogOpen}
              handleCloseDialog={() => setIsSimulationRestartDialogOpen(false)}
              handleSimulationRestartDialogExecute={() => {
                setIsSimulationRestartDialogOpen(false);
                restartSimulator(false);
              }}
              handleSimulationRestartDialogExecuteNewValues={() => {
                setIsSimulationRestartDialogOpen(false);
                restartSimulator(true);
              }}
            />
          </Box>
        )}
      </div>
    </div>
  );
};

export default Simulator;