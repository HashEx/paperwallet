import React from "react";
import { Switch, Route } from "react-router";
import PropTypes from "prop-types";

import {
  getRandomSeed,
  checkSeed,
  englishValid,
  ENGLISH_ERROR_TEXT
} from "../../lib/seedHelpers";

import classNames from "../../lib/classNames";

import content from "../../content";

import Caption from "../caption";

const baseClass = "seed-container";

const getWordsCount = value => value.length ? value.trim().split(" ").length : 0;
const getWordsText = wordsCount => wordsCount > 1 ? wordsCount + " " + content.words : wordsCount + " " + content.word;

const WordsCount = ({value}) => {
  const wordsCount = getWordsCount(value);
  if(!wordsCount) return null;
  return (
    <div className={`${baseClass}__words-count`}>
      {getWordsText(wordsCount)}
    </div>
  );
};

const Placeholder = ({isFocused}) => {
  let classes = classNames(`${baseClass}__placeholder`, {
    [`${baseClass}__placeholder--focus`]: isFocused
  });
  return <div className={classes}>{content.placeholder}</div>;
};

const ClearButton = (props) => (
  <button className={`${baseClass}__clear`} {...props}>
    {content.clear}
  </button>
);

const GenerateButton = (props) => (
  <button className={`${baseClass}__generate`} {...props}>
    {content.autoGenerate}
  </button>
);

class SeedContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isFocused: false,
      value: props.value,
      error: null
    }
  }
  onFocus = () => {
    const { isRestore } = this.props;
    if(isRestore) return;
    this.setState({isFocused: true});
    if(this.props.onFocus){
      this.props.onFocus();  
    }
  }
  onBlur = () => {
    const { isRestore } = this.props;
    if(isRestore) return;
    const { value: currentValue } = this.state;
    const value = currentValue.trim();
    let error = englishValid(value) ? null : ENGLISH_ERROR_TEXT;
    if(value && !checkSeed(value) && !error){
      error = content.invalidSeed;
    }
    this.setState({value: value, error, isFocused: false});
    if(this.props.onBlur){
      this.props.onBlur();
    }
    if(this.props.onChange){
      this.props.onChange(value)
    }
  }
  onGenerate = () => {
    const value = getRandomSeed();
    this.setState({value});
    if(this.props.onChange){
      this.props.onChange(value);
    }
  }
  onChange = (e) => {
    const { isRestore } = this.props;
    if(isRestore) return;
    const { value: initialValue } = e.target;
    const value = initialValue.replace(/\s+/g, " ");
    const valueWithoutLastWord = value.split(" ").slice(0, -1).join(" "); // checking all words before space
    const error = englishValid(valueWithoutLastWord) ? null : ENGLISH_ERROR_TEXT;
    this.setState({value, error})
    if(this.props.onChange){
      this.props.onChange(value);
    }
  }
  onClear = () => {
    this.setState({error: null, value: ""});
    if(this.props.onResetValue){
      this.props.onResetValue();
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.value !== this.props.value){
      this.setState({value: nextProps.value});
    }
  }
  render(){
    const { isFocused, value, error } = this.state;
    const { isRestore } = this.props;
    const wordsCount = getWordsCount(value);

    if(isRestore && !wordsCount) return null;

    const showPlaceholder = wordsCount === 0;
    const showGenerateButton = wordsCount === 0;
    const showClearButton = wordsCount > 0;
    
    let template = null;

    if (wordsCount > 0) {
      template = value.split(" ").map((word, i, words) => {
        const isValid = englishValid(word);
        let isInvalid = !isValid && this.state.error;
        if((i === words.length - 1 && isFocused)){
          isInvalid = false;
        }
        const wordClasses = classNames(`${baseClass}__text`, {
          [`${baseClass}__text--invalid`]: isInvalid
        });
        return <span className={wordClasses} key={i}>{word}</span>;
      })
    }
    const Buttons = () => (
      <div>
        {showClearButton && <ClearButton onClick={this.onClear} />}
        {showGenerateButton && <GenerateButton onClick={this.onGenerate} />}
      </div>
    );
    const classes = classNames(`${baseClass}`, {[`${baseClass}--focused`]: isFocused});
    return (
      <div className={classes}>
        <WordsCount value={value} />
        <Switch>
          <Route exact path="/recover/" component={null} />
          <Route render={Buttons} />
        </Switch>
        <form className={`${baseClass}__form`}>
          {template}
          <textarea
            disabled={isRestore}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            value={value}
            className={`${baseClass}__textarea`}
          />
          {showPlaceholder && <Placeholder isFocused={isFocused} />}
        </form>
        <Caption error={error}>{content.validText}</Caption>
      </div>
    )
  }
}

SeedContainer.propTypes = {
  value: PropTypes.string.isRequired,
  isRestore: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onClear: PropTypes.func
}

export default SeedContainer;