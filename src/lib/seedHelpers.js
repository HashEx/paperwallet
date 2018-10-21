import bip39 from "bip39";

import content from "../content";

import english from "./mnemonic/languages/english.json";
import mnemonic from "./mnemonic";

const { isInMnemonic, mnemonicAsObject } = mnemonic; 

export const WORDS_COUNT_ALLOWED = [12, 15, 18, 21, 24];

export const ENGLISH_ERROR_TEXT = content.languageErrorText;
export const LENGTH_ERROR_TEXT = content.lengthErrorText;
export const PAGE_ERROR_TEXT = content.wrongNumberOfWordsErrorText;
export const NOT_ENOUGH_WORDS_ERROR_TEXT = content.notEnoughWordsErrorText;
export const MISTAKES_ON_CARD_ERROR_TEXT = content.mistakesOnCardErrorText;


export const getEmptyArray = size => Array.from(Array(size));

export const checkSeed = seed => bip39.validateMnemonic(seed);
export const getRandomSeed = () => bip39.generateMnemonic(160);

const getWordsCount = seed => seed.split(/(\s+)/).filter(e => e.trim().length).length;

export const checkSeedLength = seed => {
	return (WORDS_COUNT_ALLOWED.indexOf(getWordsCount(seed)) > -1);
}

export const englishValid = seed => {
	const all = seed.split(/(\s+)/).filter(e => e.trim().length);
	return all.every(isInMnemonic);
}

export const canValidate = seedArray => {
	const notEmptyCards = seedArray.filter(item => item);
	return notEmptyCards.length === seedArray.length - 1;
};

export const checkSeedForErrors = (seedArray, wordCount, wordsOnColumn) => {
	const seed = seedArray.join(" ");
	const seedLength = getWordsCount(seed);
	if(!seedLength) return null;
	let error = null;
	seedArray.forEach((item, index) => {
		if (!englishValid(item) && !error) {
			error = ENGLISH_ERROR_TEXT;
		} else if (item && getWordsCount(item) !== wordsOnColumn[index] && !error) {
			error = PAGE_ERROR_TEXT;
		}
	});
	return error;
}

export const encodeWord = words => {
	let temp = 0;
	for (let i = 0; i < words.length; i++) {
		const word = mnemonicAsObject[words[i].toLowerCase()];
		temp ^= word ? word.index : -1;
	}
	return english[temp];
};

export const encodeWords = (seed, pages) => {
	const offset = pages - 1;
	const maxEncodedWords = Math.ceil(seed.length / offset);
	let encodedWords = [];

	for (let i = 0; i < maxEncodedWords; i++) {
		let sourceWords = [];
		if (i !== maxEncodedWords - 1) {
			sourceWords = seed.slice(offset * i, offset * (i + 1));
		} else {
			sourceWords = seed.slice(offset * i, seed.length);
		}
		encodedWords.push(encodeWord(sourceWords));
	}

	return encodedWords;
};

export const splitSeed = (seed, pages) => {
	const seedArray = seed.trim().split(" ");
	let encodedWords = encodeWords(seedArray, pages),
		splitArray = getEmptyArray(pages).map(() => []),
		wordCount = 0,
		offset = pages - 1,
		maxWordsInColumn = 24 / offset;

	if (24 % offset !== 0) {
		maxWordsInColumn++;
	}

	for (let word = 0; word < maxWordsInColumn; word++) {
		for (let card = 0; card < pages; card++) {
			if (card === offset) {
				splitArray[card] = encodedWords;
			} else if (wordCount < seedArray.length) {
				splitArray[card][word] = seedArray[wordCount];
				wordCount++;
			}
		}
	}

	return splitArray;
};

export const getSeedEmptyArray = pages => getEmptyArray(pages).map(() => '');

export const getSeedElemAsArray = seed => {
	return seed.map((item, i) => {
		if (item.length > 0) {
			return seed[i].split(" ");
		} else {
			return [];
		}
	});
}

export const calculateWordsPerCard = (wordCount, pages) => {
	let word = 0;
	let wordsOnColumn = [];
	let maxWord = Math.ceil(wordCount / (pages - 1));
	
	for (let i = 1; i <= maxWord; i++) {
		for (let card = 0; card < pages - 1; card++) {
			if (word < wordCount) {
				wordsOnColumn[card] = i;
				word++
			}
		}
	}
	wordsOnColumn[pages - 1] = maxWord;

	return wordsOnColumn;
}

export const getWordsOnEncode = (seed, wordsCount) => {
	const pages = seed.length;
	const offset = pages - 1;
	const encodedWords = getEmptyArray(Math.ceil(wordsCount / offset));

	for (var i = 0; i < encodedWords.length - 1; i++) {
		encodedWords[i] = pages;
	}

	if (wordsCount % offset === 0) {
		encodedWords[encodedWords.length - 1] = pages;
	} else {
		encodedWords[encodedWords.length - 1] = 1 + (wordsCount % offset);
	}

	return encodedWords;
}


export const restoreSeed = (seedArray, wordsCount) => {
	//const seedArray = getSeedElemAsArray(seed);
	const encodedWords = getWordsOnEncode(seedArray, wordsCount);
	
	let newSeed = [];
	let lastPage = [];

	for (let i = 0; i < encodedWords.length; i++) {
		for (let j = 0; j < seedArray.length; j++) {

			if(j === seedArray.length - 1) {
				lastPage.push(seedArray[j][i])
			} else {
				newSeed.push(seedArray[j][i]);
			}
		}
	}
	
	return newSeed.join(" ").toLowerCase().trim();
}

export const canRestoreSeed = (seedArray, wordCount, wordsOnColumn) => {
	if(!seedArray) return seedArray;
	const emptyCards = seedArray.filter((item, index) => {
		if(!item) return false;
		return item.length !== wordsOnColumn[index];
	});
	if(!emptyCards.length) return true;
	return !(emptyCards.length - 1);
}


export const getEmptyColumn = (seed, wordCount, wordsOnColumn) => {
	let currentPosition = 0;
	const checkThatAvailable = (arrWords, j, len) => {
		let count = len;
		for (let i = 0; i < arrWords.length; i++) {
			if (arrWords[i][j] === '') {
				count--;
				currentPosition = i;
			}
		}
		return count;
	}
	const checkArr = (seedArray, arr) => {
		let mistakes = 0;

		for(let card = 0; card < seedArray.length; card++) {
			if(seedArray[card].length !== arr[card].length) {
				mistakes++;
			}
		}

		return mistakes <= 1;
	}
	const seedArray = getSeedElemAsArray(seed).map(words => words.filter(word => word !== ""));;
	let arr = seed.map((item, index) => {
		const wordsCount = wordsOnColumn[index];
		const card = seedArray[index];
		let words = [];
		for(let i = 0; i < wordsCount; i++) {
			let word = card[i] ? card[i].toLowerCase() : "";
			words[i] = isInMnemonic(word) ? word : "";
		}
		return words;
	});

	let lengths = getWordsOnEncode(seed, wordCount);
	
	for (let i = 0; i < lengths.length; i++) {
		if (checkThatAvailable(arr, i, lengths[i]) === (lengths[i] - 1)) {
			
			let temp_array = [];
			for (let j = 0; j < arr.length; j++) {
				if (j !== currentPosition && arr[j][i] !== undefined) {
					temp_array.push(arr[j][i]);
				}
			}
			let encoded = encodeWord(temp_array);
			if (encoded !== undefined) {
				arr[currentPosition][i] = encoded;
			}
		}
	}
	if (!checkArr(seedArray, arr)) return false;

	return arr;
}