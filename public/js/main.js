$(document).ready(function() {

  setBodyMargin();
  $(window).on('resize', function() {
    setBodyMargin();
  });

});

function setBodyMargin() {
  let navHeight = $('nav').css('height');
  let offset = 15;
  navHeight = Number(navHeight.slice(0, navHeight.indexOf("px")));
  $('body').css('margin-top', navHeight + offset);
}

function pixelToNumber(pixelValue) {
  let numberStr = pixelValue.slice(0, pixelValue.indexOf("px"));
  let numberInt = Math.floor(Number(numberStr));
  return numberInt;
}

function scrollByAnimated(ynum, duration, callback) {
  let direction = (ynum < 0 ? -1 : 1);
  let dt = 10;
  let nSteps = (duration/dt >= 15 ? duration/dt : 15);
  let scrollStepFloat = Math.abs(ynum)/(nSteps);
  let scrollStepInt = Math.floor(scrollStepFloat);
  let remainingToScroll = Math.floor((scrollStepFloat - scrollStepInt) * nSteps);
  let scrollingInterval;
  let step = 0;

  nSteps += Math.floor(remainingToScroll/scrollStepInt);
  remainingToScroll = Math.floor(remainingToScroll % scrollStepInt);

  scrollingInterval = setInterval(function() {
    if (step < nSteps) {
      window.scrollBy(0, direction * scrollStepInt);
      step += 1;
    } else {
      window.scrollBy(0, direction * remainingToScroll);
      clearInterval(scrollingInterval);
      if (callback) {
        callback();
      }
    }
  }, dt);
}
