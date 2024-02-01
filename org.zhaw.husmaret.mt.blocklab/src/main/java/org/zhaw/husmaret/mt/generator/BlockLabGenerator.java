package org.zhaw.husmaret.mt.generator;

import java.util.List;

import org.eclipse.emf.common.util.TreeIterator;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.xtext.generator.IFileSystemAccess2;
import org.eclipse.xtext.generator.IGenerator2;
import org.eclipse.xtext.generator.IGeneratorContext;
import org.zhaw.husmaret.mt.blocklab.Contract;
import org.zhaw.husmaret.mt.generator.JsonEncodeResult.GeneratedFile;

import com.google.gson.Gson;

public class BlockLabGenerator implements IGenerator2 {

    public static final BlockLabVersion LATEST_DSL_VERSION = BlockLabVersion.V1_0;

    @Override
    public void doGenerate(Resource input, IFileSystemAccess2 fsa, IGeneratorContext context) {

        TreeIterator<EObject> contents = input.getAllContents();
        Contract contract = null;
        while (contents.hasNext()) {
            EObject content = contents.next();
            if (content instanceof Contract) {
                contract = (Contract) content;
                break;
            }
        }
        ParsedObjects parsedObjects = DslParser.parseContractObjects(contract);

        if (contract != null) {
            BlockLabVersion blocklabVersion;
            if (contract.getVersion() == null) {
                // if no version is provided, use the latest version by default
                blocklabVersion = LATEST_DSL_VERSION;
            } else {
                blocklabVersion = BlockLabVersion.parseBlockLabVersion(contract.getVersion());
            }
            Ecosystem ecosystem = Ecosystem.valueOf(contract.getEcosystem());
            AbstractBlockchainGenerator blockchainGenerator;
            switch (ecosystem) {
                case Ethereum: {
                    blockchainGenerator = new GenerateEthereum(blocklabVersion, contract, parsedObjects, fsa);
                    break;
                }
                case Solana: {
                    blockchainGenerator = new GenerateSolana(blocklabVersion, contract, parsedObjects, fsa);
                    break;
                }
                case Cardano: {
                    blockchainGenerator = new GenerateCardano(blocklabVersion, contract, parsedObjects, fsa);
                    break;
                }
                default: {
                    throw new RuntimeException("Ecosystem [" + ecosystem + "] is not supported!!!");
                }
            }
            
            // generate everything here
            blockchainGenerator.generateSmartContractCode();

            List<GeneratedFile> generatedFiles = blockchainGenerator.getGeneratedFiles();
            JsonEncodeResult generatorResult = new JsonEncodeResult(blocklabVersion, ecosystem, generatedFiles);
            generatorResult.setProperties(parsedObjects.getProperties());
            generatorResult.setUseAccountBalances(parsedObjects.getUseAccountBalances());
            generatorResult.setUseCreatorRole(parsedObjects.getUseCreatorRole());
            generatorResult.setContractParams(parsedObjects.getContractParams());
            generatorResult.setTimeouts(parsedObjects.getTimeouts());
            generatorResult.setTransactions(parsedObjects.getTransactions());
            generatorResult.setRoles(parsedObjects.getRoles());
            generatorResult.setParticipants(parsedObjects.getParticipants().values());
            String generatorResultJSON = new Gson().toJson(generatorResult);
            fsa.generateFile("/DEFAULT_ARTIFACT", generatorResultJSON);
        }
    }

    @Override
    public void beforeGenerate(Resource input, IFileSystemAccess2 fsa, IGeneratorContext context) {

    }

    @Override
    public void afterGenerate(Resource input, IFileSystemAccess2 fsa, IGeneratorContext context) {

    }

}
