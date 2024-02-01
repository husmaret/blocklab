package org.zhaw.husmaret.mt.validation;

import java.util.Arrays;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EAttribute;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EReference;
import org.eclipse.xtext.validation.Check;
import org.zhaw.husmaret.mt.BlockLabUtil;
import org.zhaw.husmaret.mt.BlockLabUtil.DataType;
import org.zhaw.husmaret.mt.blocklab.AndExpr;
import org.zhaw.husmaret.mt.blocklab.Assets;
import org.zhaw.husmaret.mt.blocklab.BlocklabPackage;
import org.zhaw.husmaret.mt.blocklab.BooleanValue;
import org.zhaw.husmaret.mt.blocklab.CompareExpr;
import org.zhaw.husmaret.mt.blocklab.Condition;
import org.zhaw.husmaret.mt.blocklab.Contract;
import org.zhaw.husmaret.mt.blocklab.ContractParameter;
import org.zhaw.husmaret.mt.blocklab.Date;
import org.zhaw.husmaret.mt.blocklab.DateExpression;
import org.zhaw.husmaret.mt.blocklab.DepositStatement;
import org.zhaw.husmaret.mt.blocklab.DurationFromStart;
import org.zhaw.husmaret.mt.blocklab.Expression;
import org.zhaw.husmaret.mt.blocklab.MathExpr;
import org.zhaw.husmaret.mt.blocklab.NotExpr;
import org.zhaw.husmaret.mt.blocklab.NumberValue;
import org.zhaw.husmaret.mt.blocklab.OrExpr;
import org.zhaw.husmaret.mt.blocklab.ParameterDeclaration;
import org.zhaw.husmaret.mt.blocklab.ParticipantDeclaration;
import org.zhaw.husmaret.mt.blocklab.ParticipantDeclarationWithAddress;
import org.zhaw.husmaret.mt.blocklab.ParticipantExpression;
import org.zhaw.husmaret.mt.blocklab.ParticipantRef;
import org.zhaw.husmaret.mt.blocklab.ParticipantRole;
import org.zhaw.husmaret.mt.blocklab.Property;
import org.zhaw.husmaret.mt.blocklab.PropertyDeclaration;
import org.zhaw.husmaret.mt.blocklab.SetPropertyStatement;
import org.zhaw.husmaret.mt.blocklab.StringValue;
import org.zhaw.husmaret.mt.blocklab.Transaction;
import org.zhaw.husmaret.mt.blocklab.TransactionCallerValue;
import org.zhaw.husmaret.mt.blocklab.TransactionParameter;
import org.zhaw.husmaret.mt.blocklab.TransactionValueValue;
import org.zhaw.husmaret.mt.blocklab.TransferStatement;
import org.zhaw.husmaret.mt.blocklab.ValueLiteral;
import org.zhaw.husmaret.mt.blocklab.When;
import org.zhaw.husmaret.mt.blocklab.WithdrawStatement;
import org.zhaw.husmaret.mt.generator.DslParser;
import org.zhaw.husmaret.mt.generator.Ecosystem;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.Param;
import org.zhaw.husmaret.mt.generator.ParsedObjects;
import org.zhaw.husmaret.mt.generator.ParsedObjects.SemanticError;

/**
 * This class contains custom validation rules. 
 *
 * See https://www.eclipse.org/Xtext/documentation/303_runtime_concepts.html#validation
 */
public class BlockLabValidator extends AbstractBlockLabValidator {
	
	public static final String ADDRESS_REGEX_CARDANO = "addr1[a-z0-9]{98}";
	public static final String ADDRESS_REGEX_ETHEREUM = "0x[a-fA-F0-9]{40}";
	
	public static final String INVALID_YEAR = "invalidYear";
	public static final String INVALID_MONTH = "invalidMonth";
	public static final String INVALID_DAY = "invalidDay";
	public static final String INVALID_HOUR = "invalidHour";
	public static final String INVALID_MINUTE = "invalidMinute";

	public static final String INVALID_DATE = "invalidDate";
	
	public static final String INVALID_NAME = "invalidName";
	public static final String INVALID_ROLE = "invalidRole";
	public static final String INVALID_CURRENCY = "invalidCurrency";

