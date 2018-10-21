import React from "react";
import { Link } from "react-router-dom";

import content from "../../content";

export default () => (
  <div className="intro">
    {content.intro}
    {" "}
    <Link to="/faq/">{content.readMore}</Link>.
  </div>
);
