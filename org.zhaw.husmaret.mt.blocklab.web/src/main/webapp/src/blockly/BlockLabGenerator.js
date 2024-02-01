import Blockly from "blockly";

export const dslGenerator = new Blockly.Generator('dslGenerator');
dslGenerator.ORDER_ATOMIC = 0;            // 0 "" ...
//dslGenerator.ORDER_NEW = 1.1;             // new
//dslGenerator.ORDER_MEMBER = 1.2;          // . []
//dslGenerator.ORDER_FUNCTION_CALL = 2;     // ()
//dslGenerator.ORDER_INCREMENT = 3;         // ++
//dslGenerator.ORDER_DECREMENT = 3;         // --
//dslGenerator.ORDER_BITWISE_NOT = 4.1;     // ~
//dslGenerator.ORDER_UNARY_PLUS = 4.2;      // +
dslGenerator.ORDER_UNARY_NEGATION = 4.3;  // -
dslGenerator.ORDER_LOGICAL_NOT = 4.4;     // !
//dslGenerator.ORDER_TYPEOF = 4.5;          // typeof
//dslGenerator.ORDER_VOID = 4.6;            // void
//dslGenerator.ORDER_DELETE = 4.7;          // delete
//dslGenerator.ORDER_AWAIT = 4.8;           // await
//dslGenerator.ORDER_EXPONENTIATION = 5.0;  // **
dslGenerator.ORDER_MULTIPLICATION = 5.1;  // *
dslGenerator.ORDER_DIVISION = 5.2;        // /
//dslGenerator.ORDER_MODULUS = 5.3;         // %
dslGenerator.ORDER_SUBTRTRANSACTION = 6.1;     // -
dslGenerator.ORDER_ADDITION = 6.2;        // +
//dslGenerator.ORDER_BITWISE_SHIFT = 7;     // << >> >>>
dslGenerator.ORDER_RELATIONAL = 8;        // < <= > >=
//dslGenerator.ORDER_IN = 8;                // in
//dslGenerator.ORDER_INSTANCEOF = 8;        // instanceof
dslGenerator.ORDER_EQUALITY = 9;          // == != === !==
//dslGenerator.ORDER_BITWISE_AND = 10;      // &
//dslGenerator.ORDER_BITWISE_XOR = 11;      // ^
//dslGenerator.ORDER_BITWISE_OR = 12;       // |
dslGenerator.ORDER_LOGICAL_AND = 13;      // &&
dslGenerator.ORDER_LOGICAL_OR = 14;       // ||
//dslGenerator.ORDER_CONDITIONAL = 15;      // ?:
//dslGenerator.ORDER_ASSIGNMENT = 16;       // = += -= **= *= /= %= <<= >>= ...
//dslGenerator.ORDER_YIELD = 17;            // yield
//dslGenerator.ORDER_COMMA = 18;            // ,
dslGenerator.ORDER_NONE = 99;             // (...)

dslGenerator.INDENT = "  ";

dslGenerator.CONTRACTPARAMS_PLACEHOLDER = '%ContractParams%'
dslGenerator.TRANSACTIONPARAMS_PLACEHOLDER_PREFIX = '%TransactionParams%_'

dslGenerator.ecosystem = "";
dslGenerator.version = "";

dslGenerator.contractParams = [];
dslGenerator.transactionIds = [];
dslGenerator.transactionParams = new Map([]);

dslGenerator.forBlock['contract'] = function(block) {
  const version = escapeWhiteSpace(block.getFieldValue('VERSION'));
  dslGenerator.version = version;
  const blockchain = escapeWhiteSpace(block.getFieldValue('BLOCKCHAIN'));
  dslGenerator.ecosystem = blockchain;
  const contract = dslGenerator.statementToCode(block, 'CONTRACT');	
  return 'Version: ' + version + '\nEcosystem: ' + blockchain + '\n\nContract' + dslGenerator.CONTRACTPARAMS_PLACEHOLDER +  ':\n' + contract;
};

