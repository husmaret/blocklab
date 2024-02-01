package org.zhaw.husmaret.mt.generator;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.eclipse.xtext.generator.IFileSystemAccess2;
import org.zhaw.husmaret.mt.BlockLabUtil;
import org.zhaw.husmaret.mt.blocklab.Contract;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.DepositOrWithdrawInstruction;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.IfElseInstruction;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.IfInstruction;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.Param;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.Participant;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.Property;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.SetPropertyInstruction;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.Statement;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.Timeout;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.TransferInstruction;

public class GenerateEthereum extends AbstractBlockchainGenerator {
	
	public static final String CONTRACT_NAME = "Contract";

	public static final String PARAM_PREFIX = "_";
	public static final String VARIABLE_CONTRACTSTART = PARAM_PREFIX + "contractStart";
	public static final String VARIABLE_CREATOR = PARAM_PREFIX + "creator";

	public static final String RESOURCE_BLOCKLAB_CONTRACT = "BlockLabContract.sol";
	public static final String RESOURCE_BLOCKLAB_DATETIME = "DateTimeLibrary.sol";

	public static final String RESOURCE_OPENZEPPELIN_SAFEMATH = "SafeMath.sol";
	public static final String RESOURCE_OPENZEPPELIN_PULLPAYMENT = "PullPayment.sol";
	public static final String RESOURCE_OPENZEPPELIN_ESCROW = "Escrow.sol";
	public static final String RESOURCE_OPENZEPPELIN_SECONDARY = "Secondary.sol";

	public GenerateEthereum(BlockLabVersion blocklabVersion, Contract contract, ParsedObjects parsedObjects, IFileSystemAccess2 fsa) {
		super(blocklabVersion, contract, parsedObjects, fsa);
	}
	
