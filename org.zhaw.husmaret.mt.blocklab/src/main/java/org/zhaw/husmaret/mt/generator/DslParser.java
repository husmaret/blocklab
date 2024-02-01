package org.zhaw.husmaret.mt.generator;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.eclipse.emf.common.util.ECollections;
import org.eclipse.emf.common.util.EList;
import org.eclipse.emf.common.util.TreeIterator;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EReference;
import org.zhaw.husmaret.mt.blocklab.Access;
import org.zhaw.husmaret.mt.blocklab.AccountBalancesValue;
import org.zhaw.husmaret.mt.blocklab.AlwaysValue;
import org.zhaw.husmaret.mt.blocklab.AndExpr;
import org.zhaw.husmaret.mt.blocklab.AnyoneRoleValue;
import org.zhaw.husmaret.mt.blocklab.AnyoneValue;
import org.zhaw.husmaret.mt.blocklab.BlocklabPackage;
import org.zhaw.husmaret.mt.blocklab.BooleanValue;
import org.zhaw.husmaret.mt.blocklab.CompareExpr;
import org.zhaw.husmaret.mt.blocklab.Condition;
import org.zhaw.husmaret.mt.blocklab.Contract;
import org.zhaw.husmaret.mt.blocklab.ContractParameter;
import org.zhaw.husmaret.mt.blocklab.CreatorValue;
import org.zhaw.husmaret.mt.blocklab.Date;
import org.zhaw.husmaret.mt.blocklab.DateExpression;
import org.zhaw.husmaret.mt.blocklab.DepositStatement;
import org.zhaw.husmaret.mt.blocklab.DurationFromStart;
import org.zhaw.husmaret.mt.blocklab.Expression;
import org.zhaw.husmaret.mt.blocklab.FinishStatement;
import org.zhaw.husmaret.mt.blocklab.IfElseStatement;
import org.zhaw.husmaret.mt.blocklab.IfStatement;
import org.zhaw.husmaret.mt.blocklab.MathExpr;
import org.zhaw.husmaret.mt.blocklab.NotExpr;
import org.zhaw.husmaret.mt.blocklab.NumberValue;
import org.zhaw.husmaret.mt.blocklab.OrExpr;
import org.zhaw.husmaret.mt.blocklab.ParameterDeclaration;
import org.zhaw.husmaret.mt.blocklab.ParticipantDeclarationWithAddress;
import org.zhaw.husmaret.mt.blocklab.ParticipantDeclarationWithContractParam;
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
import org.zhaw.husmaret.mt.blocklab.WhenOrFinish;
import org.zhaw.husmaret.mt.blocklab.WhenOrStatement;
import org.zhaw.husmaret.mt.blocklab.WithdrawStatement;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.DepositOrWithdrawInstruction;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.IfElseInstruction;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.IfInstruction;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.Param;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.SetPropertyInstruction;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.Statement;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.Timeout;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.TransferInstruction;
import org.zhaw.husmaret.mt.generator.ParsedObjects.SemanticError;

public class DslParser {

	public static final String CONTRACTPARAM_PREFIX = "$C{";
	public static final String TRANSACTIONPARAM_PREFIX = "$T{";
	public static final String PARTICIPANT_PREFIX = "$P{";
	public static final String ASSETPROPERTY_PREFIX = "$A{";
	public static final String ROLE_PREFIX = "$R{";

	public static final String PLACEHOLDER_TRANSACTIONVALUE = "${TransactionValue}";
	public static final String PLACEHOLDER_CREATOR = "${Creator}";
	public static final String PLACEHOLDER_TRANSACTIONCALLER = "${TransactionCaller}";

	public static final String VARIABLE_SUFFIX = "}";

	public static final String COMPARE_EXPR_OPERATOR_EQUALS = "equals";
	public static final String COMPARE_EXPR_OPERATOR_NOTEQUALS = "not equals";