dslGenerator.forBlock['contract_with_assets'] = function(block) {
  const version = escapeWhiteSpace(block.getFieldValue('VERSION'));
  dslGenerator.version = version;
  const blockchain = escapeWhiteSpace(block.getFieldValue('BLOCKCHAIN'));
  dslGenerator.ecosystem = blockchain;
  const asset = dslGenerator.statementToCode(block, 'ASSET');	
  const contract = dslGenerator.statementToCode(block, 'CONTRACT');	
  return 'Version: ' + version + '\nEcosystem: ' + blockchain + '\n\n' + (asset ? 'Assets:\n'  +  asset + '\n' : '') + 'Contract' + dslGenerator.CONTRACTPARAMS_PLACEHOLDER + ':\n' + contract;
};

dslGenerator.forBlock['contract_with_assets_and_participants'] = function(block) {
  const version = escapeWhiteSpace(block.getFieldValue('VERSION'));
  dslGenerator.version = version;
  const blockchain = escapeWhiteSpace(block.getFieldValue('BLOCKCHAIN'));
  dslGenerator.ecosystem = blockchain;
  const predefinedParticipants = dslGenerator.statementToCode(block, 'DEFINEPARTICIPANTS');	
  const asset = dslGenerator.statementToCode(block, 'ASSET');	
  const contract = dslGenerator.statementToCode(block, 'CONTRACT');	
  return 'Version: ' + version + '\nEcosystem: ' + blockchain + '\n\n' + (predefinedParticipants ? 'Participants:\n'  +  predefinedParticipants + '\n' : '') + (asset != null ? 'Assets:\n'  +  asset + '\n' : '') + 'Contract' + dslGenerator.CONTRACTPARAMS_PLACEHOLDER + ':\n' + contract;
};

dslGenerator.forBlock['when'] = function(block) {
  let transaction = dslGenerator.statementToCode(block, 'TRANSACTION');	
  var after = dslGenerator.valueToCode(block, 'AFTER', dslGenerator.ORDER_ATOMIC);
  if (!after) { after = '?after'; }
  let continueAs = dslGenerator.statementToCode(block, 'CONTINUEAS');	
  if (!continueAs) { continueAs = '?continueAs'; }
  return 'When [\n' + transaction + ']\nAfter ' + after + '\nContinue:\n'+continueAs;
};

dslGenerator.forBlock['statement_deposit'] = function(block) {
  const currency = escapeWhiteSpace(block.getFieldValue('CURRENCY'));
  var amount = dslGenerator.valueToCode(block, 'AMOUNT', dslGenerator.ORDER_ATOMIC);
  if (!amount) { amount = '?amount'; }
  var account = dslGenerator.valueToCode(block, 'ACCOUNT', dslGenerator.ORDER_ATOMIC);
  if (!account) { account = '?account'; }
  return 'Deposit ' + currency + ' ' + amount + ' into account ' + account + '\n';
};

dslGenerator.forBlock['statement_withdraw'] = function(block) {
  const currency = escapeWhiteSpace(block.getFieldValue('CURRENCY'));
  var amount = dslGenerator.valueToCode(block, 'AMOUNT', dslGenerator.ORDER_ATOMIC);
  if (!amount) { amount = '?amount'; }
  var account = dslGenerator.valueToCode(block, 'ACCOUNT', dslGenerator.ORDER_ATOMIC);
  if (!account) { account = '?account'; }
  return 'Withdraw ' + currency + ' ' + amount + ' from account ' + account + '\n';
};

dslGenerator.forBlock['statement_transfer'] = function(block) {
  const currency = escapeWhiteSpace(block.getFieldValue('CURRENCY'));
  var amount = dslGenerator.valueToCode(block, 'AMOUNT', dslGenerator.ORDER_ATOMIC);
  if (!amount) { amount = '?amount'; }
  var fromAccount = dslGenerator.valueToCode(block, 'FROMACCOUNT', dslGenerator.ORDER_ATOMIC);
  if (!fromAccount) { fromAccount = '?fromAccount'; }
  var toAccount = dslGenerator.valueToCode(block, 'TOACCOUNT', dslGenerator.ORDER_ATOMIC);
  if (!toAccount) { toAccount = '?toAccount'; }
  return 'Transfer ' + currency + ' ' + amount + ' sender ' + fromAccount + ' receiver ' + toAccount + '\n';
};

dslGenerator.forBlock['statement_setvariable'] = function(block) {
  let property = escapeWhiteSpace(block.getFieldValue('PROPERTY'));
  var value = dslGenerator.valueToCode(block, 'VALUE', dslGenerator.ORDER_ATOMIC);
  if (!value) { value = '?value'; }
  return 'Set Property(' + property + ') to ' + value + '\n';
};