	public static final String INVALID_DATATYPE = "invalidDataType";

	public static final String INVALID_TRANSACTIONPARAM = "invalidTransactionParam";

	public static final String INVALID_ADDRESS = "invalidAddress";
	public static final String NO_ADDRESS_FOUND = "noAddressFound";
	
	public static final String INVALID_ECOSYSTEM = "invalidEcosystem";
	public static final String INVALID_WHEN = "invalidWhen";
	public static final String INVALID_PARTICIPANT = "invalidParticipant";

	public static final String NO_DISTINCT_PAYER = "noDistinctPayer";
	public static final String NO_DISTINCT_RECEIVER = "noDistinctReceiver";
	
	public static final int YEAR_LOWER_BOUND = 1000;
	public static final int YEAR_UPPER_BOUND = 9999;
	
	public static final int MONTH_LOWER_BOUND = 1;
	public static final int MONTH_UPPER_BOUND = 12;

	public static final int DAY_LOWER_BOUND = 1;

	public static final int HOUR_LOWER_BOUND = 0;
	public static final int HOUR_UPPER_BOUND = 23;

	public static final int MINUTE_LOWER_BOUND = 0;
	public static final int MINUTE_UPPER_BOUND = 59;

	private Ecosystem ecosystem;
	private Map<EObject, SemanticError> semanticErrors = new HashMap<>();

	public Map<String, BlockLabUtil.DataType> dataTypesForContractParams = new HashMap<>();
	public Map<String, BlockLabUtil.DataType> dataTypesForProperties = new HashMap<>();
	public Map<String, BlockLabUtil.DataType> dataTypesForTransactionParams = new HashMap<>();

	public static final String[] RESTRICTED_NAMES_DSL = new String[] { "Creator", "TransactionCaller", "Anyone", "Finish", "cal" };
	public static final String[] RESTRICTED_NAMES_SOLIDITY = new String[] { 
		"wei", "gwei", "ether",
		"now", "seconds", "minutes", "hours", "days", "weeks",
		"pragma", "solidity", "library", "import", "contract", "block", "tx", "msg", "blocknumber", "address", "memory", "storage", "calldata", "view", "payable",
		"bytes", "string", "assert", "require", "revert", "public", 
		"bool", "uint", "int", "uint256", "int256", 
		"sha256", "ripemd160", "ecrecover",
		"this", "super", "selfdestruct", "type",
		"after", "alias", "apply", "auto", "byte", "case", "copyof", "default", "define", "final", "implements", "in", "inline", "let", "macro", "match", "mutable", "null", "of", "partial", "promise", "reference", "relocatable", "sealed", "sizeof", "static", "supports", "switch", "typedef", "typeof", "var" 
	};

	public static final String[] RESTRICTED_NAMES_SOLANA = new String[] {
		// TBD when implementing Solana
 	};

	public static final String[] RESTRICTED_NAMES_CARDANO = new String[] {
		// TBD when implementing Cardano
 	};

	public Set<String> restrictedNames = new HashSet<>();

	@Check
	public void checkContract(Contract contract) {
		ParsedObjects parsedObjects = null;
		try{
			parsedObjects = DslParser.parseContractObjects(contract);
		} catch (Exception e) {
			e.printStackTrace();
		}

		this.semanticErrors = parsedObjects.getSemanticErrors();
		this.ecosystem = Ecosystem.valueOf(contract.getEcosystem());
		for(Param contractParam : parsedObjects.getContractParams()) {
			dataTypesForContractParams.put(contractParam.getParamName(), BlockLabUtil.parseDataType(contractParam.getType()));
		}
		for(JsonEncodeResult.Property property : parsedObjects.getProperties()) {
			dataTypesForProperties.put(property.getName(), BlockLabUtil.parseDataType(property.getType()));
		}
		for(JsonEncodeResult.Transaction transaction : parsedObjects.getTransactions()) {
			for(Param transactionParam : transaction.getParams()) {
				dataTypesForTransactionParams.put(transactionParam.getParamName(), BlockLabUtil.parseDataType(transactionParam.getType()));
			}
		}
		if (this.ecosystem == null) {
			error("Ecosystem ["+contract.getEcosystem()+"] is not supported.", BlocklabPackage.Literals.CONTRACT__ECOSYSTEM, INVALID_ECOSYSTEM);
		}

		restrictedNames.addAll(Arrays.asList(RESTRICTED_NAMES_DSL));
		switch (this.ecosystem) {
			case Ethereum:
				restrictedNames.addAll(Arrays.asList(RESTRICTED_NAMES_SOLIDITY));
				break;
			case Solana:
				restrictedNames.addAll(Arrays.asList(RESTRICTED_NAMES_SOLANA));
				break;
			case Cardano:
				restrictedNames.addAll(Arrays.asList(RESTRICTED_NAMES_CARDANO));
				break;
			default:
				break;
		}

		checkForSemanticErrors(contract);
	}
	
