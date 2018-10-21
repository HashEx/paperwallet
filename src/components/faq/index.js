import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";

import "./faq.css";

const FAQItem = ({ header, children }) => {
	return (
		<div className="faq-item">
			<h2 className="faq-item__header">{header}</h2>
			<div className="faq-item__text">{children}</div>
		</div>
	);
};

FAQItem.propTypes = {
	header: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

class FAQ extends React.Component {
	render() {
		return (
			<div id="faq" className="faq">
				<Helmet>
					<title>Frequently Asked Questions</title>
				</Helmet>
				<div className="container">
					<FAQItem header="What is it?">
						Paper Wallet is the safest way to store your seed phrase
						and private keys. It was designed by{" "}
						<a href="https://hashex.org" target="_blank" rel="noopener noreferrer">
							HashEx
						</a>{" "}
						in cooperation with{" "}
						<a
							href="https://elastoo.com/"
							target="_blank"
							rel="nofollow noopener noreferrer"
						>
							Elastoo
						</a>{" "}
						and allows to split your seed phrase into several pages
						which you can print out and keep separately. We
						recommend locking the pages in separate safe deposit
						boxes in different locations. Paper Wallet supports
						redundant encryption algorithms, thus, letting you set
						not only the number of pages to store the seed on, but
						also the number of pages required to recover the seed.
					</FAQItem>
					<FAQItem header="How about privacy?">
						Paper Wallet does not store or send your data anywhere.
						During seed generation or split we recommend
						disconnecting your computer from the Internet. Our
						software is an open source so anyone can audit it if
						they have security concerns.
					</FAQItem>
					<FAQItem header="What cryptocurrencies are supported?">
						Paper Wallet is built on top of BIP44 standard. The same
						standard is used in hardware wallets such as Trezor and
						Ledger Nano S. You can use it for Bitcoin, Ethereum,
						Litecoin and other 200+ currencies. Check full list{" "}
						<a
							href="https://github.com/satoshilabs/slips/blob/master/slip-0044.md"
							target="_blank"
							rel="nofollow noopener noreferrer"
						>
							here
						</a>
					</FAQItem>
					<FAQItem header="Where I can check the source code?">
						You can check source the source code at{" "}
						<a
							href="https://github.com/HashEx/paperwallet"
							target="_blank"
							rel="nofollow noopener noreferrer"
						>
							GitHub
						</a>
						.
					</FAQItem>
					<FAQItem header="How it works?">
						Now we implement only one redundant encryption algorithm
						based on XOR binary operation. This algorithm allows to
						restore seed phrase from N - 1 pages, where N is amount
						of pages during splitting.
					</FAQItem>
				</div>
			</div>
		);
	}
}

export default FAQ;
