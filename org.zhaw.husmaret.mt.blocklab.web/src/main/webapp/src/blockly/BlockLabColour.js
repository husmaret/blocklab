const COLOUR_STEP = -30;
const COLOUR_START = 270;
// const COLOUR_STEP = 35;
// const COLOUR_START = 0;	

const CATEGORY_CONTRACTS = 0;
const CATEGORY_WHENANDFINISHED = 0.25;
const CATEGORY_PARTICIPANTS = 1.5;
const CATEGORY_ASSET = 2;
const CATEGORY_TRANSACTIONS = 3.25;
const CATEGORY_ACCESS = 5.5;
const CATEGORY_CONDITIONS = 6;
const CATEGORY_STATEMENTS = 6.5;
const CATEGORY_EXPRESSIONS = 7;
const CATEGORY_CERTIFICATES = 7.5;
const CATEGORY_VALUES = 8;
const CATEGORY_CONTRACTPARAMETERS = 8.9;

const calculateColour = (category) => {
	return Number(COLOUR_START) + (Number(COLOUR_STEP) * Number(category))
}

export const blockColour = {
	colourCategoryContracts: calculateColour(CATEGORY_CONTRACTS),
	colourCategoryWhenAndFinished: calculateColour(CATEGORY_WHENANDFINISHED),
	colourCategoryParticipants: calculateColour(CATEGORY_PARTICIPANTS),
	colourCategoryAsset: calculateColour(CATEGORY_ASSET),
	colourCategoryTransactions: calculateColour(CATEGORY_TRANSACTIONS),
	colourCategoryAccess: calculateColour(CATEGORY_ACCESS),
	colourCategoryConditions: calculateColour(CATEGORY_CONDITIONS),
	colourCategoryStatements: calculateColour(CATEGORY_STATEMENTS),
	colourCategoryExpressions: calculateColour(CATEGORY_EXPRESSIONS),
	colourCategoryCertificates: calculateColour(CATEGORY_CERTIFICATES),
	colourCategoryValues: calculateColour(CATEGORY_VALUES),
	colourCategoryContractParameters: calculateColour(CATEGORY_CONTRACTPARAMETERS),
}

		