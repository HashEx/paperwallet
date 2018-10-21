import React from "react";

import Enzyme from "./utils/enzymeSetup";

import App from "./App";

import SeedContainer from "./components/seedContainer";

const { shallow } = Enzyme;

it("renders without crashing", () => {
  const wrapper = shallow(<App />);
});