	public static Calendar parseToCalendar(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.set(date.getYear(), date.getMonth() - 1, date.getDay(), date.getHour(), date.getMinute());
		return cal;
	}

	public static ParsedObjects parseContractObjects(Contract contract) {
		Map<EObject, SemanticError> semanticErrors = new HashMap<>();
		List<Timeout> timeouts = new ArrayList<>();
		Map<String, JsonEncodeResult.Transaction> transactions = new LinkedHashMap<>();
		List<String> roles = new ArrayList<>();
		List<JsonEncodeResult.Property> properties = new ArrayList<>();
		List<Param> contractParams = new ArrayList<>();
		Map<String, List<Timeout>> transactionAfterTimeouts = new HashMap<>();
		Map<String, JsonEncodeResult.Participant> participants = new HashMap<>();
		Boolean useAccountBalances = Boolean.FALSE;
		Boolean useCreatorRole = Boolean.FALSE;
		Boolean useContractStart = Boolean.FALSE;
		Boolean hasDepositStatement = Boolean.FALSE;
		Boolean hasWithdrawStatement = Boolean.FALSE;
		Boolean hasTransferStatement = Boolean.FALSE;
		// TODO: get the participant of the first transaction to select a participant by
		// default in the simulator.

		for (Iterator<EObject> contentIterator = contract.eAllContents(); contentIterator.hasNext();) {
			EObject eObject = contentIterator.next();

			if (eObject instanceof ParticipantDeclarationWithAddress) {
				ParticipantDeclarationWithAddress p = ((ParticipantDeclarationWithAddress) eObject);
				String address = p.getAddress();
				JsonEncodeResult.Participant existingParticipant = participants.get(address);
				if (existingParticipant == null) {
					participants.put(address,
							new JsonEncodeResult.Participant(p.getName(), address, null, p.getRole()));
					if (p.getRole() != null && !roles.contains(p.getRole())) {
						roles.add(p.getRole());
					}
				} else if (participants.containsKey(address)) {
					semanticErrors.put(p, new ParsedObjects.SemanticError(
							BlocklabPackage.Literals.PARTICIPANT_DECLARATION_WITH_ADDRESS__ADDRESS,
							"The address provided for participant [" + p.getName()
									+ "] has already been used for another participant. Please provide a unique address."));
				}
			} else if (eObject instanceof ParticipantDeclarationWithContractParam) {
				ParticipantDeclarationWithContractParam p = ((ParticipantDeclarationWithContractParam) eObject);
				String parameterName = p.getContractParam().getContractParam().getName();
				JsonEncodeResult.Participant existingParticipant = participants.get(parameterName);
				if (existingParticipant == null) {
					participants.put(parameterName,
							new JsonEncodeResult.Participant(p.getName(), null, parameterName, p.getRole()));
					if (p.getRole() != null && !roles.contains(p.getRole())) {
						roles.add(p.getRole());
					}
				} else if (participants.containsKey(parameterName)) {
					semanticErrors.put(p, new ParsedObjects.SemanticError(
							BlocklabPackage.Literals.PARTICIPANT_DECLARATION_WITH_ADDRESS__ADDRESS,
							"The contract parameter provided for participant [" + p.getName()
									+ "] has already been used."));
				}
			}

			if (eObject instanceof When) {
				When when = (When) eObject;
				Timeout timeout = parseTimeoutFromWhen(when);
				if (timeout != null) {
					String[] transactionsNameAfterTimeout = parseTransactionsAfterWhen(when.getContinueAs());
					for (String transactionName : transactionsNameAfterTimeout) {
						transactionAfterTimeouts.computeIfAbsent(transactionName, v -> new ArrayList<>()).add(timeout);
					}
					if (!timeouts.stream().anyMatch(t -> t.getOffsetInSeconds() == timeout.getOffsetInSeconds())) {
						timeouts.add(timeout);
					}
				}
			}

			if (eObject instanceof ParameterDeclaration) {
				ParameterDeclaration p = (ParameterDeclaration) eObject;
				// add to contract params if the parent is a contract or a participant
				// declaration
				if (p.eContainer() instanceof Contract) {
					contractParams.add(new Param(p.getType(), p.getName()));
				}
			}

			if (eObject instanceof PropertyDeclaration) {
				PropertyDeclaration p = (PropertyDeclaration) eObject;
				ValueLiteral valueLiteral = p.getDefaultValue();
				if (valueLiteral != null) {
					if (valueLiteral instanceof ContractParameter) {
						String contractParamName = ((ContractParameter) valueLiteral).getContractParam().getName();
						properties.add(new JsonEncodeResult.Property(p.getType(), p.getName(),
								CONTRACTPARAM_PREFIX + contractParamName + VARIABLE_SUFFIX, contractParamName));
					} else if (valueLiteral instanceof StringValue) {
						properties.add(new JsonEncodeResult.Property(p.getType(), p.getName(),
								((StringValue) valueLiteral).getValue(), null));
					} else if (valueLiteral instanceof NumberValue) {
						properties.add(new JsonEncodeResult.Property(p.getType(), p.getName(),
								((NumberValue) valueLiteral).getValue(), null));
					} else if (valueLiteral instanceof BooleanValue) {
						properties.add(new JsonEncodeResult.Property(p.getType(), p.getName(),
								Boolean.parseBoolean(((BooleanValue) valueLiteral).getValue()), null));
					} else if (valueLiteral instanceof Date) {
						properties
								.add(new JsonEncodeResult.Property(p.getType(), p.getName(),
										AbstractBlockchainGenerator.SDF_ISO
												.format(DslParser.parseToCalendar((Date) valueLiteral).getTime()),
										null));
					} else if (valueLiteral instanceof ParticipantRef) {
						properties
								.add(new JsonEncodeResult.Property(p.getType(), p.getName(), PARTICIPANT_PREFIX
										+ ((ParticipantRef) valueLiteral).getParticipant().getName() + VARIABLE_SUFFIX,
										null));
					} else {
						throw new RuntimeException("Unsupported default value Literal: " + valueLiteral);
					}
				} else {
					// asset property without default value
					properties.add(new JsonEncodeResult.Property(p.getType(), p.getName(), null, null));
				}
			}

			if (eObject instanceof Transaction) {
				Transaction a = (Transaction) eObject;
				List<Param> transactionParams = new ArrayList<>();
				if (a.getParams() != null) {
					for (ParameterDeclaration transactionParam : a.getParams()) {
						transactionParams.add(new Param(transactionParam.getType(), transactionParam.getName()));
					}
				}
				Access access = a.getAllowed();
				String allowed = parseAccess(semanticErrors, BlocklabPackage.Literals.TRANSACTION__ALLOWED, access);
				String anyoneAssignRole = null;
				Boolean allowedByAnyone = Boolean.FALSE;
				if (allowed.startsWith("Anyone")) {
					allowedByAnyone = Boolean.TRUE;
					if (allowed.indexOf("(") > 0 && allowed.indexOf(")") > 0) {
						anyoneAssignRole = allowed.substring(allowed.indexOf("(") + 1, allowed.indexOf(")"));
					}
				}

				Condition transactionConditon = a.getCondition();
				String condition = parseCondition(semanticErrors, a.getCondition());
				if (condition.contains(TRANSACTIONPARAM_PREFIX)) {
					semanticErrors.put(transactionConditon, new ParsedObjects.SemanticError(
							BlocklabPackage.Literals.TRANSACTION__CONDITION,
							"The condition of the transaction contains a transaction parameter, which is currently not supported."));
				}

				String[] previousTransactions = getParentTransactionNames(a);

				EList<WhenOrStatement> nextStatements = a.getStatements();
				EList<org.zhaw.husmaret.mt.blocklab.Statement> statementsOnly = extractStatementsOnly(nextStatements);

				Statement[] statements = parseStatements(semanticErrors, statementsOnly);

				// get the enclosing when contract of the transaction
				Timeout[] beforeTimeouts = new Timeout[1];
				Timeout beforeTimeout = parseTimeoutFromWhen(getEnclosingWhen(a));
				if (beforeTimeout != null) {
					beforeTimeouts[0] = beforeTimeout;
				}

				List<Timeout> afterTimeoutsList = transactionAfterTimeouts.get(a.getName());
				Timeout[] afterTimeouts;
				if (afterTimeoutsList != null) {
					afterTimeouts = afterTimeoutsList.toArray(new Timeout[afterTimeoutsList.size()]);
				} else {
					afterTimeouts = new Timeout[0];
				}

				Boolean useTransactionValue = searchForTransactionValueElement(transactionConditon, statementsOnly);

				transactions.put(a.getName(),
						new JsonEncodeResult.Transaction(a.getName(), transactionParams,
								Boolean.parseBoolean(a.getOnlyOnce()), allowedByAnyone,
								allowed, anyoneAssignRole, condition, beforeTimeouts, afterTimeouts,
								previousTransactions, statements, useTransactionValue));
			}

			if (eObject instanceof ParticipantRole) {
				ParticipantRole r = (ParticipantRole) eObject;
				if (r.getRole() != null && !roles.contains(r.getRole())) {
					roles.add(r.getRole());
				}
			}

			if (eObject instanceof AnyoneRoleValue) {
				AnyoneRoleValue r = (AnyoneRoleValue) eObject;
				if (r.getRole() != null && !roles.contains(r.getRole())) {
					roles.add(r.getRole());
				}
			}

			if (eObject instanceof CreatorValue) {
				useCreatorRole = Boolean.TRUE;
			}
			if (eObject instanceof DurationFromStart) {
				useContractStart = Boolean.TRUE;
			}
			if (eObject instanceof AccountBalancesValue) {
				useAccountBalances = Boolean.TRUE;
			}
			if (eObject instanceof DepositStatement) {
				hasDepositStatement = Boolean.TRUE;
			}
			if (eObject instanceof WithdrawStatement) {
				hasWithdrawStatement = Boolean.TRUE;
			}
			if (eObject instanceof TransferStatement) {
				hasTransferStatement = Boolean.TRUE;
			}
		}

		// check if the assets require the AccountBalances
		if (!useAccountBalances && (hasDepositStatement || hasWithdrawStatement || hasTransferStatement)) {
			semanticErrors.put(contract, new ParsedObjects.SemanticError(
					BlocklabPackage.Literals.CONTRACT__ASSET,
					"The contract contains statements which need to store account balances. Please add the Asset 'Account balances' to the contract."));
		}

		List<JsonEncodeResult.Transaction> transactionsList = new ArrayList<JsonEncodeResult.Transaction>(
				transactions.values());
		// reverse the order of the transactions
		Collections.reverse(transactionsList);

		return new ParsedObjects(participants, semanticErrors, useAccountBalances,
				useCreatorRole, useContractStart, properties, contractParams, timeouts,
				transactionsList, roles);
	}

