import React, { Component } from "react";
import { withRouter } from "react-router";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Helmet } from "react-helmet";

import content from "./content";

import Title from "./components/title";
import Intro from "./components/intro";
import SeedContainer from "./components/seedContainer";
import SeedConstructor from "./components/seedConstructor";
import Footer from "./components/footer";
import FAQ from "./components/faq";
import Print from "./components/print";

import "./App.css";

const FAQRoute = () => (
  <div className="container">
    <Title />
    <div className="content">
      <FAQ />
    </div>
  </div>
);

const TopWrapper = props => {
  const showIntro = !props.isRestore && !props.value;
  const IndexRoute = () => {
    return (
      <div className="container">
        <Title />
        {showIntro && <Intro />}
        <SeedContainer {...props} />
      </div>
    );
  };
  return (
    <div className="top-wrapper">
      <div className="top">
        <Switch>
          <Route exact path="/faq/" component={FAQRoute} />
          <Route exact render={IndexRoute} />
        </Switch>
      </div>
    </div>
  );
};

const initialState = {
  value: ""
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }
  onResetValue = () => {
    this.setState({ value: "" });
  };
  onChange = value => {
    this.setState({ value });
  };
  onRestore = value => {
    this.setState({ value });
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.onResetValue();
    }
  }
  render() {
    const { value } = this.state;
    const isRestore = RegExp(/^\/recover\/?/).test(this.props.location.pathname);

    const title = isRestore
      ? content.pages.restore.title
      : content.pages.index.title;
    const IndexRoute = () => (
      <div>
        <TopWrapper
          value={value}
          isRestore={isRestore}
          onChange={this.onChange}
          onResetValue={this.onResetValue}
        />
        <SeedConstructor
          isRestore={isRestore}
          value={value}
          onRestore={this.onRestore}
          onResetValue={this.onResetValue}
        />
        <Footer />
      </div>
    );
    return (
      <div className="main">
        <Helmet defaultTitle="Paper Wallet" titleTemplate="Paper Wallet - %s">
          <title>{title}</title>
          <meta name="description" content={content.pages.index.description} />
        </Helmet>
        <Switch>
          <Route exact path="/print/" component={Print} />
          <Route render={IndexRoute} />
        </Switch>
      </div>
    );
  }
}

App = withRouter(App);

export default () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