dslGenerator.forBlock['contract_if'] = function(block) {
  var condition = dslGenerator.valueToCode(block, 'CONDITION', dslGenerator.ORDER_ATOMIC);
  if (!condition) { condition = '?condition' };
  var doCode = dslGenerator.statementToCode(block, 'DO');	
  if (!doCode) { doCode = '\t?doCode\n' }
  return 'If ('+ condition +') then\n' + doCode + 'EndIf\n';
};

dslGenerator.forBlock['contract_if_else'] = function(block) {
  var condition = dslGenerator.valueToCode(block, 'CONDITION', dslGenerator.ORDER_ATOMIC);
  if (!condition) { condition = '?condition' };
  var doCode = dslGenerator.statementToCode(block, 'DO');	
  if (!doCode) { doCode = '\t?doCode\n' }
  var elseCode = dslGenerator.statementToCode(block, 'ELSE');	
  if (!elseCode) { elseCode = '\t?elseCode\n' }
  return 'IfElse ('+ condition +') then\n' + doCode + '\nelse\n' + elseCode + '\nEndIfElse\n';
};

dslGenerator.forBlock['contract_close'] = function(block) {
  return 'Finish';
};

dslGenerator.forBlock['asset_accounts'] = function(block) {
  return 'AccountBalances\n';
};

dslGenerator.forBlock['asset_property'] = function(block) {
  const propertyName = escapeWhiteSpace(block.getFieldValue('NAME'));
  const propertyType = escapeWhiteSpace(block.getFieldValue('TYPE'));
  const defaultValue = dslGenerator.valueToCode(block, 'DEFAULTVALUE', dslGenerator.ORDER_ATOMIC);
  if (propertyType === 'Boolean') {
    return propertyType + ' ' + propertyName + (defaultValue !== null && defaultValue.length > 0 ? ' = ' + defaultValue.toString() : '') + '\n';
  } else {
    return propertyType + ' ' + propertyName + (defaultValue ? ' = ' + defaultValue : '') + '\n';
  }
};

dslGenerator.forBlock['participants_participant'] = function(block) {
  const name = escapeWhiteSpace(block.getFieldValue('NAME'));
  const address = dslGenerator.quote_(escapeWhiteSpace(block.getFieldValue('ADDRESS')));
  return name + '(' + address + ')\n';
};

dslGenerator.forBlock['participants_participantRole'] = function(block) {
  const name = escapeWhiteSpace(block.getFieldValue('NAME'));
  const address = dslGenerator.quote_(escapeWhiteSpace(block.getFieldValue('ADDRESS')));
  const role = dslGenerator.quote_(escapeWhiteSpace(block.getFieldValue('ROLE')));
  return name + '(' + address + (role ? ', ' + role : '') + ')\n';
};

dslGenerator.forBlock['participants_contractParam'] = function(block) {
  const name = escapeWhiteSpace(block.getFieldValue('NAME'));
  const contractParam = dslGenerator.valueToCode(block, 'PARAM', dslGenerator.ORDER_ATOMIC);
  return name + '(' + contractParam + ')\n';
};

dslGenerator.forBlock['participants_contractParam_role'] = function(block) {
  const name = escapeWhiteSpace(block.getFieldValue('NAME'));
  const contractParam = dslGenerator.valueToCode(block, 'PARAM', dslGenerator.ORDER_ATOMIC);
  const role = dslGenerator.quote_(escapeWhiteSpace(block.getFieldValue('ROLE')));
  return name + '(' + contractParam + (role ? ', ' + role : '') + ')\n';
};

