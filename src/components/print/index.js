import React from "react";
import { Helmet } from "react-helmet";

import toCapitalizeCase from "../../lib/toCapitalizeCase";
import { calculateWordsPerCard, restoreSeed } from "../../lib/seedHelpers";
import content from "../../content";

import "./print.css";

const { homepage } = require("../../../package.json");

const getPageWordName = pageIndex => (item, wordIndex) => {
	return `page${pageIndex + 1}_word#${wordIndex + 1}`;
};

const getPageWords = (pageWordCount, index) => {
	return Array.from(Array(pageWordCount)).map(getPageWordName(index)).join(" ");
}

const getPlaceholder = (cardsCount, wordsCount) => {
	const pagesWordsCount = calculateWordsPerCard(wordsCount, cardsCount);
	return pagesWordsCount.map(getPageWords);
};

const SheetWordsColumn = ({words, offset}) => (
	<div className="sheet__words-column">
		{words.map((word, index) => (
			<div key={index} className="sheet__word">
				<span className="sheet__word-number">
					{index + offset}
				</span>
				{" "}
				{word}
			</div>
		))}
	</div>
);

const SheetHeader = ({pageIndex}) => (
	<div className="sheet__header">
		<div className="sheet__header-title">
			{content.title}
		</div>
		<div className="sheet__header-page">
			{content.page} #{pageIndex + 1}
		</div>
	</div>
);

const SheetWords = ({words}) => (
	<div className="sheet__words">
		<SheetWordsColumn words={words.slice(0, 6)} offset={1} />
		<SheetWordsColumn words={words.slice(6)} offset={7} />
	</div>
);

class SheetManual extends React.Component {
	renderManualCards = (activeCard, text) => {
		const activeCards = sessionStorage.getItem("cards_count");
		const wordsCount = sessionStorage.getItem("words_count");
		const cards = [];
		const seedPagesPlaceholder = getPlaceholder(activeCards, wordsCount);
		seedPagesPlaceholder[activeCard] = text;
		for (let i = 0; i < activeCards; i++) {
			const cardNum = i + 1;
			const placeholder = seedPagesPlaceholder[i];
			cards.push(
				<div className="print-card" key={i}>
					<div className="print-card__inner">
						<div className="print-card__number">{toCapitalizeCase(content.page)} {cardNum}</div>
						<div className="print-card__text">
							{placeholder.split(" ").map(item => {
								const word = item.split("#");
								if (word.length > 1) {
									return (
										<div class="print-card__word">
											{word[0]}
											<span>#</span>
											{word[1]}
										</div>
									);
								} else {
									return (
										<div class="print-card__word">
											{word[0]}
										</div>
									);
								}
							})}
						</div>
					</div>
				</div>
			);
		}
		const seedPlaceholder = restoreSeed(seedPagesPlaceholder.map(text => text.split(" ")), wordsCount);
		const pageWords = text.trim().split(" ");
		const seed = seedPlaceholder.trim().split(" ");
		return (
			<div className="manual__cards">
				<div className="manual__cards-title">{content.doItManually}:</div>
				<div className="print-cards">{cards}</div>
				<hr className="print-splitter" />
				<p className="print-seed">
					<strong>{content.yourSeed}:</strong>
					{" "}
					{seed.map(item => {
						if (pageWords.indexOf(item) > -1) {
							return <strong>{item}{" "}</strong>;
						}
						return <span>{item}{" "}</span>;
					})}
				</p>
			</div>
		);
	};
	render(){
		const { cards, pageIndex, card } = this.props;
		const isLastCard = cards.length - 1 === pageIndex;
		return (
			<div className="sheet__manual">
				<div className="manual">
					<div className="manual__text">
						<p>
							<strong>
								{content.toRecoverYourSeedPhrase}:
							</strong>
						</p>
						<p>
							{content.goTo}{" "}
							<a href={`${homepage}recover`}>
								<strong>{`${homepage}recover`}</strong>
							</a>
						</p>
					</div>
					{!isLastCard && this.renderManualCards(pageIndex, card.trim())}
				</div>
			</div>
		)
	}
}

class Print extends React.Component {
	componentDidMount() {
		document.getElementsByTagName("body")[0].classList.add("A4");
		if (typeof window !== "undefined") {
			window.print();
		}
	}
	componentWillUnmount() {
		document.getElementsByTagName("body")[0].classList.remove("A4");
	}
	render() {
		if (typeof sessionStorage === "undefined") return null;
		const cards = sessionStorage.getItem("words").split(",");
		return (
			<div className="print-container">
				<Helmet>
					<meta name="robots" content="noindex,nofollow" />
				</Helmet>
				{cards.map((card, index) => {
					const cardWords = card.trim().split(" ");
					return (
						<section className="sheet padding-4mm" key={index}>
							<SheetHeader pageIndex={index} />
							<SheetWords words={cardWords} />
							<SheetManual pageIndex={index} cards={cards} card={card} />
						</section>
					);
				})}
			</div>
		);
	}
}

export default Print;
