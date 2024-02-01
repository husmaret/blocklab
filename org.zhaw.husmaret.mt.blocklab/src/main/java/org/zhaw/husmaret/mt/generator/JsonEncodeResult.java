package org.zhaw.husmaret.mt.generator;

import java.util.Calendar;
import java.util.Collection;
import java.util.List;

public class JsonEncodeResult {

	private BlockLabVersion blocklabVersion;
	private Ecosystem ecosystem;
	private List<GeneratedFile> generatedFiles;
	private String simulationStart;
	private Boolean useAccountBalances = Boolean.FALSE;
	private Boolean useCreatorRole = Boolean.FALSE;
	private Boolean useContractStart = Boolean.FALSE;
	private List<Property> properties;
	private List<Param> contractParams;
	private List<Timeout> timeouts;
	private List<Transaction> transactions;
	private List<String> roles;
	private Collection<Participant> participants;

	public JsonEncodeResult(BlockLabVersion blocklabVersion, Ecosystem ecosystem, List<GeneratedFile> generatedFiles) {
		this.blocklabVersion = blocklabVersion;
		this.ecosystem = ecosystem;
		this.generatedFiles = generatedFiles;
		this.simulationStart = AbstractBlockchainGenerator.SDF_ISO.format(Calendar.getInstance().getTime());
	}

	public BlockLabVersion getBlockLabVersion() {
		return blocklabVersion;
	}

	public Ecosystem getEcosystem() {
		return ecosystem;
	}

	public List<GeneratedFile> getGeneratedFiles() {
		return generatedFiles;
	}

	public void setGeneratedFiles(List<GeneratedFile> generatedFiles) {
		this.generatedFiles = generatedFiles;
	}

	public String getSimulationStart() {
		return simulationStart;
	}

	public void setSimulationStart(String simulationStart) {
		this.simulationStart = simulationStart;
	}
	
	public List<Param> getContractParams() {
		return contractParams;
	}
	
	public void setContractParams(List<Param> contractParams) {
		this.contractParams = contractParams;
	}

	public Boolean getUseAccountBalances() {
		return useAccountBalances;
	}

	public void setUseAccountBalances(Boolean useAccountBalances) {
		this.useAccountBalances = useAccountBalances;
	}

	public Boolean getUseCreatorRole() {
		return useCreatorRole;
	}

	public void setUseCreatorRole(Boolean useCreatorRole) {
		this.useCreatorRole = useCreatorRole;
	}

	public Boolean getUseContractStart() {
		return useContractStart;
	}

	public void setUseContractStart(Boolean useContractStart) {
		this.useContractStart = useContractStart;
	}

	public List<Property> getProperties() {
		return properties;
	}

	public void setProperties(List<Property> properties) {
		this.properties = properties;
	}

	public List<Timeout> getTimeouts() {
		return timeouts;
	}

	public void setTimeouts(List<Timeout> timeouts) {
		this.timeouts = timeouts;
	}

	public List<Transaction> getTransactions() {
		return transactions;
	}

	public void setTransactions(List<Transaction> transactions) {
		this.transactions = transactions;
	}

	public List<String> getRoles() {
		return roles;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}

	public Collection<Participant> getParticipants() {
		return participants;
	}

	public void setParticipants(Collection<Participant> participants) {
		this.participants = participants;
	}

	public static class Timeout {
		private String name;
		private String value;
		private String contractParam;
		private int offsetInSeconds;

		public Timeout(String name, String value, String contractParam, int offsetInSeconds) {
			this.name = name;
			this.value = value;
			this.contractParam = contractParam;
			this.offsetInSeconds = offsetInSeconds;
		}

		public String getName() {
			return name;
		}

		public String getValue() {
			return value;
		}

		public String getContractParam() {
			return contractParam;
		}

		public int getOffsetInSeconds() {
			return offsetInSeconds;
		}
	}

	public static class Property {
		private String type;
		private String name;
		private Object value;
		private String contractParam;
		
		public Property(String type, String name, Object defaultValue, String contractParam) {
			this.type = type;
			this.name = name;
			this.value = defaultValue;
			this.contractParam = contractParam;
		}
		
		public String getType() {
			return type;
		}
		
		public String getName() {
			return name;
		}

		public Object getValue() {
			return value;
		}

		public String getContractParam() {
			return contractParam;
		}
	}

	public static class Statement {
		private String type;
		private Object instructions;

		public Statement(String type, Object instructions) {
			this.type = type;
			this.instructions = instructions;
		}

		public String getType() {
			return type;
		}

		public Object getInstructions() {
			return instructions;
		}
	}

	public static class SetPropertyInstruction {
		
		private String propertyName;
		private String expression;

		public SetPropertyInstruction(String propertyName, String expression) {
			this.propertyName = propertyName;
			this.expression = expression;
		}

		public String getPropertyName() {
			return propertyName;
		}

