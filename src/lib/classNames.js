export default function classNames(){
	const args = Array.prototype.slice.call(arguments);
	let classes = [];
	args.forEach((item) => {
		if(typeof item === "string" && item){
			classes.push(item);
		}
		if(typeof item === "object" && item){
			if(!Array.isArray(item)){
				Object.keys(item).forEach(key => {
					if(item[key]){
						classes.push(key);
					}
				});
			}else if(Array.isArray(item) && item.length){
				classes.push(classNames.apply(null, item));
			}
		}
	});
	classes = classes.filter((item, index) => classes.indexOf(item) === index).join(" ");
	return classes;
}