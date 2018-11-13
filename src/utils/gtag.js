export default (type, options) => {
	const { gtag } = window;
	if(typeof gtag !== 'undefined'){
		console.log('gtag', type, options);
		gtag('event', type, options);
	}else{
		console.log('Gtag is not defined');
	}
}