	@Override
	protected void generateSmartContractCode() {

		List<Property> propertiesWithoutContractParam = parsedObjects.getProperties().stream().filter(p -> p.getContractParam() == null).collect(Collectors.toList());
		List<Property> propertiesWithContractParam = parsedObjects.getProperties().stream().filter(p -> p.getContractParam() != null).collect(Collectors.toList());
		List<Participant> participantsWithoutContractParam = parsedObjects.getParticipants().values().stream().filter(p -> p.getContractParam() == null).collect(Collectors.toList());
		List<Participant> participantsWithContractParam = parsedObjects.getParticipants().values().stream().filter(p -> p.getContractParam() != null).collect(Collectors.toList());

		// add the License and Solidity version
		addCommentLine(0, "SPDX-License-Identifier: MIT");
		addLineToCode(0, "pragma solidity >=0.8.2 <0.9.0;");
		addEmpthyLineToCode();

		// create imports
		Set<String> imports = buildImports();
		for (String importPath : imports) {
			addLineToCode(0, "import \"." + importPath + "\";");
		}
		addEmpthyLineToCode();

		// contract start
		addLineToCode(0, "contract "+ CONTRACT_NAME +" is BlockLabContract {");
		addEmpthyLineToCode();
		
		// add the contract params
		if (!parsedObjects.getContractParams().isEmpty()) {
			addCommentLine(1, "Contract parameters");
		}
		for (Param contractParam : parsedObjects.getContractParams()){
			addLineToCode(1, getVariableType(contractParam.getType()) + " " + PARAM_PREFIX + contractParam.getParamName() + ";");
		}
		addEmpthyLineToCode();
		
		if (!propertiesWithoutContractParam.isEmpty()  || !propertiesWithContractParam.isEmpty()) {
			addCommentLine(1, "Contract properties");
		}
		for (Property property : propertiesWithoutContractParam){
			String defaultValue = null;
			if (property.getValue() != null) {
				switch (BlockLabUtil.parseDataType(property.getType())) {
					case TEXT:
						defaultValue = "\"" + property.getValue() + "\"";
						break;
					case DATE:
						try {
							Date parsedDate = AbstractBlockchainGenerator.SDF_ISO.parse((String) property.getValue());
							Calendar cal = Calendar.getInstance();
							cal.setTime(parsedDate);
							defaultValue = "DateTime.timestampFromDateTime("+cal.get(Calendar.YEAR)+","+(cal.get(Calendar.MONTH)+1)+","+cal.get(Calendar.DAY_OF_MONTH)+","+cal.get(Calendar.HOUR_OF_DAY)+","+cal.get(Calendar.MINUTE)+", 0)";
						} catch (Exception e) {
							throw new RuntimeException("Could not parse date ["+property.getValue()+"]", e);
						}
						break;
					case PARTICIPANT:
						defaultValue = "" + replaceVariablesInExpression((String) property.getValue());
						break;
					default:
						defaultValue = ""+property.getValue();
						break;
				} 
			}
			addLineToCode(1, getVariableType(property.getType()) + " " + property.getName() + (defaultValue != null ? " = " + defaultValue : "") + ";");
		}
		for (Property property : propertiesWithContractParam){
			addLineToCode(1, getVariableType(property.getType()) + " " + property.getName() + ";");
		}
		addEmpthyLineToCode();
		
		if (!parsedObjects.getParticipants().isEmpty()) {
			addCommentLine(1, "Predefined participants");
		}
		for (Participant participant : participantsWithoutContractParam){
			addLineToCode(1, "Participant " + participant.getName() + " = Participant(\"" + participant.getName() + "\", " + participant.getAddress() + ", " + (participant.getRole() != null ? participant.getRole() : "\"\"") +", true);");
			addLineToCode(1, "participants[" + participant.getAddress() + "] = " + participant.getName() + ";");
		}

		for (Participant participant : participantsWithContractParam){
			addLineToCode(1, "Participant " + participant.getName() + ";");
		}
		addEmpthyLineToCode();

		if (parsedObjects.getUseCreatorRole()){
			addCommentLine(1, "Additional variable to store the creator address");
			addLineToCode(1, "address " + VARIABLE_CREATOR + ";");
		}
		if (parsedObjects.getUseContractStart()){
			addCommentLine(1, "Additional variable to store the start timestamp of the contract");
			addLineToCode(1, "uint " + VARIABLE_CONTRACTSTART + ";");
		}
		
		addEmpthyLineToCode();

		// build constructor
		StringBuilder constructorParams = new StringBuilder();
		for (Param contractParam : parsedObjects.getContractParams()){
			if (constructorParams.length() > 0) {
				constructorParams.append(", ");
			}
			constructorParams.append(getVariableType(contractParam.getType())).append(" " + PARAM_PREFIX).append(contractParam.getParamName());
		}

		addCommentLine(1, "Constructor");
		addLineToCode(1, "constructor("+ constructorParams.toString() +") {");

		// initialize contract params
		for (Param contractParam : parsedObjects.getContractParams()){
			addLineToCode(2, PARAM_PREFIX + contractParam.getParamName() + " = " + PARAM_PREFIX + contractParam.getParamName() + ";");
		}

		// initialize asset properties
		for (Property property : propertiesWithContractParam){
			addLineToCode(2, property.getName() + " = " + PARAM_PREFIX + property.getContractParam() + ";");
		}

		if (parsedObjects.getUseCreatorRole()){
			addLineToCode(2, VARIABLE_CREATOR + " = msg.sender;");
		}	
		if (parsedObjects.getUseContractStart()){
			addLineToCode(2, VARIABLE_CONTRACTSTART + " = block.timestamp;");
		}	
		
		if (!participantsWithContractParam.isEmpty()) {
			addCommentLine(2, "Add participants to the mapping structure");
		}
		for (Participant participant : participantsWithContractParam){
			addLineToCode(2, participant.getName() + " = Participant(\"" + participant.getName() + "\", " + PARAM_PREFIX + participant.getContractParam() + ", " + (participant.getRole() != null ? participant.getRole() : "\"\"") +", true);");
			addLineToCode(2, "participants[" + PARAM_PREFIX + participant.getContractParam() + "] = " + participant.getName() + ";");
		}
		addLineToCode(1, "}");

		addEmpthyLineToCode();

		addCommentLine(1, "Transaction functions");
		// add the functions
		for (JsonEncodeResult.Transaction transaction : parsedObjects.getTransactions()) {
			List<String> transactionParamNames = new ArrayList<>(transaction.getParams().size());
			StringBuilder transactionParams = new StringBuilder();
			for (Param transactionParam : transaction.getParams()){
				if (transactionParams.length() > 0) {
					transactionParams.append(", ");
				}
				transactionParams.append(BlockLabUtil.parseDataType(transactionParam.getType())).append(" ").append(transactionParam.getParamName());
				transactionParamNames.add(transactionParam.getParamName());
			}

			addLineToCode(1, "function "+transaction.getName() + "("+transactionParams.toString()+") external " + (transaction.getUseTransactionValue() ? "payable " : "") + "notFinishedYet postCall {");
			// check all the transaction conditions, ignore the "true" condition (Always)
			if (transaction.getCondition() != null && !transaction.getCondition().isEmpty() && !transaction.getCondition().equals("true")) {
				addLineToCode(2, "require("+replaceVariablesInExpression(transactionParamNames, transaction.getCondition())+", \"Condition of the transaction is not met.\");");
			}

			if (!transaction.getAllowedByAnyone()) {
				addLineToCode(2, "require("+replaceVariablesInExpressionForAllowed(transaction.getAllowed()) +", \"Caller not authorized to call this transaction\");");
			}

			if (transaction.getPreviousTransactions() != null && transaction.getPreviousTransactions().length > 0) {
				for (String previousTransaction : transaction.getPreviousTransactions()) {
					addLineToCode(2, "require(callSuccess(this."+ previousTransaction +".selector), \"Transaction "+previousTransaction+" has not been called yet\");");
					addLineToCode(2, "require(onlyAfter(callTime(this."+ previousTransaction +".selector), 0, false), \"Transaction "+transaction.getName()+" is not allowed to be called yet.\");");
				}
			}

			if (transaction.getOnlyOnce()) {
				addLineToCode(2, "require(!callSuccess(this."+ transaction.getName() +".selector), \"Transaction has already been called and is not allowd to be executed again\");");
			}

			if (transaction.getBeforeTimeouts() != null && transaction.getBeforeTimeouts().length > 0) {
				for (JsonEncodeResult.Timeout beforeTimeout : transaction.getBeforeTimeouts()) {
					addTimeoutRequirement(beforeTimeout, true);
				}
			}
			
			if (transaction.getAfterTimeouts() != null && transaction.getAfterTimeouts().length > 0) {
				for (JsonEncodeResult.Timeout afterTimeout : transaction.getAfterTimeouts()) {
					addTimeoutRequirement(afterTimeout, false);
				}
			}
			
			// add the statements
			for (Statement stmt : transaction.getStatements()) {
				if (stmt != null) {
					parseStatement(2, transactionParamNames, stmt);
				}
			}

			// add partipant to the mapping if not already exists
			addLineToCode(2, "if (!participants[msg.sender].isParticipant) {");
			addLineToCode(3, "participants[msg.sender] = Participant(\"\", msg.sender, \"" + (transaction.getAnyoneAssignRole() != null ? transaction.getAnyoneAssignRole() : "") + "\", true);");
			addLineToCode(2, "}");

			addLineToCode(1, "}");
			addEmpthyLineToCode();
		}
		
		addCommentLine(1, "Function to withdraw the balance of a participant after contract is finished");
		addLineToCode(1, "function claimRemainingBalanceFinished() external returns (bool) {");
		addLineToCode(2, "return claimRemainingBalanceFinishedInternal();");
		addLineToCode(1, "}");
	

		addEmpthyLineToCode();
		addCommentLine(1, "Default Fallback and Receive function");
		addLineToCode(1, "fallback() external payable { }");
		addLineToCode(1, "receive() external payable { }");
		addEmpthyLineToCode();

		// end the contract
		addLineToCode(0, "}");

	}