	private static Boolean searchForTransactionValueElement(Condition transactionCondition,
			EList<org.zhaw.husmaret.mt.blocklab.Statement> statementsOnly) {
		if (transactionCondition != null) {
			TreeIterator<EObject> conditionContents = transactionCondition.eAllContents();
			while (conditionContents.hasNext()) {
				if (conditionContents.next() instanceof TransactionValueValue) {
					return Boolean.TRUE;
				}
			}
		}
		if (statementsOnly != null) {
			for (org.zhaw.husmaret.mt.blocklab.Statement statement : statementsOnly) {
				TreeIterator<EObject> contents = statement.eAllContents();
				while (contents.hasNext()) {
					if (contents.next() instanceof TransactionValueValue) {
						return Boolean.TRUE;
					}
				}
			}
		}
		return Boolean.FALSE;
	}

	private static EList<org.zhaw.husmaret.mt.blocklab.Statement> extractStatementsOnly(
			EList<WhenOrStatement> whenContractOrStatements) {
		ArrayList<org.zhaw.husmaret.mt.blocklab.Statement> statements = new ArrayList<>();
		if (whenContractOrStatements != null) {
			for (WhenOrStatement whenContractOrStatement : whenContractOrStatements) {
				if (whenContractOrStatement instanceof org.zhaw.husmaret.mt.blocklab.Statement) {
					statements.add((org.zhaw.husmaret.mt.blocklab.Statement) whenContractOrStatement);
				}
			}
		}
		return ECollections.asEList(statements);
	}

