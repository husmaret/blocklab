package org.zhaw.husmaret.mt.generator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.Param;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.Participant;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.Property;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.Timeout;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.Transaction;

public class ParsedObjects {
	
	private Map<String, Participant> participants = new HashMap<>();
	private Map<EObject, SemanticError> semanticErrors = new HashMap<>();
	private Boolean useAccountBalances = Boolean.FALSE;
	private Boolean useCreatorRole = Boolean.FALSE;
	private Boolean useContractStart = Boolean.FALSE;
	private List<Property> properties = new ArrayList<>();
	private List<Param> contractParams = new ArrayList<>();
	private List<Timeout> timeouts = new ArrayList<>();
	private List<Transaction> transactions = new ArrayList<>();
	private List<String> roles = new ArrayList<>();
	
	public ParsedObjects(Map<String, Participant> participants, Map<EObject, SemanticError> semanticErrors, Boolean useAccountBalances, Boolean useCreatorRole, Boolean useContractStart, List<Property> properties, List<Param> contractParams, List<Timeout> timeouts, List<Transaction> transactions, List<String> roles) {
		this.participants = participants;
		this.semanticErrors = semanticErrors;
		this.useAccountBalances = useAccountBalances;
		this.useCreatorRole = useCreatorRole;
		this.useContractStart = useContractStart;
		this.properties = properties;
		this.contractParams = contractParams;
		this.timeouts = timeouts;
		this.transactions = transactions;
		this.roles = roles;
	}
	
	public Map<String, Participant> getParticipants() {
		return participants;
	}
	
	public Map<EObject, SemanticError> getSemanticErrors() {
		return semanticErrors;
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

	public List<Param> getContractParams() {
		return contractParams;
	}

	public List<Timeout> getTimeouts() {
		return timeouts;
	}

	public List<Transaction> getTransactions() {
		return transactions;
	}

	public List<String> getRoles() {
		return roles;
	}
	
	public boolean hasSemanticErrors() {
		return !semanticErrors.isEmpty();
	}
	
	public static class SemanticError {
		
		private EStructuralFeature attribute;
		private String message;
		
		public SemanticError(EStructuralFeature attribute, String message) {
			this.attribute = attribute;
			this.message = message;
		}
		
		public EStructuralFeature getAttribute() {
			return attribute;
		}
		
		public String getMessage() {
			return message;
		}
		
	}
}