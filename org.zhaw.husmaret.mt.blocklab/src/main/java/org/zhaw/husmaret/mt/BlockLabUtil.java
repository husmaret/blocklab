package org.zhaw.husmaret.mt;

public class BlockLabUtil {
    
    public enum DataType {
		TEXT,
		NUMBER,
		DATE,
		PARTICIPANT,
		BOOLEAN
	}
    
    public static DataType parseDataType(String type){
		if (type.equalsIgnoreCase("text")) {
			return DataType.TEXT;
		} else if (type.equalsIgnoreCase("number")) {
			return DataType.NUMBER;
		} else if (type.equalsIgnoreCase("date")) {
			return DataType.DATE;
		} else if (type.equalsIgnoreCase("participant")) {
			return DataType.PARTICIPANT;
		} else if (type.equalsIgnoreCase("boolean")) {
			return DataType.BOOLEAN;
		}
		throw new IllegalArgumentException("Unknown data type ["+type+"]");
	}
}