	private static Statement[] parseStatements(Map<EObject, ParsedObjects.SemanticError> semanticErrors,
			EList<org.zhaw.husmaret.mt.blocklab.Statement> statementList) {
		Statement[] statements = new Statement[statementList.size()];
		int index = 0;
		if (statementList != null) {
			for (org.zhaw.husmaret.mt.blocklab.Statement stmt : statementList) {
				if (stmt != null) {
					if (stmt instanceof SetPropertyStatement) {
						SetPropertyStatement setContract = (SetPropertyStatement) stmt;
						Expression expr = setContract.getValue();
						String parsedExpression = parseExpression(semanticErrors,
								BlocklabPackage.Literals.SET_PROPERTY_STATEMENT__VALUE, expr);
						if (setContract.getProperty() != null && setContract.getProperty().getPropertyName() != null) {
							SetPropertyInstruction instruction = new SetPropertyInstruction(
									setContract.getProperty().getPropertyName().getName(), parsedExpression);
							statements[index] = new JsonEncodeResult.Statement("SetProperty", instruction);
						}
					} else if (stmt instanceof DepositStatement) {
						DepositStatement depositStatement = (DepositStatement) stmt;
						String account = parseParticipantExpression(semanticErrors,
								BlocklabPackage.Literals.DEPOSIT_STATEMENT__PARTICIPANT,
								depositStatement.getParticipant());
						DepositOrWithdrawInstruction instruction = new DepositOrWithdrawInstruction(
								parseExpression(semanticErrors, BlocklabPackage.Literals.DEPOSIT_STATEMENT__AMOUNT,
										depositStatement.getAmount()),
								depositStatement.getCurrency(), account);
						statements[index] = new JsonEncodeResult.Statement("Deposit", instruction);
					} else if (stmt instanceof TransferStatement) {
						TransferStatement transferStatement = (TransferStatement) stmt;
						String fromAccount = parseParticipantExpression(semanticErrors,
								BlocklabPackage.Literals.TRANSFER_STATEMENT__FROM_PARTICIPANT,
								transferStatement.getFromParticipant());
						String toAccount = parseParticipantExpression(semanticErrors,
								BlocklabPackage.Literals.TRANSFER_STATEMENT__TO_PARTICIPANT,
								transferStatement.getToParticipant());
						TransferInstruction instruction = new TransferInstruction(
								parseExpression(semanticErrors, BlocklabPackage.Literals.TRANSFER_STATEMENT__AMOUNT,
										transferStatement.getAmount()),
								transferStatement.getCurrency(), fromAccount,
								toAccount);
						statements[index] = new JsonEncodeResult.Statement("Transfer", instruction);
					} else if (stmt instanceof WithdrawStatement) {
						WithdrawStatement withdrawStatement = (WithdrawStatement) stmt;
						String account = parseParticipantExpression(semanticErrors,
								BlocklabPackage.Literals.WITHDRAW_STATEMENT__PARTICIPANT,
								withdrawStatement.getParticipant());
						DepositOrWithdrawInstruction instruction = new DepositOrWithdrawInstruction(
								parseExpression(semanticErrors, BlocklabPackage.Literals.WITHDRAW_STATEMENT__AMOUNT,
										withdrawStatement.getAmount()),
								withdrawStatement.getCurrency(), account);
						statements[index] = new JsonEncodeResult.Statement("Withdraw", instruction);
					} else if (stmt instanceof IfStatement) {
						IfStatement ifStatement = (IfStatement) stmt;
						String ifCondition = parseCondition(semanticErrors, ifStatement.getObservation());
						Statement[] ifStatements = parseStatements(semanticErrors, ifStatement.getStatements());
						IfInstruction ifInstruction = new IfInstruction(ifCondition, ifStatements);
						statements[index] = new JsonEncodeResult.Statement("If", ifInstruction);
					} else if (stmt instanceof IfElseStatement) {
						IfElseStatement ifElseStatement = (IfElseStatement) stmt;
						String ifCondition = parseCondition(semanticErrors, ifElseStatement.getObservation());
						Statement[] ifStatements = parseStatements(semanticErrors, ifElseStatement.getStatements());
						Statement[] elseStatements = parseStatements(semanticErrors,
								ifElseStatement.getElseStatements());
						IfElseInstruction ifElseInstruction = new IfElseInstruction(ifCondition, ifStatements,
								elseStatements);
						statements[index] = new JsonEncodeResult.Statement("IfElse", ifElseInstruction);
					} else if (stmt instanceof FinishStatement) {
						statements[index] = new JsonEncodeResult.Statement("Finish", null);
					} else {
						throw new RuntimeException("Unsupported statement: " + stmt);
					}
					index += 1;
				}
			}
		}
		return statements;
	}