	@Check
	public void checkAssets(Assets asset) {
		checkForSemanticErrors(asset);
	}

	@Check
	public void checkParameterDeclaration(ParameterDeclaration parameterDeclaration){
		checkForRestrictedName(parameterDeclaration.getName(), BlocklabPackage.Literals.PARAMETER_DECLARATION__NAME);
	}
	
	@Check
	public void checkPropertyDeclaration(PropertyDeclaration propertyDeclaration){
		checkForSemanticErrors(propertyDeclaration);
		checkForRestrictedName(propertyDeclaration.getName(), BlocklabPackage.Literals.PROPERTY_DECLARATION__NAME);
		BlockLabUtil.DataType dataTypeOfProperty = BlockLabUtil.parseDataType(propertyDeclaration.getType());
		ValueLiteral valueLiteral = propertyDeclaration.getDefaultValue();
		// check if the expression is compatible with the data type of the default value
		BlockLabUtil.DataType dataTypeOfDefaultValue = null;
		if (valueLiteral instanceof ContractParameter) {
			dataTypeOfDefaultValue = dataTypesForContractParams.get(((ContractParameter) valueLiteral).getContractParam().getName());
		} else if (valueLiteral instanceof StringValue) {
			dataTypeOfDefaultValue = BlockLabUtil.DataType.TEXT;
		} else if (valueLiteral instanceof NumberValue) {
			dataTypeOfDefaultValue = BlockLabUtil.DataType.NUMBER;
		} else if (valueLiteral instanceof BooleanValue) {
			dataTypeOfDefaultValue = BlockLabUtil.DataType.BOOLEAN;
		} else if (valueLiteral instanceof Date) {
			dataTypeOfDefaultValue = BlockLabUtil.DataType.DATE;
		} else if (valueLiteral instanceof ParticipantRef) {
			dataTypeOfDefaultValue = BlockLabUtil.DataType.PARTICIPANT;
		} 
		if (dataTypeOfDefaultValue != null && dataTypeOfDefaultValue != dataTypeOfProperty) {
			error("The default values data type ["+dataTypeOfDefaultValue+"] has to match the data type ["+dataTypeOfProperty+"] of property ["+propertyDeclaration.getName()+"]" , BlocklabPackage.Literals.PROPERTY_DECLARATION__DEFAULT_VALUE, INVALID_DATATYPE);
		}
	}
	
	@Check
	public void checkWhen(When when) {
		
		checkForSemanticErrors(when);
		DateExpression after = when.getAfter();
		if (after instanceof Date) {
			checkValidDate((Date) when.getAfter(), true, BlocklabPackage.Literals.WHEN__AFTER);
			checkDateNotInPast((Date) when.getAfter(), BlocklabPackage.Literals.WHEN__AFTER);
		} else if (after instanceof ContractParameter) {
			BlockLabUtil.DataType dataTypeOfContractParameter = dataTypesForContractParams.get(((ContractParameter) after).getContractParam().getName());
			if (BlockLabUtil.DataType.DATE != dataTypeOfContractParameter) {
				error("Only contract parameters of type 'Date' are allowed for a timeout.", BlocklabPackage.Literals.WHEN__AFTER, INVALID_DATATYPE);
			}
		} else if (after instanceof DurationFromStart) {
			if (((DurationFromStart) after).getAmount() < 0) {
				error("The duration amount cannot be negative.", BlocklabPackage.Literals.WHEN__AFTER, INVALID_DATE);
			}
		}
	}
	
