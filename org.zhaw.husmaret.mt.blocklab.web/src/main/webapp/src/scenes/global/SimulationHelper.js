import * as dayjs from 'dayjs';

export const replaceVariablesinExpression = (expression, replaceWithValues, valuesContainer) => {

    if (typeof expression === 'string' || expression instanceof String) {
      var replacedExpressionWithValues = expression.replace(/(\$C{.+?})/g, function(_, variableName) { 
        variableName = variableName.replace('$C{', '').replace('}', '');
        const indexOfContractParam = valuesContainer.contractParams.findIndex((param) => param.paramName === variableName);
        if (indexOfContractParam >= 0) {
          // always return the value, despite of the replaceWithValues paramtere, as these values do not change over the time of the simulation
          return valuesContainer.contractParams[indexOfContractParam].value;
        } else {
          console.warn('NO CONTRACT PARAM FOUND FOR: ' + variableName);
        }
      });
      
      var replacedExpressionWithValues = replacedExpressionWithValues.replace(/(\$A{.+?})/g, function(_, variableName) { 
        variableName = variableName.replace('$A{', '').replace('}', '');
        const indexOfProperty = valuesContainer.currentProperties.findIndex((property) => property.name === variableName);
        if (indexOfProperty >= 0) {
          if (replaceWithValues) {
            return valuesContainer.currentProperties[indexOfProperty].value;
          } else {
            return 'Property \''+variableName+'\'' 
          }
        } else {
          console.warn('NO PROPERTY FOUND FOR: ' + variableName);
        }
      });
      
      var replacedExpressionWithValues = replacedExpressionWithValues.replace(/(\$P{.+?})/g, function(_, variableName) { 
        variableName = variableName.replace('$P{', '').replace('}', '');
        const indexOfParticipant = valuesContainer.currentParticipants.findIndex((participant) => participant.name === variableName);
        if (indexOfParticipant >= 0) {
          if (replaceWithValues) {
            return valuesContainer.currentParticipants[indexOfParticipant].name;
          } else {
            return 'Participant \''+variableName+'\'' 
          }
        } else {
          console.warn('NO PARTICIPANT FOUND FOR: ' + variableName);
        }
      });
      
      var replacedExpressionWithValues = replacedExpressionWithValues.replace(/(\$T{.+?})/g, function(_, variableName) { 
        variableName = variableName.replace('$T{', '').replace('}', '');
        const indexOfTransactionParam = valuesContainer.transactionParams.findIndex((param) => param.paramName === variableName);
        if (indexOfTransactionParam >= 0) {
          if (replaceWithValues) {
            return valuesContainer.transactionParams[indexOfTransactionParam].value;
          } else {
            return 'transaction parameter \''+variableName+'\'' 
          }
        } else {
          console.warn('NO TRANSACTION PARAM FOUND FOR: ' + variableName);
        }
      });

      // others
      var replacedExpressionWithValues = replacedExpressionWithValues.replace(/(\${.+?})/g, function(_, variableName) { 
        variableName = variableName.replace('${', '').replace('}', '');
        if (variableName === 'TransactionValue') {
          if (replaceWithValues) {
            return valuesContainer.transactionValue != null ? valuesContainer.transactionValue : 0;
          } else {
            return 'Transaction value';
          }
        } else if (variableName === 'Creator') {
          return variableName;
        } else if (variableName === 'TransactionCaller') {
          return "'" + valuesContainer.transactionCallerName + "'"
        }
      });

      return replacedExpressionWithValues;
    } else {
      // do not try to replace anything which is not a string
      return expression;
    }
  }

  export const convertExpressionHumanReadable = (expression, conditionValue) => {

    // replace all brackets here
    expression = expression.replace(/[()]+/g, '');

    if (conditionValue) {
      expression = expression.replace('>=', ' is greater than or equal to ');
      expression = expression.replace('<=', ' is less than or equal to ');
      expression = expression.replace('>', ' is greater than ');
      expression = expression.replace('<', ' is less than ');
      expression = expression.replace('==', ' is equal to ');
      expression = expression.replace('!=', ' is not equal to ');
      expression = expression.replace('&&', ' and ');
      expression = expression.replace('||', ' or ');
      return expression;
    } else {
      expression = expression.replace('>=', ' is not greater than or equal to ');
      expression = expression.replace('<=', ' is not less than or equal to ');
      expression = expression.replace('>', ' is not greater than ');
      expression = expression.replace('<', ' is not less than ');
      expression = expression.replace('==', ' is not equal to ');
      expression = expression.replace('!=', ' is equal to ');
      expression = expression.replace('&&', ' and ');
      expression = expression.replace('||', ' or ');
      return expression;
    }
  }

  export const convertStatementsHumanReadable = (statements, startIndex, level, doEval, valuesContainer) => {
    var humanReadableStatements = '';
    var prefix = '';
    for(var i = 0; i < level; i++) {
      prefix += '_';
    }
    statements.map((statement, index) => {
      if(statement){
        humanReadableStatements += prefix + convertStatementHumanReadable(statement, startIndex + index, level, doEval, valuesContainer) + '\n';
      }
      return humanReadableStatements;
    });
    return humanReadableStatements;
  }

  export const convertStatementHumanReadable = (statement, index, level, doEval, valuesContainer) => {
    if (statement.type === 'SetProperty') {
      const expression = replaceVariablesinExpression(statement.instructions.expression, doEval, valuesContainer);
      if (doEval) {
        return index + '. Set property \'' + statement.instructions.propertyName + '\' to ' + eval(expression);
      } else {
        return index + '. Set property \'' + statement.instructions.propertyName + '\' to ' + expression;
      }
    } else if (statement.type === 'Deposit') {
      const amountExpression = replaceVariablesinExpression(statement.instructions.amount, doEval, valuesContainer);
      if (doEval) {
        return index + '. Deposit ' + statement.instructions.token + ' ' + eval(amountExpression) + ' into account \'' + parseParticipantExpression(statement.instructions.account) + '\'';
      } else {
        return index + '. Deposit ' + statement.instructions.token + ' ' + amountExpression + ' into account \'' + parseParticipantExpression(statement.instructions.account) + '\'';
      }
    } else if (statement.type === 'Transfer') {
      const amountExpression = replaceVariablesinExpression(statement.instructions.amount, doEval, valuesContainer);
      if (doEval) {
        return index + '. Transfer ' + statement.instructions.token + ' ' + eval(amountExpression) + ' from account \'' + parseParticipantExpression(statement.instructions.fromAccount) + '\' to account \'' + parseParticipantExpression(statement.instructions.toAccount) + '\'';
      } else {
        return index + '. Transfer ' + statement.instructions.token + ' ' + amountExpression + ' from account \'' + parseParticipantExpression(statement.instructions.fromAccount) + '\' to account \'' + parseParticipantExpression(statement.instructions.toAccount) + '\'';
      }
    } else if (statement.type === 'Withdraw') {
      const amountExpression = replaceVariablesinExpression(statement.instructions.amount, doEval, valuesContainer);
      if (doEval) {
        return index + '. Withdraw ' + statement.instructions.token + ' ' + eval(amountExpression) + ' from account \'' + parseParticipantExpression(statement.instructions.account) + '\'';
      } else {
        return index + '. Withdraw ' + statement.instructions.token + ' ' + amountExpression + ' from account \'' + parseParticipantExpression(statement.instructions.account) + '\'';
      }
    } else if (statement.type === 'If') {
      return index + '. If condition \'' + replaceVariablesinExpression(statement.instructions.condition, doEval, valuesContainer) + '\' is true, then:\n' + convertStatementsHumanReadable(statement.instructions.statements, index + 1, level + 1, doEval, valuesContainer);
    } else if (statement.type === 'IfElse') {
      return index + '. If condition \'' + replaceVariablesinExpression(statement.instructions.condition, doEval, valuesContainer) + '\' is true, then:\n' + convertStatementsHumanReadable(statement.instructions.statements, index + 1, level + 1, doEval, valuesContainer) + 'else:\n' + convertStatementsHumanReadable(statement.instructions.elseStatements, index + 1, level + 1, doEval, valuesContainer);
    } else if (statement.type === 'Finish') {
      return index + '. Finish contract, any remaining Account balances can be withdrawn.';
    }
}

