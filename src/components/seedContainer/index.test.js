import React from "react";
import ReactDOM from "react-dom";
import sinon from "sinon";

import Enzyme from "../../utils/enzymeSetup";

import SeedContainer from "./";

const { shallow } = Enzyme;


describe("<SeedContainer />", () => {
  	describe("index route", () => {
		const props = {
			value: "",
			onChange: jest.fn(),
			onFocus: jest.fn(),
			onBlur: jest.fn()
		}
		let index = shallow(<SeedContainer {...props} />);
		let textarea = index.find("textarea");
		it("should focus", () => {
			textarea.simulate("focus");
			expect(props.onFocus).toHaveBeenCalled();
			expect(index.state().isFocused).toBeTruthy();
		});
		
		it("should change value", () => {
			expect(index.state().value).toEqual("");
			textarea.simulate("change", {target: {value: "text"}});
			expect(props.onChange).toHaveBeenCalled();
			expect(index.state().value).toEqual("text");
			expect(index.find('textarea').getElement().props.value).toEqual("text");
			expect(index.state().isFocused).toBeTruthy();
		});

		it("should blur", () => {
			textarea.simulate("blur");
			expect(props.onBlur).toHaveBeenCalled();
			expect(index.state().isFocused).toBeFalsy();
		});
	});

	describe("recover route", () => {
		const props = {
			isRestore: true,
			value: "margin steak boil huge crush argue couch culture truth bar addict service valley pencil bring",
			onChange: jest.fn()
		};
		let recover = shallow(<SeedContainer {...props} />);
		let textarea = recover.find("textarea");
		it("should set value", () => {
			expect(textarea.getElement().props.value).toEqual(props.value);
		});
		describe("<textarea />", () => {
			it("should be disabled", () => {
				expect(textarea.getElement().props.disabled).toBeTruthy();
			});
		});
		it("should not change value", () => {
			textarea.simulate("change", {target: {value: "text"}});
			expect(props.onChange).not.toHaveBeenCalled();
			expect(textarea.getElement().props.value).toEqual(props.value);
		});
	});
});