	@Check
	public void checkSetPropertyStatement(SetPropertyStatement set) {
		checkForSemanticErrors(set);
		String propertyName = set.getProperty().getPropertyName().getName();

		BlockLabUtil.DataType dataTypeOfProperty = dataTypesForProperties.get(propertyName);
		if (dataTypeOfProperty != null) {
			Expression valueToSet = set.getValue();
			// check if the expression is compatible with the data type of the property to Set
			BlockLabUtil.DataType dataTypeOfValueToSet = getDataTypeOfExpression(valueToSet);
			if (dataTypeOfValueToSet != null && dataTypeOfValueToSet != dataTypeOfProperty) {
				error("The data	type of the value ["+dataTypeOfValueToSet+"] has to match the data type ["+dataTypeOfProperty+"] of property ["+propertyName+"]" , BlocklabPackage.Literals.SET_PROPERTY_STATEMENT__VALUE, INVALID_DATATYPE);
			}
		} else {
			// property does not exist
			error("Property ["+propertyName+"] does not exist in the contracts assets.", BlocklabPackage.Literals.SET_PROPERTY_STATEMENT__PROPERTY, INVALID_NAME);
		}
	}

	@Check
	public void checkCondition(Condition condition) {
		checkForSemanticErrors(condition);
		if (condition instanceof Expression) {
			if (getDataTypeOfExpression((Expression) condition) != DataType.BOOLEAN) {
				
				// error("Only boolean expressions are allowed here.", BlocklabPackage.Literals.IF, INVALID_DATATYPE);
			}
		}
	}

	@Check
	public void checkTransactionParameter(TransactionParameter transactionParameter){
		checkForSemanticErrors(transactionParameter);
		if (transactionParameter.getTransactionParam() != null && !hasParentTransaction(transactionParameter)) {
			error("The transaction parameter ["+transactionParameter.getTransactionParam().getName()+"] can only be used directly inside of the declared transaction ["+transactionParameter.getTransactionId().getName()+"].", BlocklabPackage.Literals.TRANSACTION_PARAMETER__TRANSACTION_ID, INVALID_TRANSACTIONPARAM);
		}
	}
	
	@Check void checkDepositStatement(DepositStatement depositStatement) {
		checkForSemanticErrors(depositStatement);
		checkCurrrency(depositStatement.getCurrency(), depositStatement.getAmount(), BlocklabPackage.Literals.DEPOSIT_STATEMENT__CURRENCY);
		checParticipantNotRoleRef(depositStatement.getParticipant(), BlocklabPackage.Literals.DEPOSIT_STATEMENT__PARTICIPANT);
	}
	
	@Check void checkTransferStatement(TransferStatement transferStatement) {
		checkForSemanticErrors(transferStatement);
		checkCurrrency(transferStatement.getCurrency(), transferStatement.getAmount(), BlocklabPackage.Literals.TRANSFER_STATEMENT__CURRENCY);
		checParticipantNotRoleRef(transferStatement.getFromParticipant(), BlocklabPackage.Literals.TRANSFER_STATEMENT__FROM_PARTICIPANT);
		checParticipantNotRoleRef(transferStatement.getToParticipant(), BlocklabPackage.Literals.TRANSFER_STATEMENT__TO_PARTICIPANT);
	}
	
	@Check void checkWithdrawStatement(WithdrawStatement withdrawStatement) {
		checkForSemanticErrors(withdrawStatement);
		checkCurrrency(withdrawStatement.getCurrency(), withdrawStatement.getAmount(), BlocklabPackage.Literals.WITHDRAW_STATEMENT__CURRENCY);
		checParticipantNotRoleRef(withdrawStatement.getParticipant(), BlocklabPackage.Literals.WITHDRAW_STATEMENT__PARTICIPANT);
	}
	
