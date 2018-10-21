export default () => {
  var duration = 1;
  var w = window.pageYOffset;
  var t = document.body.getBoundingClientRect().top;
  var start = null;
  requestAnimationFrame(step);
  function step(time) {
    if (start === null) start = time;
    var progress = time - start;
    var r =
      t < 0
        ? Math.max(w - progress / duration, w + t)
        : Math.min(w + progress / duration, w + t);

    window.scrollTo(0, r);

    if (r !== w + t) requestAnimationFrame(step);
  }
};