package org.zhaw.husmaret.mt.generator;

public enum BlockLabVersion {
	
	V1_0("1.0");
	
	private final String blocklabVersion;
	
	private BlockLabVersion(String blocklabVersion){
		this.blocklabVersion = blocklabVersion;
	}

	public String getBlockLabVersion() {
		return blocklabVersion;
	}
	
	public static BlockLabVersion parseBlockLabVersion(String blocklabVersion){
		for(BlockLabVersion v : values()){
			if(v.getBlockLabVersion().equals(blocklabVersion)){
				return v;
			}
		}
		throw new RuntimeException("Could not find a valid BlockLabVersion for [" + blocklabVersion +"]");
	}

};