	private void checkCurrrency(String currency, Expression amountExpression, EAttribute contractCurrencyAttribute) {
		if (amountExpression instanceof TransactionValueValue) {
			if (ecosystem != null && !ecosystem.getDefaultCurrency().equals(currency)){
				error("The currency has to match the default currency of the ecosystem ["+ecosystem.getDefaultCurrency()+"] when Transaction value is used.", contractCurrencyAttribute, INVALID_CURRENCY);
			}
		}
	}
	
	@Check
	public void checkParticipantDeclaration(ParticipantDeclaration participant) {
		checkForSemanticErrors(participant);
		checkNotEmptyString(participant.getName(), BlocklabPackage.Literals.PARTICIPANT_DECLARATION__NAME, INVALID_NAME);
		checkNotEmptyString(participant.getRole(), BlocklabPackage.Literals.PARTICIPANT_DECLARATION__ROLE, INVALID_NAME);

		if (participant instanceof ParticipantDeclarationWithAddress) {
			String address = ((ParticipantDeclarationWithAddress) participant).getAddress();
			if (address != null) {
				if (ecosystem.getAddressValidationRegex() != null && !address.matches(ecosystem.getAddressValidationRegex())) {
					error("Address ["+address+"] is not a valid " + ecosystem.name() + " address", BlocklabPackage.Literals.PARTICIPANT_DECLARATION_WITH_ADDRESS__ADDRESS, INVALID_ADDRESS);
				}
				if (ecosystem == Ecosystem.Solana) {
					if (!SolanaAddressValidator.isAddressOnCurve(address)) {
						error("Address ["+address+"] is not a valid Solana address", BlocklabPackage.Literals.PARTICIPANT_DECLARATION_WITH_ADDRESS__ADDRESS, INVALID_ADDRESS);
					}				
				}
			} 
		}
	}
	
	@Check
	public void checkDate(Date date) {
		checkValidDate(date, true, null);
	}
	
	private void checkForSemanticErrors(EObject object) {
		SemanticError error = semanticErrors.get(object);
		if (error != null) {
			error(error.getMessage(), object, error.getAttribute());
		}
	}

	private void checkValidDate(Date date, boolean checkTime, EReference literal) {
		int year = date.getYear();
		int month = date.getMonth();
		int day = date.getDay();
		if (year < YEAR_LOWER_BOUND || year > YEAR_UPPER_BOUND) {
			error("Value of " + BlocklabPackage.Literals.DATE__YEAR.getName() + " [" +year+ "] has to be between " + YEAR_LOWER_BOUND + " and " + YEAR_UPPER_BOUND, literal != null ? literal : BlocklabPackage.Literals.DATE__YEAR, INVALID_YEAR);
		}
		if (month < MONTH_LOWER_BOUND || month > MONTH_UPPER_BOUND) {
			error("Value of " + BlocklabPackage.Literals.DATE__MONTH.getName() + " [" +month+ "] has to be between " + MONTH_LOWER_BOUND + " and " + MONTH_UPPER_BOUND, literal != null ? literal : BlocklabPackage.Literals.DATE__MONTH, INVALID_MONTH);
		}
		Calendar mycal = new GregorianCalendar(year, month - 1, 1);
        // calculate the day upper bound per month here
		int dayUpperBound = mycal.getActualMaximum(Calendar.DAY_OF_MONTH);
        if (day < DAY_LOWER_BOUND || day > dayUpperBound) {
        	error("Value of " + BlocklabPackage.Literals.DATE__DAY.getName() + " [" +day+ "] has to be between " + DAY_LOWER_BOUND + " and " + dayUpperBound, literal != null ? literal : BlocklabPackage.Literals.DATE__DAY, INVALID_DAY);
        }
        
        if (checkTime) {
        	int hour = date.getHour();
        	if (hour < HOUR_LOWER_BOUND || hour > HOUR_UPPER_BOUND) {
 	   			error("Value of " + BlocklabPackage.Literals.DATE__HOUR.getName() + " [" + hour + "] has to be between " + HOUR_LOWER_BOUND + " and " + HOUR_UPPER_BOUND, literal != null ? literal : BlocklabPackage.Literals.DATE__HOUR, INVALID_HOUR);
    		}
        	int minute = date.getMinute();
        	if (minute < MINUTE_LOWER_BOUND || minute > MINUTE_UPPER_BOUND) {
        		error("Value of " + BlocklabPackage.Literals.DATE__MINUTE.getName() + " [" +minute+ "] has to be between " + MINUTE_LOWER_BOUND + " and " + MINUTE_UPPER_BOUND, literal != null ? literal : BlocklabPackage.Literals.DATE__MINUTE, INVALID_MINUTE);
        	}
        }
	}
	
