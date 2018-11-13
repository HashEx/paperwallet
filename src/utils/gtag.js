export default (type, options) => {
	const { gtag } = window;
	if(typeof gtag !== 'undefined'){
		gtag('event', type, options);
	}else{
		console.log('Gtag is not defined');
	}
}