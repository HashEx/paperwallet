export default (string) => {
	return string.split(" ").map((word) => {
		return word.slice(0, 1).toUpperCase() + word.slice(1);
	}).join(" ");
}