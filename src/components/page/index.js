import React from "react";
import PropTypes from "prop-types";

import CopyButton from "../copyButton";

import "./page.css";

const Header = ({children}) => (
	<div className="page__headline">{children}</div>
);

const Content = ({children}) => (
	<div className="page__content">{children}</div>
);

const Page = ({ children, textToCopy }) => (
	<div className="page">
		<div className="page__inner">
			{children}
			{textToCopy && <CopyButton className="page__copy" text={textToCopy} />}
		</div>
	</div>
);

Page.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element,
		PropTypes.arrayOf(PropTypes.element)
	]).isRequired,
	textToCopy: PropTypes.string
}

Page.Header = Header;
Page.Content = Content;

export default Page;