	private static String[] parseTransactionsAfterWhen(WhenOrFinish continueAsWhenOrFinish) {
		List<String> transactionNames = new ArrayList<>();
		if (continueAsWhenOrFinish instanceof When) {
			TreeIterator<EObject> contents = continueAsWhenOrFinish.eAllContents();
			while (contents.hasNext()) {
				EObject content = contents.next();
				if (content instanceof Transaction) {
					transactionNames.add(((Transaction) content).getName());
				}
			}
		}
		return transactionNames.toArray(new String[transactionNames.size()]);
	}

	private static When getEnclosingWhen(Transaction a) {
		EObject parent = a.eContainer();
		while (parent != null) {
			if (parent instanceof When) {
				return (When) parent;
			}
			parent = parent.eContainer();
		}
		throw new RuntimeException("No When found as parent.");
	}

	private static Timeout parseTimeoutFromWhen(When when) {
		DateExpression dateExpression = when.getAfter();
		if (dateExpression == null) {
			return null;
		}

		if (dateExpression instanceof Date) {
			Calendar cal = parseToCalendar((Date) dateExpression);
			return new Timeout("Timeout", AbstractBlockchainGenerator.SDF_ISO.format(cal.getTime()), null, 0);
		} else if (dateExpression instanceof ContractParameter) {
			StringBuilder transactionNames = new StringBuilder();
			for (Transaction a : when.getTransactions()) {
				if (transactionNames.length() > 0) {
					transactionNames.append("/");
				}
				transactionNames.append(a.getName());
			}
			String contractParamName = ((ContractParameter) dateExpression).getContractParam().getName();
			return new Timeout("Timeout " + transactionNames, null, contractParamName, 0);
		} else if (dateExpression instanceof DurationFromStart) {
			DurationFromStart dateFromStart = (DurationFromStart) dateExpression;
			int offsetInSeconds = parseSecondsFromDurationFromStart(dateFromStart);
			return new Timeout("Start +" + dateFromStart.getAmount() + " " + dateFromStart.getDuration(), null, null,
					offsetInSeconds);
		} else {
			throw new RuntimeException("Unexpected When date expression: " + dateExpression);
		}
	}