		public String getExpression() {
			return expression;
		}
	}

	
	public static class DepositOrWithdrawInstruction {
		
		private String amount;
		private String token;
		private String account;

		public DepositOrWithdrawInstruction(String amount, String token, String account) {
			this.amount = amount;
			this.token = token;
			this.account = account;
		}

		public String getAmount() {
			return amount;
		}

		public String getToken() {
			return token;
		}

		public String getAccount() {
			return account;
		}
	}

	public static class TransferInstruction {
		
		private String amount;
		private String token;
		private String fromAccount;
		private String toAccount;

		public TransferInstruction(String amount, String token, String fromAccount, String toAccount) {
			this.amount = amount;
			this.token = token;
			this.fromAccount = fromAccount;
			this.toAccount = toAccount;
		}

		public String getAmount() {
			return amount;
		}

		public String getToken() {
			return token;
		}

		public String getFromAccount() {
			return fromAccount;
		}

		public String getToAccount() {
			return toAccount;
		}
	}

	public static class IfInstruction {
		
		private String condition;
		private Statement[] statements;

		public IfInstruction(String condition, Statement[] statements) {
			this.condition = condition;
			this.statements = statements;
		}

		public String getCondition() {
			return condition;
		}

		public Statement[] getStatements() {
			return statements;
		}

	}

	public static class IfElseInstruction extends IfInstruction {

		private Statement[] elseStatements;
		
		public IfElseInstruction(String condition, Statement[] statements, Statement[] elseStatements) {
			super(condition, statements);
			this.elseStatements = elseStatements;
		}

		public Statement[] getElseStatements() {
			return elseStatements;
		}
	}

	public static class Transaction {
		private String name;
		private List<Param> params;
		private Boolean onlyOnce;
		private Boolean allowedByAnyone;
		private String allowed;
		private String anyoneAssignRole;
		private String condition;
		private String[] previousTransactions;
		private Timeout[] beforeTimeouts;
		private Timeout[] afterTimeouts;
		private Statement[] statements;
		private Boolean useTransactionValue;
		
		public Transaction(String name, List<Param> params, Boolean onlyOnce, Boolean allowedByAnyone, String allowed, String anyoneAssignRole, String condition, Timeout[] beforeTimeouts, Timeout[] afterTimeouts, String[] previousTransactions, Statement[] statements, Boolean useTransactionValue) {
			this.name = name;
			this.params = params;
			this.onlyOnce = onlyOnce;
			this.allowedByAnyone = allowedByAnyone;
			this.allowed = allowed;
			this.anyoneAssignRole = anyoneAssignRole;
			this.condition = condition;
			this.beforeTimeouts = beforeTimeouts;
			this.afterTimeouts = afterTimeouts;
			this.previousTransactions = previousTransactions;
			this.statements = statements;
			this.useTransactionValue = useTransactionValue;
			
		}

		public String getName() {
			return name;
		}

		public List<Param> getParams() {
			return params;
		}

		public Boolean getOnlyOnce() {
			return onlyOnce;
		}

		public Boolean getAllowedByAnyone() {
			return allowedByAnyone;
		}

		public String getAllowed() {
			return allowed;
		}

		public String getAnyoneAssignRole() {
			return anyoneAssignRole;
		}

		public String getCondition() {
			return condition;
		}

		public Timeout[] getBeforeTimeouts() {
			return beforeTimeouts;
		}

		public Timeout[] getAfterTimeouts() {
			return afterTimeouts;
		}

		public String[] getPreviousTransactions() {
			return previousTransactions;
		}

		public Statement[] getStatements() {
			return statements;
		}

		public Boolean getUseTransactionValue() {
			return useTransactionValue;
		}
	}

	public static class Param {
		private String type;
		private String paramName;
		private String value;
		
		public Param(String type, String paramName) {
			this.type = type;
			this.paramName = paramName;
		}
		
		public String getType() {
			return type;
		}
		
		public String getParamName() {
			return paramName;
		}

		public String getValue() {
			return value;
		}
	}
	
	public static class Participant {
		private String name;
		private String address;
		private String contractParam;
		private String role;

		public Participant(String name, String address, String contractParam, String role) {
			this.name = name;
			this.address = address;
			this.contractParam = contractParam;
			this.role = role;
		}

		public String getName() {
			return name;
		}

		public String getAddress() {
			return address;
		}

		public String getContractParam() {
			return contractParam;
		}

		public String getRole() {
			return role;
		}

	}

	public static class GeneratedFile {

		private String folder;
		private String fileName;
		private String content;

		public GeneratedFile(String folder, String fileName, String content) {
			this.folder = folder;
			this.fileName = fileName;
			this.content = content;
		}

		public String getFolder() {
			return folder;
		}

		public String getFileName() {
			return fileName;
		}

		public String getContent() {
			return content;
		}

	}

}
