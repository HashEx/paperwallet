import React from "react";
import { Link } from "react-router-dom";

import content from "../../content";

import "./footer.css";

const Footer = () => (
	<footer className="footer">
		<div className="container">
			<Link to="/" className="footer__logo">
				{content.title}
			</Link>
			<ul className="footer__menu">
				<li className="footer__menu-item">
					<Link to="/faq/" className="footer__menu-link">
						{content.links.faq}
					</Link>
				</li>
				<li className="footer__menu-item">
					<a href="/#" className="footer__menu-link">
						{content.links.termsAndConditions}
					</a>
				</li>
				<li className="footer__menu-item">
					<a
						href="https://github.com/HashEx/paperwallet"
						target="_blank"
						rel="nofollow noopener noreferrer"
						className="footer__menu-link"
					>
						GitHub
					</a>
				</li>
			</ul>
			<div className="footer__copy">
				{content.copyright}
			</div>
		</div>
	</footer>
);

export default Footer;