	private static int parseSecondsFromDurationFromStart(DurationFromStart dateFromStart) {
		switch (dateFromStart.getDuration()) {
			case "minutes":
				return dateFromStart.getAmount() * 60;
			case "hours":
				return dateFromStart.getAmount() * 60 * 60;
			case "days":
				return dateFromStart.getAmount() * 60 * 60 * 24;
			case "weeks":
				return dateFromStart.getAmount() * 60 * 60 * 24 * 7;
			case "months":
				return dateFromStart.getAmount() * 60 * 60 * 24 * 30;
			case "years":
				return dateFromStart.getAmount() * 60 * 60 * 24 * 365;
			default:
				return dateFromStart.getAmount();
		}
	}

	// checks if the transaction parameter is "directly" inside the decalred
	// transaction
	private static String[] getParentTransactionNames(Transaction transaction) {
		List<String> previousTransactions = new ArrayList<>();
		EObject parent = transaction.eContainer();
		while (parent != null) {
			if (parent instanceof Transaction) {
				Transaction a = (Transaction) parent;
				previousTransactions.add(a.getName());
			}
			parent = parent.eContainer();
		}
		return previousTransactions.toArray(new String[previousTransactions.size()]);
	}

	private static String parseCondition(Map<EObject, SemanticError> semanticErrors, Condition condition) {
		if (condition == null) {
			// return false when no condition is specified
			return "false";
		}
		if (condition instanceof Property) {
			return parseExpression(semanticErrors, null, (Property) condition);
		} else if (condition instanceof Expression) {
			return parseExpression(semanticErrors, null, (Expression) condition);
		} else if (condition instanceof AlwaysValue) {
			// Branch 'Always', to always evaluate 'true'
			return "true";
		} else {
			throw new RuntimeException("Unsupported condition: " + condition);
		}
	}