export const showTransactionData = (transaction) => {
    var transactionData = '';
    if (transaction.transactionParams !== null && transaction.transactionParams.length > 0) {
        transactionData += 'Transaction parameters:\n';
        transaction.transactionParams.map((transactionParam) => {
            if (transactionParam.type === 'Date') {
                transactionData += transactionParam.paramName + ': \'' + dayjs(transactionParam.value).format('DD.MM.YYYY HH:mm') + '\'\n';
            } else {
                transactionData += transactionParam.paramName + ': \'' + transactionParam.value + '\'\n';
            }
            return transactionData;
        })
    } else {
        transactionData += 'Transaction called without any parameters';
    }
    return transactionData;
}

export const parseParticipantExpression = (participantExpression, currentProperties = [], nextTransactionParticipantName = 'Transaction caller') => {
    if (participantExpression === '${TransactionCaller}') {
      return nextTransactionParticipantName;
    } else if (participantExpression.startsWith('$P{') && participantExpression.endsWith('}')) {
      return participantExpression.substring(3, participantExpression.length-1);
    } else if (participantExpression.startsWith('$A{') && participantExpression.endsWith('}')) {
      const variableName = participantExpression.substring(3, participantExpression.length-1)
      const indexOfProperty = currentProperties.findIndex((property) => property.name === variableName);
      if (indexOfProperty >= 0) {
        return currentProperties[indexOfProperty].value;
      } else {
        // maybe throw error here
        console.log('*********** NO PROPERTY OF PARTICIPANT **************');
      }
      return variableName;
    } else if (participantExpression.startsWith('${') && participantExpression.endsWith('}')) {
      
      return participantExpression.substring(2, participantExpression.length-1);
    } else {
      console.log('*********** NO PARTICIPANT FOR EXPRESSION **************');
      console.log(participantExpression);
      return participantExpression;
    } 
  }


export const getDefaultCurrency = (ecosystem) => {
    switch(ecosystem) {
      case 'Ethereum':
        return 'ETH';
      case 'Solana':
        return 'SOL';
      case 'Cardano':
        return 'ADA';
      default:
        return '';
    } 
  }