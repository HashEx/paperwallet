import React from "react";
import { Route, Link } from "react-router-dom";

import {
  splitSeed,
  checkSeed,
  getSeedEmptyArray,
  calculateWordsPerCard,
  ENGLISH_ERROR_TEXT,
  LENGTH_ERROR_TEXT,
  checkSeedLength,
  englishValid
} from "../../lib/seedHelpers";
import gtag from "../../utils/gtag";

import PagesSelect from "../pagesSelect";
import SplittedSeed from "../splittedSeed";
import RestoreSeed from "../restoreSeed";
import Svg from "../svg/Svg";
import Button from "../button";

import "./seedConstructor.css";

const onRecoverClick = e => {
  gtag('recover', {
    event_category: 'Elements',
    event_action: 'Recover'
  });
}

const RecoverLink = () => (
  <div className="container">
    <div className="restore__container">
      <Link to="/recover/" className="restore__link" onClick={onRecoverClick}>
        <Svg className="icon-arrow" name="icon-arrow" />
        <span className="restore__title">recover your seed</span>
      </Link>
    </div>
  </div>
);

const Splitter = ({ value, pages, onSplit, onChangePageCount }) => {
  return (
    <div className="container">
      <div className="splitter__container">
        <Button
          color="green"
          className="btn--valid-seed"
          onClick={onSplit}
          disabled={!checkSeed(value)}
        >
          split
        </Button>
        {value && (
          <PagesSelect 
            pages={pages} 
            onChangePageCount={onChangePageCount}
          />
        )}
      </div>
    </div>
  )
};

const initialState = {
  pages: 3,
  wordsCount: 15,
  wordsOnColumn: calculateWordsPerCard(15, 3),
  error: null,
  seed: getSeedEmptyArray(3)
}

class SeedConstructor extends React.Component {
  constructor(props){
    super(props);
    this.state = initialState;
  }
  onChange = (e) => {
    const {name, value} = e.target;
    this.setState({[name]: value});
  }
  onSplitSeed = () => {
    const { value } = this.props;
    const { pages } = this.state;
    const seedArray = splitSeed(value, pages).map(item => item.join(" "));

    this.setState(prevState => ({
      seed: seedArray,
      value
    }));
  };
  onSplit = () => {
    const { value } = this.props;
    const validLength = checkSeedLength(value);
    const validEnglish = englishValid(value);

    if (!validEnglish && value.length > 0) {
      this.setState({error: ENGLISH_ERROR_TEXT});
    } else if (!validLength && value.length > 0) {
      this.setState({error: LENGTH_ERROR_TEXT});
    } else {
      gtag('split', {
        event_category: 'Elements',
        event_action: 'Split'
      });
      this.onSplitSeed();
    }
  };
  onChangePageCount = ({ value }) => {
    this.setState({pages: value}, this.onSplitSeed);
  };
  onChangeWordCount = ({ value }) => {
    const { pages } = this.state;
    const seed = getSeedEmptyArray(pages);
    this.setState({
      wordsCount: value,
      seed
    });
  };
  onPrint = () => {
    const { pages, seed } = this.state;
    const { value } = this.props;
    gtag('print', {
      event_category: 'Elements',
      event_action: 'Print'
    });
    const wordsCount = value.trim().split(" ").length;
    sessionStorage.setItem("cards_count", pages);
    sessionStorage.setItem("words_count", wordsCount);
    sessionStorage.setItem("words", seed);
    window.open("/print");
  };
  onClear = () => {
    this.setState(initialState);
    this.props.onResetValue();
  }
  componentWillReceiveProps(nextProps){
    if(this.props.value !== nextProps.value && !nextProps.isRestore){
      this.setState(initialState);
    }
  }
  render(){
    const { value, onRestore, onResetValue } = this.props;
    const { wordsCount, pages, seed } = this.state;
    const wordsOnColumn = calculateWordsPerCard(wordsCount, pages);
    let template = () => {
      const hasValue = seed[0].length && value;
      return (
        <div>
          {
            hasValue ? (
              <SplittedSeed
                seed={seed}
                value={value}
                pages={pages}
                onClear={this.onClear}
                onPrint={this.onPrint}
                onChangePageCount={this.onChangePageCount}
              />
            ) : (
              <Splitter
                value={value}
                pages={pages}
                onSplit={this.onSplit}
                onChangePageCount={this.onChangePageCount}
              />
            )
          }
          <RecoverLink />
        </div>
      );
    }

    const recover = () => {
      return (
        <RestoreSeed 
          pages={pages}
          wordsCount={wordsCount}
          wordsOnColumn={wordsOnColumn}
          seed={seed}
          value={value}
          onClear={this.onClear}
          onChangePageCount={this.onChangePageCount}
          onChangeWordCount={this.onChangeWordCount}
          onRestore={onRestore}
          onResetValue={onResetValue}
        />
      );
    }

    return (
      <div className="seed-constructor">
        <Route exact path="/" render={template} />
        <Route exact path="/recover" render={recover} />
      </div>
    )
  }
};

export default SeedConstructor;