	private static String parseExpression(Map<EObject, SemanticError> semanticErrors, EReference ref, Expression expr) {
		if (expr == null) {
			semanticErrors.put(expr, new SemanticError(ref, "Incomplete expression, plase specify a value."));
			return "";
		}
		if (expr instanceof ContractParameter) {
			return CONTRACTPARAM_PREFIX + ((ContractParameter) expr).getContractParam().getName() + VARIABLE_SUFFIX;
		} else if (expr instanceof TransactionParameter) {
			return TRANSACTIONPARAM_PREFIX + ((TransactionParameter) expr).getTransactionParam().getName()
					+ VARIABLE_SUFFIX;
		} else if (expr instanceof Property) {
			return ASSETPROPERTY_PREFIX + ((Property) expr).getPropertyName().getName() + VARIABLE_SUFFIX;
		} else if (expr instanceof NumberValue) {
			return "" + ((NumberValue) expr).getValue();
		} else if (expr instanceof BooleanValue) {
			return "" + ((BooleanValue) expr).getValue();
		} else if (expr instanceof Date) {
			return AbstractBlockchainGenerator.SDF_ISO.format(DslParser.parseToCalendar((Date) expr).getTime());
		} else if (expr instanceof OrExpr) {
			OrExpr orExpr = (OrExpr) expr;
			return "(" + parseExpression(semanticErrors, BlocklabPackage.Literals.OR_EXPR__LEFT, orExpr.getLeft())
					+ " || "
					+ parseExpression(semanticErrors, BlocklabPackage.Literals.OR_EXPR__RIGHT, orExpr.getRight()) + ")";
		} else if (expr instanceof AndExpr) {
			AndExpr andExpr = (AndExpr) expr;
			return "(" + parseExpression(semanticErrors, BlocklabPackage.Literals.AND_EXPR__LEFT, andExpr.getLeft())
					+ " && "
					+ parseExpression(semanticErrors, BlocklabPackage.Literals.AND_EXPR__RIGHT, andExpr.getRight())
					+ ")";
		} else if (expr instanceof NotExpr) {
			NotExpr notExpr = (NotExpr) expr;
			if (notExpr.getExpr() == null) {
				return parseExpression(semanticErrors, BlocklabPackage.Literals.NOT_EXPR__EXPR, notExpr);
			} else {
				return "!("
						+ parseExpression(semanticErrors, BlocklabPackage.Literals.NOT_EXPR__EXPR, notExpr.getExpr())
						+ ")";
			}
		} else if (expr instanceof CompareExpr) {
			CompareExpr compareExpr = (CompareExpr) expr;
			String operator = compareExpr.getOperator();
			if (COMPARE_EXPR_OPERATOR_EQUALS.equals(operator)) {
				operator = "===";
			} else if (COMPARE_EXPR_OPERATOR_NOTEQUALS.equals(operator)) {
				operator = "!==";
			}
			return "("
					+ parseExpression(semanticErrors, BlocklabPackage.Literals.COMPARE_EXPR__LEFT,
							compareExpr.getLeft())
					+ operator + parseExpression(semanticErrors, BlocklabPackage.Literals.COMPARE_EXPR__RIGHT,
							compareExpr.getRight())
					+ ")";
		} else if (expr instanceof MathExpr) {
			MathExpr mathExpr = (MathExpr) expr;
			return "(" + parseExpression(semanticErrors, BlocklabPackage.Literals.MATH_EXPR__LEFT, mathExpr.getLeft())
					+ mathExpr.getOperator()
					+ parseExpression(semanticErrors, BlocklabPackage.Literals.MATH_EXPR__RIGHT, mathExpr.getRight())
					+ ")";
		} else if (expr instanceof TransactionValueValue) {
			return PLACEHOLDER_TRANSACTIONVALUE;
		} else if (expr instanceof TransactionCallerValue) {
			return PLACEHOLDER_TRANSACTIONCALLER;
		} else if (expr instanceof CreatorValue) {
			return PLACEHOLDER_CREATOR;
		} else {
			throw new RuntimeException("Unexpected Expr: " + expr);
		}
	}