	private void addTimeoutRequirement(Timeout timeout, boolean isBefore) {
		String dateTimeFunctionName = isBefore ? "isBefore" : "isAfter";
		String errorMessage = isBefore ? "Not allowed to execute, timeout already reached" : "Not allowed to execute yet, timeout not yet reached";
		if (timeout.getContractParam() != null) {
			addLineToCode(2, "require(DateTime."+dateTimeFunctionName+"(block.timestamp, "+ PARAM_PREFIX + timeout.getContractParam()+"), \"" + errorMessage + "\");");
		} else if (timeout.getOffsetInSeconds() > 0) {
			addLineToCode(2, "require(DateTime."+dateTimeFunctionName+"(block.timestamp, DateTime.addDuration(_contractStart, "+timeout.getOffsetInSeconds()+")), \"" + errorMessage + "\");");
		} else {
			Date timeoutDate;
			try {
				timeoutDate = AbstractBlockchainGenerator.SDF_ISO.parse(timeout.getValue());
			} catch (ParseException e) {
				throw new RuntimeException("Could not parse date ["+timeout.getValue()+"]", e);
			}
			Calendar cal = Calendar.getInstance();
			cal.setTime(timeoutDate);
			String dateAsTimestamp = "DateTime.timestampFromDateTime(" + cal.get(Calendar.YEAR) + ", " + (cal.get(Calendar.MONTH) + 1) + ", " + cal.get(Calendar.DAY_OF_MONTH) + ", " + cal.get(Calendar.HOUR_OF_DAY) + ", " + cal.get(Calendar.MINUTE) + ", 0)";
			addLineToCode(2, "require(DateTime."+dateTimeFunctionName+"(block.timestamp, "+dateAsTimestamp+"), \"" + errorMessage + "\");");
		}
	}

