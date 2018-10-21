import React from "react";
import ReactSelect, { components } from "react-select";

import classNames from "../../lib/classNames";
import { WORDS_COUNT_ALLOWED, getEmptyArray } from "../../lib/seedHelpers";

import content from "../../content";

import "./pagesSelect.css";

const generate = getEmptyArray(6).map((item, index) => ({value: index + 3, label: index + 3}));
const recover = getEmptyArray(6).map((item, index) => ({value: index + 2, label: index + 2}));
const words = WORDS_COUNT_ALLOWED.map(item => ({value: item, label: item}));

const generateOption = [{
  label: content.pagesToGenerateCaption,
  options: generate
}];

const recoverOption = [{
  label: content.pagesToRecoverCaption,
  options: generate
}];

const wordsOption = [{
  label: content.wordsCountCaption,
  options: words,
}];

const wordsStyles = {
  control: base => ({
    ...base,
    width: "36px"
  })
}

const generateStyles = {
  control: base => ({
    ...base,
    width: "28px"
  })
}

const GroupHeading = props => <components.GroupHeading {...props} />

const getValueObject = (value, arr) => {
  for (let i in arr) {
    if (value === arr[i].value) {
      return arr[i]
    }
  }
}

const Select = ({ text, className, ...props}) => {
  const classes = classNames("pages-select__block", className);
  return (
    <div className={classes}>
      <div><p className="pages-select__text">{text}</p></div>
      <ReactSelect
        components={GroupHeading}
        classNamePrefix="pages-select"
        isSearchable={false}
        {...props}
      />
    </div>
  )
}

const PagesSelect = (props) => {
  const { 
    isRestore,
    pages,
    wordsCount,
    onChangePageCount,
    onChangeWordCount
  } = props;
  const generateSelectPlaceholder = isRestore ? content.generatedPagesLabel: content.pagesToGenerateLabel;
  return (
    <div className="pages-select__container">
      <div className="pages-select__container-position">
        <Select
          text={generateSelectPlaceholder}
          styles={generateStyles}
          value={getValueObject(pages, generate)}
          options={generateOption}
          onChange={onChangePageCount}
        />
        <Select
          text={content.pagesToRecoverLabel}
          styles={generateStyles}
          value={getValueObject(pages - 1, recover)}
          isDisabled={true}
          options={recoverOption}
        />
        {isRestore && (
          <Select
            className="pages-select__block--words"
            text={content.totalWordsLabel}
            styles={wordsStyles}
            value={getValueObject(wordsCount, words)}
            options={wordsOption}
            onChange={onChangeWordCount}
          />
        )}
      </div>
    </div>
  )
};

export default PagesSelect;