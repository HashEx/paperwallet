import React from "react";
import PropTypes from "prop-types";

import classNames from "../../lib/classNames";

import "./button.css";

class Button extends React.Component {
	render(){
		const {className, children, color, ...props} = this.props;
		const classes = classNames("btn", className, {
			[`btn--${color}`]: color
		});
		return (
			<button className={classes} {...props}>
				{children}
			</button>
		)
	}
}

Button.propTypes = {
	className: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	color: PropTypes.oneOf(["green", "white"])
}

export default Button;