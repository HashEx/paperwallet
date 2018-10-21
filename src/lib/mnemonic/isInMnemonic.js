import mnemonic from "./languages/english.json";

export const mnemonicAsObject = mnemonic.reduce((acc, item, index) => {
	acc[item] = {
		word: item,
		index
	};
	return acc;
}, {});

export default word => mnemonicAsObject[word] !== undefined;