import {
	ENGLISH_ERROR_TEXT,
	PAGE_ERROR_TEXT,
	WORDS_COUNT_ALLOWED,
	getEmptyArray,
	checkSeed,
	getRandomSeed,
	encodeWord,
	checkSeedLength,
	englishValid,
	canValidate,
	checkSeedForErrors,
	encodeWords,
	splitSeed,
	getSeedEmptyArray,
	getSeedElemAsArray,
	calculateWordsPerCard,
	getWordsOnEncode,
	restoreSeed,
	canRestoreSeed,
	checkRestoreSeedIsValid,
	checkArr,
	getEmptyColumn
} from "./seedHelpers";
	

describe("Seed helpers", () => {
	describe("getEmptyArray", () => {
		it("should return empty array with provided size", () => {
			let size = 5;
			let testArray = getEmptyArray(size);
			expect(testArray.length).toEqual(size);

			size = 10;
			testArray = getEmptyArray(size);
			expect(testArray.length).toEqual(size);
		});
	});
	describe("checkSeed", () => {
		it("should return true if seed is correct", () => {
			expect(checkSeed(getRandomSeed())).toBeTruthy();
		});
		it("should return false if sedd is not correct", () => {
			expect(checkSeed("text text text text text")).toBeFalsy();
		});
	});
	describe("getRandomSeed", () => {
		it("should generate correct seed", () => {
			let seed = getRandomSeed();
			expect(checkSeed(seed)).toBeTruthy();
			seed = getRandomSeed();
			expect(checkSeed(seed)).toBeTruthy();
		});
	});
	describe("encodeWord", () => {
		it("should return correct encoded word", () => {
			expect(encodeWord(["actor", "barrel", "camera"])).toEqual("cotton");
			expect(encodeWord(["arrow", "digital", "final"])).toEqual("guitar");
		});
	});
	describe("checkSeedLength", () => {
		const getTestSeed = (wordsCount) => getEmptyArray(wordsCount).map(() => "test").join(" ");
		WORDS_COUNT_ALLOWED.forEach((wordsCount) => {
			it("should return true if seed words length equal " + wordsCount, () => {
				const testSeed = getTestSeed(wordsCount);
				expect(checkSeedLength(testSeed)).toBeTruthy();
			})
		});
		WORDS_COUNT_ALLOWED.forEach((wordsCount) => {
			let testSeed = "";
			it("should return false if seed words length is not allowed", () => {
				testSeed = getTestSeed(wordsCount + 1);
				expect(checkSeedLength(testSeed)).toBeFalsy();
				testSeed = getTestSeed(wordsCount - 1);
				expect(checkSeedLength(testSeed)).toBeFalsy();
			})
		});
	});
	describe("englishValid", () => {
		it("should return true if word from english mnemonic", () => {
			["actor", "barrel", "camera", "arrow", "digital", "final"].forEach((word) => {
				expect(englishValid(word)).toBeTruthy();	
			});
		});
		it("should return false if word is not from english mnemonic", () => {
			["let", "barter", "value", "sparrow"].forEach((word) => {
				expect(englishValid(word)).toBeFalsy();	
			});
		});
	});
	describe("canValidate", () => {
		it("should return true if empty cards is lower or equal 1", () => {
			expect(canValidate(["actor arrow", "barell digital", ""])).toBeTruthy();
		});
		it("should return false if empty cards is bigger 1", () => {
			expect(canValidate(["actor arrow", "", ""])).toBeFalsy();
		});
	});
	describe("checkSeedForErrors", () => {
		it("should return null if no words in seed", () => {
			expect(checkSeedForErrors(["","",""], 15, calculateWordsPerCard(15, 3))).toBeNull();
		});
		it("should return null if seed is correct", () => {
			const seed = [
				"slow embrace remain such illness small hat category",
				"dove pass open convince lady yellow east",
				"mistake trial concert wave asset cricket club category"
			];
			expect(checkSeedForErrors(seed, 15, calculateWordsPerCard(15, 3))).toBeNull();
		});
		it("should return english validation error if one word is not from mnemonic", () => {
			const seed = [
				"slow embrace remain value illness small hat category",
				"dove pass open convince lady yellow east",
				"mistake trial concert wave asset cricket club category"
			];
			expect(checkSeedForErrors(seed, 15, calculateWordsPerCard(15, 3))).toEqual(ENGLISH_ERROR_TEXT);
		});
		it("should return words validation error if wrong count of words provided", () => {
			const seed = [
				"slow embrace remain such illness small",
				"dove pass open convince lady yellow east",
				"mistake trial concert wave asset cricket club category"
			];
			expect(checkSeedForErrors(seed, 15, calculateWordsPerCard(15, 3))).toEqual(PAGE_ERROR_TEXT);
		});
	});
	describe("encodeWords", () => {
		it("should generate encoded words", () => {
			const seed = "emerge congress fossil whisper pave cluster stumble element visual enforce hollow room pull shine coast".split(" ");
			const expectedEncodingWords = [
				'guilt',
				'pause',
				'mistake',
				'mosquito',
				'salute',
				'strike',
				'hamster',
				'coast'
			];
			expect(encodeWords(seed, 3)).toEqual(expectedEncodingWords);
		});
	});
	describe("splitSeed", () => {
		it("should split seed to pages", () => {
			const seed = "emerge congress fossil whisper pave cluster stumble element visual enforce hollow room pull shine coast";
			const expectedSplittedSeed = [
				["emerge", "fossil", "pave", "stumble", "visual", "hollow", "pull", "coast"],
				["congress", "whisper", "cluster", "element", "enforce", "room", "shine"],
				["guilt", "pause", "mistake", "mosquito", "salute", "strike", "hamster", "coast"]
			];
			expect(splitSeed(seed, 3)).toEqual(expectedSplittedSeed);
		});
	});
	describe("getSeedEmptyArray", () => {
		it("should return array with provided size with empty strings", () => {
			const seedArray = getSeedEmptyArray(5);
			expect(seedArray.length).toEqual(5);
			expect(seedArray.every(item => item === "")).toBeTruthy();
		});
	});
	describe("getSeedElemAsArray", () => {
		it("should return array of words for each card", () => {
			const seed = ["slow embrace remain such illness small", "", ""];
			const expectedSeed = [
				["slow", "embrace", "remain", "such", "illness", "small"],
				[],
				[]
			];
			expect(getSeedElemAsArray(seed)).toEqual(expectedSeed);
		});
	});
	describe("calculateWordsPerCard", () => {
		const wordsPerCard = {
			12: {
				3: [6,6,6],
				4: [4,4,4,4],
				5: [3,3,3,3,3],
				6: [3,3,2,2,2,3],
				7: [2,2,2,2,2,2,2],
				8: [2,2,2,2,2,1,1,2]
			},
			15: {
				3: [8,7,8],
				4: [5,5,5,5],
				5: [4,4,4,3,4],
				6: [3,3,3,3,3,3],
				7: [3,3,3,2,2,2,3],
				8: [3,2,2,2,2,2,2,3]
			},
			18: {
				3: [9,9,9],
				4: [6,6,6,6],
				5: [5,5,4,4,5],
				6: [4,4,4,3,3,4],
				7: [3,3,3,3,3,3,3],
				8: [3,3,3,3,2,2,2,3]
			},
			21: {
				3: [11,10,11],
				4: [7,7,7,7],
				5: [6,5,5,5,6],
				6: [5,4,4,4,4,5],
				7: [4,4,4,3,3,3,4],
				8: [3,3,3,3,3,3,3,3]
			},
			24: {
				3: [12,12,12],
				4: [8,8,8,8],
				5: [6,6,6,6,6],
				6: [5,5,5,5,4,5],
				7: [4,4,4,4,4,4,4],
				8: [4,4,4,3,3,3,3,4]
			}
		}
		Object.keys(wordsPerCard).forEach(wordsCount => {
			Object.keys(wordsPerCard[wordsCount]).map(pagesCount => {
				it("should count words per card for " + wordsCount + " words and " + pagesCount + " pages", () => {
					expect(calculateWordsPerCard(wordsCount, pagesCount)).toEqual(wordsPerCard[wordsCount][pagesCount]);
				});
			});
		});
	});
	describe("getWordsOnEncode", () => {
		it("", () => {
			const seed = [
				"slow embrace remain such illness small hat category",
				"dove pass open convince lady yellow east",
				"mistake trial concert wave asset cricket club category"
			];
			expect(getWordsOnEncode(seed, 12)).toEqual([3, 3, 3, 3, 3, 3]);
			expect(getWordsOnEncode(seed, 15)).toEqual([3, 3, 3, 3, 3, 3, 3, 2]);
			expect(getWordsOnEncode(seed, 18)).toEqual([3, 3, 3, 3, 3, 3, 3, 3, 3]);
			expect(getWordsOnEncode(seed, 21)).toEqual([3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2]);
			expect(getWordsOnEncode(seed, 24)).toEqual([3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
		});
	});
	describe("restoreSeed", () => {
		const seed = [
			["slim", "tomorrow", "action", "desert", "spoon", "logic", "differ", "arctic"],
			["enlist", "cat", "ignore", "banana", "attack", "abandon", "length"],
			["library", "side", "inch", "civil", "table", "logic", "saddle", "arctic"]
		];
		const expectedRestore = "slim enlist tomorrow cat action ignore desert banana spoon attack logic abandon differ length arctic";
		it("should restore seed correct", () => {
			expect(restoreSeed(seed, 15)).toEqual(expectedRestore);
		});
	});
	describe("canRestoreSeed", () => {
		it("should return true if can restore", () => {
			expect(
				canRestoreSeed(
					[
						[
							"slim",
							"tomorrow",
							"action",
							"desert",
							"spoon",
							"logic",
							"differ",
							"arctic"
						],[
							"enlist",
							"cat",
							"ignore",
							"banana",
							"attack",
							"abandon",
							"length"
						],[]
					], 15, [8,7,8]
				)
			).toBeTruthy();
			expect(
				canRestoreSeed(
					[
						[
							"slim",
							"tomorrow",
							"action",
							"desert",
							"spoon",
							"logic",
							"differ",
							"arctic"
						],
						[],
						[
							"mistake",
							"trial",
							"concert",
							"wave",
							"asset",
							"cricket",
							"club",
							"category"
						]
					], 15, [8,7,8]
				)
			).toBeTruthy();
			expect(
				canRestoreSeed(
					[
						[
							"slim",
							"tomorrow",
							"action",
							"desert",
							"spoon",
							"logic",
							"differ",
							"arctic"
						],
						[
							"enlist",
							"cat",
							"ignore",
							"banana",
							"attack",
							"abandon",
							"length"
						],
						[
							"mistake",
							"trial",
							"concert",
							"wave",
							"asset",
							"cricket",
							"club",
							"category"
						]
					], 15, [8,7,8]
				)
			).toBeTruthy();
		});
		it("should return false if can't restore", () => {
			expect(canRestoreSeed([["slow", "embrace"],[],[]], 15, [8,7,8])).toBeFalsy();
		});
	});
	describe("getEmptyColumn", () => {
		it("should fill last card", () => {
			const seed = [
				"slim tomorrow action desert spoon logic differ arctic",
				"",
				"mistake trial concert wave asset cricket club category"
			];
			const restore = [
				["slim", "tomorrow", "action", "desert", "spoon", "logic", "differ", "arctic"],
				["economy", "army", "club", "slush", "tennis", "rail", "ball"],
				["mistake", "trial", "concert", "wave", "asset", "cricket", "club", "category"]
			];
			expect(getEmptyColumn(seed, 15, [8,7,8])).toEqual(restore);
		});
	});
});