	private void parseStatement(int indent, List<String> transactionParamNames, Statement stmt) {
		switch (stmt.getType()) {
			case "SetProperty":
				SetPropertyInstruction setProperty = (SetPropertyInstruction) stmt.getInstructions();
				String expression = replaceVariablesInExpression(transactionParamNames, setProperty.getExpression());
				addLineToCode(indent, setProperty.getPropertyName() + " = " + expression + ";");
				break;
			case "Deposit":
				DepositOrWithdrawInstruction deposit = (DepositOrWithdrawInstruction) stmt.getInstructions();
				addLineToCode(indent, "addBalance("+replaceVariablesInExpression(deposit.getAccount())+", " + replaceVariablesInExpression(transactionParamNames, deposit.getAmount()) + ");");
				break;
			case "Withdraw":
				// TODO: add a reqire if there is enough balance on the account
				DepositOrWithdrawInstruction withdraw = (DepositOrWithdrawInstruction) stmt.getInstructions();
				addLineToCode(indent, "removeBalance("+replaceVariablesInExpression(withdraw.getAccount())+", " + replaceVariablesInExpression(transactionParamNames, withdraw.getAmount()) + ");");
				addLineToCode(indent, "_asyncTransfer("+replaceVariablesInExpression(withdraw.getAccount())+", " + replaceVariablesInExpression(transactionParamNames, withdraw.getAmount()) + " * 1 ether);");
				break;
			case "Transfer":
				// TODO: add a reqire if there is enough balance on the account
				TransferInstruction transfer = (TransferInstruction) stmt.getInstructions();
				// change the values of the AccountBalance Map here
				addLineToCode(indent, "removeBalance("+replaceVariablesInExpression(transfer.getFromAccount())+", " + replaceVariablesInExpression(transactionParamNames, transfer.getAmount()) + ");");
				addLineToCode(indent, "addBalance("+replaceVariablesInExpression(transfer.getToAccount())+", " + replaceVariablesInExpression(transactionParamNames, transfer.getAmount()) + ");");
				break;
			case "If":
				IfInstruction ifInstruction = (IfInstruction) stmt.getInstructions();
				addLineToCode(indent, "if (" + replaceVariablesInExpression(transactionParamNames, ifInstruction.getCondition()) + ") {");
				for(Statement s : ifInstruction.getStatements()) {
					parseStatement(indent + 1, transactionParamNames, s);
				}
				addLineToCode(indent, "}");
				break;
			case "IfElse":
				IfElseInstruction ifElseInstruction = (IfElseInstruction) stmt.getInstructions();
				addLineToCode(indent, "if (" + replaceVariablesInExpression(transactionParamNames, ifElseInstruction.getCondition()) + ") {");
				for(Statement s : ifElseInstruction.getStatements()) {
					parseStatement(indent + 1, transactionParamNames, s);
				}
				addLineToCode(indent, "} else {");
				for(Statement s : ifElseInstruction.getElseStatements()) {
					parseStatement(indent + 1, transactionParamNames, s);
				}
				addLineToCode(indent, "}");
				break;
			case "Finish":
				addLineToCode(indent, "contractFinished = true;");
				break;
			default:
				break;
		}
	}