dslGenerator.forBlock['asset_gettext'] = function(block) {
  const propertyName = escapeWhiteSpace(block.getFieldValue('NAME'));
  return ['Property(' + propertyName + ')', dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['asset_getnumber'] = function(block) {
  const propertyName = escapeWhiteSpace(block.getFieldValue('NAME'));
  return ['Property(' + propertyName + ')', dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['asset_getdate'] = function(block) {
  const propertyName = escapeWhiteSpace(block.getFieldValue('NAME'));
  return ['Property(' + propertyName + ')', dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['asset_getparticipant'] = function(block) {
  const propertyName = escapeWhiteSpace(block.getFieldValue('NAME'));
  return ['Property(' + propertyName + ')', dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['asset_getboolean'] = function(block) {
  const propertyName = escapeWhiteSpace(block.getFieldValue('NAME'));
  return ['Property(' + propertyName + ')', dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['contractparameter_text'] = function(block) {
  const parameterName = escapeWhiteSpace(block.getFieldValue('NAME'));
  const paramValue = 'Text ' + parameterName;
  if(!dslGenerator.contractParams.includes(paramValue)){
    dslGenerator.contractParams.unshift(paramValue);
  }
  return ['ContractParam(' + parameterName + ')', dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['contractparameter_number'] = function(block) {
  const parameterName = escapeWhiteSpace(block.getFieldValue('NAME'));
  const paramValue = 'Number ' + parameterName;
  if(!dslGenerator.contractParams.includes(paramValue)){
    dslGenerator.contractParams.unshift(paramValue);
  }
  return ['ContractParam(' + parameterName + ')', dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['contractparameter_date'] = function(block) {
  const parameterName = escapeWhiteSpace(block.getFieldValue('NAME'));
  const paramValue = 'Date ' + parameterName;
  if(!dslGenerator.contractParams.includes(paramValue)){
    dslGenerator.contractParams.unshift(paramValue);
  }
  return ['ContractParam(' + parameterName + ')', dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['contractparameter_participant'] = function(block) {
  const parameterName = escapeWhiteSpace(block.getFieldValue('NAME'));
  const paramValue = 'Participant ' + parameterName;
  if(!dslGenerator.contractParams.includes(paramValue)){
    dslGenerator.contractParams.unshift(paramValue);
  }
  return ['ContractParam(' + parameterName + ')', dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['contractparameter_boolean'] = function(block) {
  const parameterName = escapeWhiteSpace(block.getFieldValue('NAME'));
  const paramValue = 'Boolean ' + parameterName;
  if(!dslGenerator.contractParams.includes(paramValue)){
    dslGenerator.contractParams.unshift(paramValue);
  }
  return ['ContractParam(' + parameterName + ')', dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['transactionparameter_text'] = function(block) {
  const parameterName = escapeWhiteSpace(block.getFieldValue('PARAM'));
  const transactionName = escapeWhiteSpace(block.getFieldValue('TRANSACTION'));
  const paramValue = 'Text ' + parameterName;
  if(!dslGenerator.transactionParams.has(transactionName)){
    dslGenerator.transactionParams.set(transactionName, [paramValue]);
  } else {
    if(!dslGenerator.transactionParams.get(transactionName).includes(paramValue)){
      dslGenerator.transactionParams.get(transactionName).push(paramValue);
    }

  }
  return ['TransactionParam(' + parameterName + ') of ' + transactionName, dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['transactionparameter_number'] = function(block) {
  const parameterName = escapeWhiteSpace(block.getFieldValue('PARAM'));
  const transactionName = escapeWhiteSpace(block.getFieldValue('TRANSACTION'));
  const paramValue = 'Number ' + parameterName;
  if(!dslGenerator.transactionParams.has(transactionName)){
    dslGenerator.transactionParams.set(transactionName, [paramValue]);
  } else {
    if(!dslGenerator.transactionParams.get(transactionName).includes(paramValue)){
      dslGenerator.transactionParams.get(transactionName).push(paramValue);
    }
  }
  return ['TransactionParam(' + parameterName + ') of ' + transactionName, dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['transactionparameter_date'] = function(block) {
  const parameterName = escapeWhiteSpace(block.getFieldValue('PARAM'));
  const transactionName = escapeWhiteSpace(block.getFieldValue('TRANSACTION'));
  const paramValue = 'Date ' + parameterName;
  if(!dslGenerator.transactionParams.has(transactionName)){
    dslGenerator.transactionParams.set(transactionName, [paramValue]);
  } else {
    if(!dslGenerator.transactionParams.get(transactionName).includes(paramValue)){
      dslGenerator.transactionParams.get(transactionName).push(paramValue);
    }
  }
  return ['TransactionParam(' + parameterName + ') of ' + transactionName, dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['transactionparameter_participant'] = function(block) {
  const parameterName = escapeWhiteSpace(block.getFieldValue('PARAM'));
  const transactionName = escapeWhiteSpace(block.getFieldValue('TRANSACTION'));
  const paramValue = 'Participant ' + parameterName;
  if(!dslGenerator.transactionParams.has(transactionName)){
    dslGenerator.transactionParams.set(transactionName, [paramValue]);
  } else {
    if(!dslGenerator.transactionParams.get(transactionName).includes(paramValue)){
      dslGenerator.transactionParams.get(transactionName).push(paramValue);
    }
  }
  return ['TransactionParam(' + parameterName + ') of ' + transactionName, dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['transactionparameter_boolean'] = function(block) {
  const parameterName = escapeWhiteSpace(block.getFieldValue('PARAM'));
  const transactionName = escapeWhiteSpace(block.getFieldValue('TRANSACTION'));
  const paramValue = 'Boolean ' + parameterName;
  if(!dslGenerator.transactionParams.has(transactionName)){
    dslGenerator.transactionParams.set(transactionName, [paramValue]);
  } else {
    if(!dslGenerator.transactionParams.get(transactionName).includes(paramValue)){
      dslGenerator.transactionParams.get(transactionName).push(paramValue);
    }
  }
  return ['TransactionParam(' + parameterName + ') of ' + transactionName, dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['condition_always'] = function(block) {
  return ['Always', dslGenerator.ORDER_ATOMIC];	
};

dslGenerator.forBlock['condition_and'] = function(block) {
  let condition1 = dslGenerator.valueToCode(block, 'CONDITION1', dslGenerator.ORDER_ATOMIC);
  if (!condition1) { condition1 = '?condition1'; }
  let condition2 = dslGenerator.valueToCode(block, 'CONDITION2', dslGenerator.ORDER_ATOMIC);
  if (!condition2) { condition2 = '?condition2'; }
  return [condition1 + ' AND ' + condition2, dslGenerator.ORDER_LOGICAL_AND];	
};

dslGenerator.forBlock['condition_or'] = function(block) {
  let condition1 = dslGenerator.valueToCode(block, 'CONDITION1', dslGenerator.ORDER_ATOMIC);
  if (!condition1) { condition1 = '?condition1'; }
  let condition2 = dslGenerator.valueToCode(block, 'CONDITION2', dslGenerator.ORDER_ATOMIC);
  if (!condition2) { condition2 = '?condition2'; }
  return [condition1 + ' OR ' + condition2, dslGenerator.ORDER_LOGICAL_OR];	
};

dslGenerator.forBlock['condition_not'] = function(block) {
  let condition = dslGenerator.valueToCode(block, 'CONDITION', dslGenerator.ORDER_ATOMIC);
  if (!condition) { condition = '?condition'; }
  return ['not(' + condition + ')', dslGenerator.ORDER_LOGICAL_NOT];	
};

dslGenerator.forBlock['condition_greater'] = function(block) {
  let valueLeft = dslGenerator.valueToCode(block, 'LEFT', dslGenerator.ORDER_ATOMIC);
  if (!valueLeft) { valueLeft = '?value'; }
  let valueRight = dslGenerator.valueToCode(block, 'RIGHT', dslGenerator.ORDER_ATOMIC);
  if (!valueRight) { valueRight = '?value'; }
  return [valueLeft + ' > ' + valueRight, dslGenerator.ORDER_RELATIONAL];	
};

dslGenerator.forBlock['condition_greater_equals'] = function(block) {
  let valueLeft = dslGenerator.valueToCode(block, 'LEFT', dslGenerator.ORDER_ATOMIC);
  if (!valueLeft) { valueLeft = '?value'; }
  let valueRight = dslGenerator.valueToCode(block, 'RIGHT', dslGenerator.ORDER_ATOMIC);
  if (!valueRight) { valueRight = '?value'; }
  return [valueLeft + ' >= ' + valueRight, dslGenerator.ORDER_RELATIONAL];	
};

dslGenerator.forBlock['condition_equals'] = function(block) {
  let valueLeft = dslGenerator.valueToCode(block, 'LEFT', dslGenerator.ORDER_ATOMIC);
  if (!valueLeft) { valueLeft = '?value'; }
  let valueRight = dslGenerator.valueToCode(block, 'RIGHT', dslGenerator.ORDER_ATOMIC);
  if (!valueRight) { valueRight = '?value'; }
  return [valueLeft + ' equals ' + valueRight, dslGenerator.ORDER_EQUALITY];	
};

dslGenerator.forBlock['condition_not_equals'] = function(block) {
  let valueLeft = dslGenerator.valueToCode(block, 'LEFT', dslGenerator.ORDER_ATOMIC);
  if (!valueLeft) { valueLeft = '?value'; }
  let valueRight = dslGenerator.valueToCode(block, 'RIGHT', dslGenerator.ORDER_ATOMIC);
  if (!valueRight) { valueRight = '?value'; }
  return [valueLeft + ' not equals ' + valueRight, dslGenerator.ORDER_EQUALITY];	
};

dslGenerator.forBlock['condition_less_equals'] = function(block) {
  let valueLeft = dslGenerator.valueToCode(block, 'LEFT', dslGenerator.ORDER_ATOMIC);
  if (!valueLeft) { valueLeft = '?value'; }
  let valueRight = dslGenerator.valueToCode(block, 'RIGHT', dslGenerator.ORDER_ATOMIC);
  if (!valueRight) { valueRight = '?value'; }
  return [valueLeft + ' <= ' + valueRight, dslGenerator.ORDER_RELATIONAL];	
};

dslGenerator.forBlock['condition_less'] = function(block) {
  let valueLeft = dslGenerator.valueToCode(block, 'LEFT', dslGenerator.ORDER_ATOMIC);
  if (!valueLeft) { valueLeft = '?value'; }
  let valueRight = dslGenerator.valueToCode(block, 'RIGHT', dslGenerator.ORDER_ATOMIC);
  if (!valueRight) { valueRight = '?value'; }
  return [valueLeft + ' < ' + valueRight, dslGenerator.ORDER_RELATIONAL];	
};

dslGenerator.forBlock['transaction_generic'] = function(block) {
  const transactionId = escapeWhiteSpace(block.getFieldValue('IDENTIFICATION'));
  dslGenerator.transactionIds.push(transactionId);
  var allowed = dslGenerator.valueToCode(block, 'ALLOWED', dslGenerator.ORDER_ATOMIC);
  if (!allowed) { allowed = '?allowed'; }
  var condition = dslGenerator.valueToCode(block, 'CONDITION', dslGenerator.ORDER_ATOMIC);
  if (!condition) { condition = '?condition'; }
  let statements = dslGenerator.statementToCode(block, 'CONTINUEAS');	
  if (!statements) { statements = '?statements'; }
  return 'Transaction ' + transactionId + dslGenerator.TRANSACTIONPARAMS_PLACEHOLDER_PREFIX + transactionId + ' [\nAllowed ' + allowed + '\nCondition ' + condition + '\nStatements:\n'+statements + '\n]\n';
};

dslGenerator.forBlock['transaction_generic_once'] = function(block) {
  const transactionId = escapeWhiteSpace(block.getFieldValue('IDENTIFICATION'));
  dslGenerator.transactionIds.push(transactionId);
  const onlyOnce = block.getFieldValue('ONLYONCE').toString().toLowerCase();
  var allowed = dslGenerator.valueToCode(block, 'ALLOWED', dslGenerator.ORDER_ATOMIC);
  if (!allowed) { allowed = '?allowed'; }
  var condition = dslGenerator.valueToCode(block, 'CONDITION', dslGenerator.ORDER_ATOMIC);
  if (!condition) { condition = '?condition'; }
  let statements = dslGenerator.statementToCode(block, 'CONTINUEAS');	
  if (!statements) { statements = '?statements'; }
  return 'Transaction ' + transactionId + dslGenerator.TRANSACTIONPARAMS_PLACEHOLDER_PREFIX + transactionId + ' [\nOnce ' + onlyOnce + '\nAllowed ' + allowed + '\nCondition ' + condition + '\nStatements:\n'+statements + '\n]\n';
};

dslGenerator.forBlock['transaction_amount'] = function(block) {
  return ['TransactionValue', dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['transaction_transfer'] = function(block) {
  var identification = escapeWhiteSpace(block.getFieldValue('IDENTIFICATION'));
  if (!identification) { identification = '?identification'; }
  var from = dslGenerator.valueToCode(block, 'FROM', dslGenerator.ORDER_ATOMIC);
  if (!from) { from = '?from'; }
  var to = dslGenerator.valueToCode(block, 'TO', dslGenerator.ORDER_ATOMIC);
  if (!to) { to = '?to'; }
  return 'Transaction [\n' + identification + '\nFrom ' + from + '\nTo ' + to + '\n]\n';
};

dslGenerator.forBlock['logic_null'] = function(block) {
  return ['null', dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['text'] = function(block) {
  const code = escapeWhiteSpace(block.getFieldValue('TEXT'));
  return [code, dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['logic_boolean'] = function(block) {
  const code = (block.getFieldValue('BOOL') === 'TRUE') ? 'true' : 'false';
  return [code, dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['math_number'] = function(block) {
  const code = String(block.getFieldValue('NUM'));
  return [code, dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['math_plus'] = function(block) {
  const a = dslGenerator.valueToCode(block, 'A', dslGenerator.ORDER_ADDITION) || '0';
  const b = dslGenerator.valueToCode(block, 'B', dslGenerator.ORDER_ADDITION) || '0';
  const code = a + ' + ' + b
  return [code, dslGenerator.ORDER_ADDITION];
};

dslGenerator.forBlock['math_minus'] = function(block) {
  const a = dslGenerator.valueToCode(block, 'A', dslGenerator.ORDER_SUBTRTRANSACTION) || '0';
  const b = dslGenerator.valueToCode(block, 'B', dslGenerator.ORDER_SUBTRTRANSACTION) || '0';
  const code = a + ' - ' + b
  return [code, dslGenerator.ORDER_SUBTRTRANSACTION];
};

dslGenerator.forBlock['math_times'] = function(block) {
  const a = dslGenerator.valueToCode(block, 'A', dslGenerator.ORDER_MULTIPLICATION) || '0';
  const b = dslGenerator.valueToCode(block, 'B', dslGenerator.ORDER_MULTIPLICATION) || '0';
  const code = a + ' * ' + b
  return [code, dslGenerator.ORDER_MULTIPLICATION];
};

dslGenerator.forBlock['math_divide'] = function(block) {
  const a = dslGenerator.valueToCode(block, 'A', dslGenerator.ORDER_DIVISION) || '0';
  const b = dslGenerator.valueToCode(block, 'B', dslGenerator.ORDER_DIVISION) || '0';
  const code = a + ' / ' + b
  return [code, dslGenerator.ORDER_DIVISION];
};

dslGenerator.forBlock['math_modulo'] = function(block) {
  const a = dslGenerator.valueToCode(block, 'A', dslGenerator.ORDER_DIVISION) || '0';
  const b = dslGenerator.valueToCode(block, 'B', dslGenerator.ORDER_DIVISION) || '0';
  const code = a + ' % ' + b
  return [code, dslGenerator.ORDER_DIVISION];
};

dslGenerator.forBlock['logic_null'] = function(block) {
  return ['null', dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['input_date'] = function(block) {
  const year = dslGenerator.valueToCode(block, 'YEAR', dslGenerator.ORDER_ATOMIC);
  const month = dslGenerator.valueToCode(block, 'MONTH', dslGenerator.ORDER_ATOMIC);
  const day = dslGenerator.valueToCode(block, 'DAY', dslGenerator.ORDER_ATOMIC);
  const code = year + '-' + month + '-' + day;
  return [code, dslGenerator.ORDER_ATOMIC];	
};

dslGenerator.forBlock['participant_id'] = function(block) {
  return generateParticipantId(block);
};
dslGenerator.forBlock['access_participant_id'] = function(block) {
  return generateParticipantId(block);
};

function generateParticipantId(block) {
  const identification = escapeWhiteSpace(block.getFieldValue('IDENTIFICATION'));
  const code = 'Participant(' + identification + ')';
  return [code, dslGenerator.ORDER_ATOMIC];	
}

dslGenerator.forBlock['participant_role'] = function(block) {
  return generateParticipantRole(block);
};
dslGenerator.forBlock['access_participant_role'] = function(block) {
  return generateParticipantRole(block);
};

function generateParticipantRole(block) {
  const role = dslGenerator.quote_(escapeWhiteSpace(block.getFieldValue('ROLE')));
  return ['Role(' + role + ')', dslGenerator.ORDER_ATOMIC];	
}


dslGenerator.forBlock['participant_transactioncaller'] = function(block) {
  return ['TransactionCaller', dslGenerator.ORDER_ATOMIC];	
};  

dslGenerator.forBlock['access_anyone'] = function(block) {
  return ['Anyone', dslGenerator.ORDER_ATOMIC];	
};

dslGenerator.forBlock['access_anyone_role'] = function(block) {
  const role = dslGenerator.quote_(escapeWhiteSpace(block.getFieldValue('ROLE')));
  return ['Anyone(' + role + ')', dslGenerator.ORDER_ATOMIC];	
};

dslGenerator.forBlock['participant_creator'] = function(block) {
  return ['Creator', dslGenerator.ORDER_ATOMIC];	
};
dslGenerator.forBlock['access_participant_creator'] = function(block) {
  return ['Creator', dslGenerator.ORDER_ATOMIC];	
};

dslGenerator.forBlock['custom_number'] = function(block) {
  // Numeric value.
  const code = Number(block.getFieldValue('NUM'));
  const order = code >= 0 ? dslGenerator.ORDER_ATOMIC : dslGenerator.ORDER_UNARY_NEGATION;
  return [code, order];
};

dslGenerator.forBlock['custom_text'] = function(block) {
  // Text value.
  const code = dslGenerator.quote_(block.getFieldValue('TEXT'));
  return [code, dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['custom_date'] = function(block) {
  // Date value.
  const code = block.getFieldValue('DATE');
  return ['cal(' + code + ')', dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['custom_datetime'] = function(block) {
  // Datetime value.
  const date = block.getFieldValue('DATE');
  var hour = Number(block.getFieldValue('HOUR'));
  var minute = Number(block.getFieldValue('MINUTE'));
  if(isNaN(hour)){
	  hour = 0;
  }
  if(isNaN(minute)){
	  minute = 0;
  }
  var addZeroHour = hour < 10;
  var addZeroMinute = minute < 10;
  const code = date + ' ' + (addZeroHour ? '0' : '') + hour + ':' + (addZeroMinute ? '0' : '') + minute;
  return ['cal(' + code + ')', dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['custom_false'] = function(block) {
  return ['false', dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['custom_true'] = function(block) {
  return ['true', dslGenerator.ORDER_ATOMIC];
};

dslGenerator.forBlock['custom_contractstartduration'] = function(block) {
  // Datetime value.
  const amount = Number(block.getFieldValue('AMOUNT'));
  const duration = block.getFieldValue('DURATION');
  const code = 'start plus ' + amount + ' ' + duration;
  return [code, dslGenerator.ORDER_ATOMIC];
};


/**
 * Encode a string as a properly escaped JavaScript string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} JavaScript string.
 * @protected
 */
dslGenerator.quote_ = function(string) {
  // Can't use goog.string.quote since Google's style guide recommends
  // JS string literals use single quotes.
  string = string.replace(/\\/g, '\\\\')
               .replace(/\n/g, '\\\n')
               .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

function escapeWhiteSpace(s) {
	if (s != null && s.indexOf(' ') >= 0) {
		return "\"" + s + "\"";
	} else {
		return s;
	}
}

function removeIndentOfEveryNewLine(code) {
  var lines = code.split("\n");
  return lines.map ( s => s.replace(dslGenerator.INDENT, '') ).join("\n");
}

/**
 * Common tasks for generating dslGenerator from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Block} block The current block.
 * @param {string} code The dslGenerator code created for this block.
 * @param {boolean=} opt_thisOnly True to generate code for only this statement.
 * @return {string} dslGenerator code with comments and subsequent blocks added.
 * @protected
 */
dslGenerator.scrub_ = function(block, code, opt_thisOnly) {
  let commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    let comment = block.getCommentText();
    if (comment) {
      comment = Blockly.utils.string.wrap(comment, this.COMMENT_WRAP - 3);
      commentCode += this.prefixLines(comment + '\n', '// ');
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (let i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type === Blockly.inputTypes.VALUE) {
        const childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          comment = this.allNestedComments(childBlock);
          if (comment) {
            commentCode += this.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  const nextCode = opt_thisOnly ? '' : this.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};