	private void checkDateNotInPast(Date date, EReference literal) {
		if (Calendar.getInstance().after(DslParser.parseToCalendar(date))) {
			error("Date of " + literal.getName() + " is not allowed to be in the past", literal, INVALID_DATE);
		}
	}	

	private void checParticipantNotRoleRef(ParticipantExpression participantExpression, EReference literal) {
		if (participantExpression instanceof ParticipantRole) {
			error("Not possible to specify a participant as a role here", literal, INVALID_PARTICIPANT);
		}
	}	
	
	private void checkNotEmptyString(String toCheck, EAttribute literal, String error) {
		if(toCheck != null && toCheck.isBlank()) {
			error(literal.getName() + " cannot be blank", literal, error);
		}
	}
	
	// checks if the transaction parameter is "directly" inside the decalred transaction
	private static boolean hasParentTransaction(TransactionParameter transactionParameter) {
		EObject parent = transactionParameter.eContainer();
		while(parent != null) {
			if (parent instanceof Transaction){
				Transaction a = (Transaction) parent;
				if (a.getName().equals(transactionParameter.getTransactionId().getName())) {
					return true;
				} 
				// break here as only the first transaction found is checked
				break;
			}
			parent = parent.eContainer();
		}
		return false;
	}

	private void checkForRestrictedName(String variableName, EAttribute literal) {
		if (restrictedNames.contains(variableName)) {
			error("The variable '"+variableName+"' is reserved, please use a different name.", literal, INVALID_NAME);
		}
		if (variableName.startsWith("_")) {
			error("The variable is not allowed to start with '_', please use a different name.", literal, INVALID_NAME);
		}
	}

	private DataType getDataTypeOfExpression(Expression expression) {
		if (expression == null) {
			return null;
		}
		if (expression instanceof ContractParameter) {
			return dataTypesForContractParams.get(((ContractParameter) expression).getContractParam().getName());
		} else if (expression instanceof TransactionParameter){
			return dataTypesForTransactionParams.get(((TransactionParameter) expression).getTransactionParam().getName());
		} else if (expression instanceof Property){
			return dataTypesForProperties.get(((Property) expression).getPropertyName().getName());
		} else if (expression instanceof BooleanValue) {
			return BlockLabUtil.DataType.BOOLEAN;
		} else if (expression instanceof StringValue) {
			return BlockLabUtil.DataType.TEXT;
		} else if (expression instanceof Date) {
			return BlockLabUtil.DataType.DATE;
		} else if (expression instanceof NumberValue) {
			return BlockLabUtil.DataType.NUMBER;
		} else if (expression instanceof TransactionValueValue) {
			return BlockLabUtil.DataType.NUMBER;
		} else if (expression instanceof ParticipantExpression) {
			return BlockLabUtil.DataType.PARTICIPANT;
		} else if (expression instanceof ParticipantRef) {
			return BlockLabUtil.DataType.PARTICIPANT;
		} else if (expression instanceof TransactionCallerValue) {
			return BlockLabUtil.DataType.PARTICIPANT;
		} else if (expression instanceof MathExpr) {
			return BlockLabUtil.DataType.NUMBER;
		} else if (expression instanceof AndExpr) {
			return BlockLabUtil.DataType.BOOLEAN;
		} else if (expression instanceof OrExpr) {
			return BlockLabUtil.DataType.BOOLEAN;
		} else if (expression instanceof NotExpr) {
			return BlockLabUtil.DataType.BOOLEAN;
		} else if (expression instanceof CompareExpr) {
			return BlockLabUtil.DataType.BOOLEAN;
		} else {
			throw new RuntimeException("Unhandled case: " + expression);
		}
	}

}