	private Set<String> buildImports() {
		Set<String> imports = new LinkedHashSet<>();
		addFromResources(imports, "blocklab", RESOURCE_BLOCKLAB_CONTRACT);
		addFromResources(imports, "blocklab", RESOURCE_BLOCKLAB_DATETIME);
		// always use PullPayment and its dependencies
		addFromResources("openzeppelin", RESOURCE_OPENZEPPELIN_PULLPAYMENT);
		addFromResources("openzeppelin", RESOURCE_OPENZEPPELIN_ESCROW);
		addFromResources("openzeppelin", RESOURCE_OPENZEPPELIN_SAFEMATH);
		addFromResources("openzeppelin", RESOURCE_OPENZEPPELIN_SECONDARY);
		return imports;
	}

	private static String replaceVariablesInExpressionForAllowed(String expression) {
		String allowedExpression = replaceVariablesInExpression(expression);
		if (expression.startsWith(DslParser.ROLE_PREFIX)){
			return allowedExpression; 
		} else {
			return "onlyBy(" + allowedExpression + ")";
		}
	}

	private static String replaceVariablesInExpression(String expression) {
		return replaceVariablesInExpression(Collections.emptyList(), expression);
	}

	private static String replaceVariablesInExpression(List<String> transactionParamNames, String expression) {

		// replace fixed variables
		expression = expression.replaceFirst(Pattern.quote(DslParser.PLACEHOLDER_TRANSACTIONVALUE), "(msg.value / 1 ether)");
		expression = expression.replaceFirst(Pattern.quote(DslParser.PLACEHOLDER_CREATOR), VARIABLE_CREATOR);
		expression = expression.replaceFirst(Pattern.quote(DslParser.PLACEHOLDER_TRANSACTIONCALLER), "msg.sender");

		// transaction parameters, prefix with _
		String regexTransactionParameters = "\\$T\\{([^}]+)\\}";
		Pattern patternTransactionParameters = Pattern.compile(regexTransactionParameters);
		Matcher matcherTransactionParameters = patternTransactionParameters.matcher(expression);
		while (matcherTransactionParameters.find()) {
			String token = matcherTransactionParameters.group();
			String tokenKey = matcherTransactionParameters.group(1);
			expression = expression.replaceFirst(Pattern.quote(token), PARAM_PREFIX + tokenKey);
		}

		// for ContractParams, Assets and Participants
		String regexContractParameters = "\\$[C,A,P]\\{([^}]+)\\}";
		Pattern patternContractParameters = Pattern.compile(regexContractParameters);
		Matcher matcherContractParameters = patternContractParameters.matcher(expression);
		while (matcherContractParameters.find()) {
			String token = matcherContractParameters.group();
			String tokenKey = matcherContractParameters.group(1);
			if (token.startsWith("$C{")) {
				expression = expression.replaceFirst(Pattern.quote(token), PARAM_PREFIX + tokenKey);
			} else if (token.startsWith("$P{")) {
				expression = expression.replaceFirst(Pattern.quote(token), tokenKey + ".id");
			} else {
				expression = expression.replaceFirst(Pattern.quote(token), tokenKey);
			}
		}
		
		// for Roles
		String regexParticipantRole = "\\$R\\{([^}]+)\\}";
		Pattern patternParticipantRole = Pattern.compile(regexParticipantRole);
		Matcher matcherParticipantRole = patternParticipantRole.matcher(expression);
		while (matcherParticipantRole.find()) {
			String token = matcherParticipantRole.group();
			String roleName = matcherParticipantRole.group(1);
			expression = expression.replaceFirst(Pattern.quote(token), "keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes(\"" + roleName + "\"))");
		}

		return expression;
		
	}

	@Override
	protected String getVariableType(String paramType) {
		switch (BlockLabUtil.parseDataType(paramType)) {
			case DATE:
				return "uint";
			case NUMBER:
				return "uint";
			case TEXT:
				return "string";	
			case PARTICIPANT:
				return "address";
			case BOOLEAN:
				return "bool";
			default:
				throw new RuntimeException("Param type ["+paramType+"] is not supported.");
		}
	}
}
