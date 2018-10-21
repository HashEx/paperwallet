import React from "react";
import PropTypes from "prop-types";

import classNames from "../../lib/classNames";

const Caption = ({error, restore, children}) => {
  let classes = classNames("caption", {
  	"caption--invalid": error,
  	"caption--restore-seed": restore
  });
  return <p className={classes}>{error ? error : children}</p>
};

Caption.propTypes = {
	className: PropTypes.string,
	error: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
}

export default Caption;