package org.zhaw.husmaret.mt.generator;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.eclipse.xtext.generator.IFileSystemAccess2;
import org.zhaw.husmaret.mt.blocklab.Contract;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.GeneratedFile;

public abstract class AbstractBlockchainGenerator {
	
	public final static SimpleDateFormat SDF_ISO = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX"); 

	protected BlockLabVersion blocklabVersion;
	protected Contract contract;
	protected ParsedObjects parsedObjects;
	protected IFileSystemAccess2 fsa;

	protected StringBuilder code = new StringBuilder();
	protected List<GeneratedFile> generatedFiles = new ArrayList<>();
	
	public AbstractBlockchainGenerator(BlockLabVersion blocklabVersion, Contract contract, ParsedObjects parsedObjects, IFileSystemAccess2 fsa) {
		this.blocklabVersion = blocklabVersion;
		this.contract = contract;
		this.parsedObjects = parsedObjects;
		this.fsa = fsa;
	}
	
	protected abstract void generateSmartContractCode();
	protected abstract String getVariableType(String paramType);
	
	protected void addCommentLine(int indent, String comment) {
		for (int i = 0; i < indent; i++) {
			code.append("\t");
		}
		code.append("/*" + comment + "*/\n");
	}
	
	protected void addLineToCode(int indent, String line) {
		for (int i = 0; i < indent; i++) {
			code.append("\t");
		}
		code.append(line+"\n");
	}
	
	protected void addEmpthyLineToCode() {
		code.append("\n");
	}

	protected void addFile(String folder, String filename, String content) {
		generatedFiles.add(new GeneratedFile(folder, filename + getEcosystem().getContractFileEnding(), content));
	}

	protected void addFromResources(String folder, String resourceName) {
		addFromResources(null, folder, resourceName);
	}
	protected void addFromResources(Set<String> imports, String folder, String resourceName) {
		if (imports != null) {
			imports.add("/" + folder + "/" + resourceName);
		}
		generatedFiles.add(new GeneratedFile(folder, resourceName, getResource(folder + "/" + resourceName)));
	}

	protected List<GeneratedFile> getGeneratedFiles() {
		generatedFiles.add(0, new GeneratedFile("", "Contract" + getEcosystem().getContractFileEnding() , getCode()));
		return generatedFiles;
	}
	
	private String getResource(String resourceName)  {
		String basePathEcosystem = contract.getEcosystem().toString().toLowerCase() + "/";
		URL url = getClass().getClassLoader().getResource(basePathEcosystem + resourceName);
		StringBuilder textBuilder = new StringBuilder();
		try (
			InputStream inputStream = url.openStream();
			Reader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))
		) {
			int c = 0;
			while ((c = reader.read()) != -1) {
				textBuilder.append((char) c);
			}
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		return textBuilder.toString();
	}

	protected void addLinesToCode(StringBuilder lines) {
		code.append(lines);
	}

	protected String getCode(){
		return code.toString();
	}

	protected Ecosystem getEcosystem() {
		return Ecosystem.valueOf(contract.getEcosystem());
	}

}