	private static String parseParticipantExpression(Map<EObject, SemanticError> semanticErrors, EReference ref,
			ParticipantExpression expr) {
		if (expr == null) {
			semanticErrors.put(expr,
					new SemanticError(ref, "Incomplete participant expression, plase specify a valid participant."));
			return "";
		}
		if (expr instanceof ParticipantRef) {
			return PARTICIPANT_PREFIX + ((ParticipantRef) expr).getParticipant().getName() + VARIABLE_SUFFIX;
		} else if (expr instanceof ParticipantRole) {
			return ROLE_PREFIX + ((ParticipantRole) expr).getRole() + VARIABLE_SUFFIX;
		} else if (expr instanceof CreatorValue) {
			return PLACEHOLDER_CREATOR;
		} else if (expr instanceof TransactionCallerValue) {
			return PLACEHOLDER_TRANSACTIONCALLER;
		} else if (expr instanceof ContractParameter) {
			return CONTRACTPARAM_PREFIX + ((ContractParameter) expr).getContractParam().getName() + VARIABLE_SUFFIX;
		} else if (expr instanceof Property) {
			return ASSETPROPERTY_PREFIX + ((Property) expr).getPropertyName().getName() + VARIABLE_SUFFIX;
		} else {
			throw new RuntimeException("Unexpected Participant Expr: " + expr);
		}
	}

	private static String parseAccess(Map<EObject, SemanticError> semanticErrors, EReference ref, Access access) {
		if (access == null) {
			semanticErrors.put(access, new SemanticError(ref, "Incomplete expression, plase specify a value."));
			return "";
		}
		if (access instanceof ParticipantRef) {
			return PARTICIPANT_PREFIX + ((ParticipantRef) access).getParticipant().getName() + VARIABLE_SUFFIX;
		} else if (access instanceof ParticipantRole) {
			return ROLE_PREFIX + ((ParticipantRole) access).getRole() + VARIABLE_SUFFIX;
		} else if (access instanceof CreatorValue) {
			return PLACEHOLDER_CREATOR;
		} else if (access instanceof AnyoneValue) {
			return "Anyone";
		} else if (access instanceof AnyoneRoleValue) {
			return "Anyone(" + ((AnyoneRoleValue) access).getRole() + ")";
		} else {
			throw new RuntimeException("Unexpected Access Expr: " + access);
		}
	}

}
