export default (text, cb) => {
    let tmp = document.createElement("input");
    let focus = document.activeElement;
    tmp.value = text.trim();
    document.body.appendChild(tmp);
    tmp.select(); 
    document.execCommand('copy'); 
    document.body.removeChild(tmp);
    focus.focus();
    if(typeof cb === "function"){
        cb();
    }
}