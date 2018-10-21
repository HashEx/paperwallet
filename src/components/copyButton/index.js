import React from "react";
import PropTypes from "prop-types";

import copyToClipboard from "../../lib/copyToClipboard";
import classNames from "../../lib/classNames";

const initialCopyText = "copy";

class CopyButton extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			copyText: initialCopyText
		}
	}
	onCopy = () => {
		this.setState({copyText: "copied!"});
		setTimeout(() => {
			this.setState({copyText: initialCopyText});
		}, 1000);
	};
	onClick = e => {
		const {text} = this.props;
		e.preventDefault();
		copyToClipboard(text, this.onCopy);
	};
	render(){
		const {className} = this.props;
		const classes = classNames("copy-btn", className);
		return (
			<button className={classes} onClick={this.onClick}>
				{this.state.copyText}
			</button>
		);
	}
};

CopyButton.propTypes = {
	className: PropTypes.string,
	text: PropTypes.string.isRequired
}


export default CopyButton;