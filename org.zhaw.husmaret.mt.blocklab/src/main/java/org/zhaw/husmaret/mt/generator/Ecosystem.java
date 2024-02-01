package org.zhaw.husmaret.mt.generator;

import org.zhaw.husmaret.mt.validation.BlockLabValidator;

public enum Ecosystem {
	
	Ethereum("ETH", BlockLabValidator.ADDRESS_REGEX_ETHEREUM, ".sol"),
	Solana("SOL", null, ".rs"),
	Cardano("ADA", BlockLabValidator.ADDRESS_REGEX_CARDANO, ".hs");
	
	private final String defaultCurrency;
	private final String addressValidationRegex;
	private final String contractFileEnding;
	
	private Ecosystem(String defaultCurrency, String addressValidationRegex, String contractFileEnding){
		this.defaultCurrency = defaultCurrency;
		this.addressValidationRegex = addressValidationRegex;
		this.contractFileEnding = contractFileEnding;
	}
	
	public String getDefaultCurrency() {
		return defaultCurrency;
	}
	
	public String getAddressValidationRegex() {
		return addressValidationRegex;
	}

	public String getContractFileEnding() {
		return contractFileEnding;
	}
};

