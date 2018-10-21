import React from "react";
import PropTypes from "prop-types";

import PagesSelect from "../pagesSelect";
import Page from "../page";
import Button from "../button";

import "./splittedSeed.css";

const Actions = ({ onPrint, onClear }) => (
  <div className="splitted-seed__title-with-btn">
    <Button color="green" onClick={onPrint}>
      print
    </Button>
    <Button color="white" onClick={onClear}>
      clear
    </Button>
  </div>
);

Actions.propTypes = {
  onPrint: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired
}

const Pages = ({ seed }) => (
  <div className="splitted-seed__list">
    <div className="splitted-seed__list-position">
      {seed.map((text, i) => (
        <Page key={i} textToCopy={text}>
          <Page.Header>{i + 1}</Page.Header>
          <Page.Content>{text}</Page.Content>
        </Page>
      ))}
    </div>
  </div>
);

Pages.propTypes = {
  seed: PropTypes.arrayOf(PropTypes.string).isRequired
}

const SplittedSeed = props => {
  const { seed, onPrint, onClear, pages, onChangePageCount } = props;
  return (
    <div className="container">
      <Actions onPrint={onPrint} onClear={onClear} />
      <PagesSelect pages={pages} onChangePageCount={onChangePageCount} />
      <Pages seed={seed} />
    </div>
  );
};

SplittedSeed.propTypes = {
  onPrint: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  pages: PropTypes.number.isRequired,
  onChangePageCount: PropTypes.func.isRequired,
  seed: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default SplittedSeed;
