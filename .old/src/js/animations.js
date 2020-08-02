const animations = {
  scrollBy: function (ynum, duration, callback) {
    const xnum = 0;
    const direction = ynum < 0 ? -1 : 1;
    const dt = 10;
    let nSteps = duration / dt >= 15 ? duration / dt : 15;
    const scrollStepFloat = Math.abs(ynum) / nSteps;
    const scrollStepInt = Math.floor(scrollStepFloat);
    let remainingToScroll = Math.floor(
      (scrollStepFloat - scrollStepInt) * nSteps
    );

    nSteps += Math.floor(remainingToScroll / scrollStepInt);
    remainingToScroll = Math.floor(remainingToScroll % scrollStepInt);

    let step = 0;
    const scrollingInterval = setInterval(function () {
      if (step < nSteps) {
        window.scrollBy(xnum, direction * scrollStepInt);
        step += 1;
      } else {
        window.scrollBy(xnum, direction * remainingToScroll);
        clearInterval(scrollingInterval);
        if (callback) {
          callback();
        }
      }
    }, dt);
  },
};

module.exports = animations;
