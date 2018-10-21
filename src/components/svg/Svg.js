import React from "react"
import "./icons.css";

const SVG = {
	"icon-arrow": (props) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="13"
			height="9"
			viewBox="0 0 13 9"
			{...props}
		>
			<path
				fillRule="evenodd"
				d="M6.753 7.888l-.317.316L0 1.768 1.768 0l4.684 4.684L11.135 0l1.768 1.768-6.135 6.135-.015-.015z"
			/>
		</svg>
	)
}


const Svg = ({name, className}) => {
	const Icon = SVG[name];
	return <Icon className={className} />
}

export default Svg;