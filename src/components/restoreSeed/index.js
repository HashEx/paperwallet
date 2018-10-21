import React, { Component } from "react";

import classNames from "../../lib/classNames";
import lazyScroll from "../../lib/lazyScroll";

import {
  englishValid,
  checkSeedForErrors,
  canValidate,
  canRestoreSeed,
  restoreSeed,
  getEmptyColumn,
  getSeedElemAsArray,
  getSeedEmptyArray,
  MISTAKES_ON_CARD_ERROR_TEXT
} from "../../lib/seedHelpers";

import content from "../../content";

import PagesSelect from "../pagesSelect";
import Svg from "../svg/Svg";
import Button from "../button";
import CopyButton from "../copyButton";
import Caption from "../caption";
import Page from "../page";

import "./restoreSeed.css";

const placeholderPageNum = pageNum => {
  const arr = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eighth"
  ];

  return arr[pageNum] || pageNum;
};

const RestoreTitle = () => (
  <h3 className="text-center restore-seed__title">
    {content.enterSeedWords}
  </h3>
);

const RestoreButton = ({ onClick }) => (
  <div className="restore-seed__title-with-btn">
    <Button color="green" className="btn--restore-seed" onClick={onClick}>
      {content.restore}
    </Button>
  </div>
);

const RestoreButtonMobile = ({ onClick }) => (
  <div className="text-center">
    <Button
      color="green"
      className="btn--restore-seed-mobile"
      onClick={onClick}
    >
      {content.restore}
    </Button>
  </div>
);

const Title = ({ value, seed, canRestore, onRestore }) => {
  if (value && canRestore) {
    return (
      <div className="restore-seed__title-with-btn">
        <CopyButton className="btn btn--green" text={value} />
      </div>
    );
  }
  if (canRestore) {
    return <RestoreButton onClick={onRestore} />;
  }
  return <RestoreTitle />;
};

class RestorePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false
    };
  }
  onFocus = () => {
    this.setState({ isFocused: true });
  };
  onInput = e => {
    const { onInput, pageNum } = this.props;
    const { value } = e.target;
    onInput(value.replace(/\s+/, " "), pageNum);
  };
  onBlur = () => {
    this.setState({ isFocused: false });
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  };

  render() {
    const { isFocused } = this.state;
    let { text, pageNum, wordOnColumn } = this.props;
    let isValid = true;
    const words = text ? text.trim().split(" ") : [];
    const invalidWordsLength = words.filter(word => !englishValid(word)).length;
    if (invalidWordsLength > 0) {
      isValid = false;
    } else if (words.length !== wordOnColumn) {
      isValid = false;
    }
    let template = null;
    let placeholderText = `enter ${placeholderPageNum(pageNum)} page`;

    if (text.length) {
      template = text.split(" ").map((item, i) => {
        if (!item.trim().length) return null;
        let isValid = englishValid(item);
        const itemClasses = classNames("restore-seed__page-text", {
          "restore-seed__page-text--invalid": !isValid
        });
        return (
          <p className={itemClasses} key={i}>
            {item}
          </p>
        );
      });
    }
    const isCardCorrect = isValid && !isFocused;
    const showHeader = !!text.length;
    return (
      <Page>
        <Page.Header>
          {showHeader && <p className="restore-seed__text">{++pageNum}</p>}
          {isCardCorrect && (
            <Svg className="icon-arrow-restore-seed" name="icon-arrow" />
          )}
        </Page.Header>
        <Page.Content>
          <form className="restore-seed__page-form">
            {template}
            <textarea
              className="restore-seed__page-textarea"
              placeholder={placeholderText}
              value={text}
              onFocus={this.onFocus}
              onInput={this.onInput}
              onBlur={this.onBlur}
            />
          </form>
        </Page.Content>
      </Page>
    );
  }
}

const RestoreList = ({ pages, seed, wordsOnColumn, onInput, onBlur }) => (
  <div className="restore-seed__list">
    <div className="restore-seed__list-position">
      {Array.from(Array(pages)).map((item, i) => {
        return (
          <RestorePage
            key={i}
            text={seed[i] || ""}
            pageNum={i}
            wordOnColumn={wordsOnColumn[i]}
            onInput={onInput}
            onBlur={onBlur}
          />
        );
      })}
    </div>
  </div>
);

class RestoreSeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      seed: getSeedEmptyArray(props.pages)
    };
  }
  isSeedEmpty = () => this.state.seed.some(item => item === "");
  onInput = (value, cardNum) => {
    const { seed } = this.state;
    this.props.onResetValue();
    this.setState({
      seed: [...seed.slice(0, cardNum), value, ...seed.slice(cardNum + 1)]
    });
  };
  onBlur = () => {};
  onValidate = () => {
    const seedArray = getSeedElemAsArray(this.state.seed);
    let mistakes = 0;
    for (let card = 0; card < seedArray.length; card++) {
      if (seedArray[card].length <= 1) {
        mistakes++;
      }
    }
    return mistakes <= 1;
  };
  onRestore = () => {
    const { wordsCount, wordsOnColumn } = this.props;
    const { seed } = this.state;
    const arr = getEmptyColumn(seed, wordsCount, wordsOnColumn);
    const restoredSeed = restoreSeed(arr, wordsCount);
    this.props.onRestore(restoredSeed);
    this.setState({ seed: arr.map(words => words.join(" ")) });
  };
  mobileGetSeed = () => {
    this.onRestore();
    lazyScroll();
  };
  componentWillUnmount() {
    if (this.props.onClear) {
      this.props.onClear();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.pages !== nextProps.pages) {
      this.setState({ seed: getSeedEmptyArray(nextProps.pages) });
      this.props.onResetValue();
    }
    if (this.props.wordsCount !== nextProps.wordsCount) {
      this.props.onResetValue();
    }
  }
  render() {
    const {
      value,
      pages,
      wordsCount,
      wordsOnColumn,
      onChangePageCount,
      onChangeWordCount
    } = this.props;
    const { seed } = this.state;
    const arr = getEmptyColumn(seed, wordsCount, wordsOnColumn);
    const canRestore = canRestoreSeed(arr, wordsCount, wordsOnColumn);
    let error = null;
    if (canValidate(seed)) {
      error = checkSeedForErrors(seed, wordsCount, wordsOnColumn);
    }
    if (!canRestore && !error && !this.isSeedEmpty()) {
      error = MISTAKES_ON_CARD_ERROR_TEXT;
    }
    return (
      <div className="container">
        <div className="restore-seed__container">
          <Title
            seed={seed}
            value={value}
            canRestore={canRestore && !error}
            onRestore={this.onRestore}
          />
          <PagesSelect
            isRestore={true}
            pages={pages}
            wordsCount={wordsCount}
            onChangePageCount={onChangePageCount}
            onChangeWordCount={onChangeWordCount}
          />
          <RestoreList
            seed={seed}
            pages={pages}
            wordsOnColumn={wordsOnColumn}
            onInput={this.onInput}
          />
          <Caption error={error} restore />
          {canRestore &&
            !value && <RestoreButtonMobile onClick={this.mobileGetSeed} />}
        </div>
      </div>
    );
  }
}

export default RestoreSeed;
