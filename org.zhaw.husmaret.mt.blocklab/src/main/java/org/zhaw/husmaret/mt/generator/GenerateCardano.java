package org.zhaw.husmaret.mt.generator;

import org.eclipse.xtext.generator.IFileSystemAccess2;
import org.zhaw.husmaret.mt.BlockLabUtil;
import org.zhaw.husmaret.mt.blocklab.Contract;

public class GenerateCardano extends AbstractBlockchainGenerator {
	
	public GenerateCardano(BlockLabVersion blocklabVersion, Contract contract, ParsedObjects parsedObjects, IFileSystemAccess2 fsa) {
		super(blocklabVersion, contract, parsedObjects, fsa);
	}

	protected void generateSmartContractCode() {
		addLineToCode(0, "Cardano");
	}

	@Override
	protected String getVariableType(String paramType) {
		switch (BlockLabUtil.parseDataType(paramType)) {
			case DATE:
				return "???";
			case NUMBER:
				return "???";
			case TEXT:
				return "???";	
			case PARTICIPANT:
				return "???";
			case BOOLEAN:
				return "???";
			default:
				throw new RuntimeException("Param type ["+paramType+"] is not supported.");
		}
	}
}
