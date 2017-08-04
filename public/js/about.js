$(window).ready(function() {
  setBodyMargin();

  if (Clipboard.isSupported()) {
    let clipboard = new Clipboard('#example');

    $('#example').on('mouseleave', function() {
      setTimeout(function() {
        $('#example').attr('tooltip', '');
      }, 350);
    });

    clipboard.on("success", function(e) {
      $('#example').attr('tooltip', 'Copiado para área de transferência!');
    });
    clipboard.on("error", function(e) {
      $('#example').attr('tooltip', 'Erro ao tentar copiar automaticamente');
    });
  }

  $('#instructions-go').on('click', function() {
    $('#instructions').addClass('highlight');
    let rect = $('#instructions').get(0).getBoundingClientRect();
    let navHeight = getNavHeight();
    let offset = 10;
    scrollByAnimated(rect.top - (navHeight + offset), 400);
  });

  $(window).on('resize', function() {
    setBodyMargin();
  });
});

function setBodyMargin() {
  let navHeight = getNavHeight();
  let offset = 15;
  $('body').css('margin-top', navHeight + offset);
}

function getNavHeight() {
  let navHeight = $('nav').css('height');
  navHeight = Number(navHeight.slice(0, navHeight.indexOf("px")));
  return navHeight;
}

function scrollByAnimated(ynum, duration, callback) {
  let direction = (ynum < 0 ? -1 : 1);
  ynum = Math.abs(ynum);

  let dt = 10;
  let nSteps = (duration/dt >= 15 ? duration/dt : 15);

  let scrollStepFloat = ynum/(nSteps);
  let scrollStepInt = Math.floor(scrollStepFloat);
  let remainingToScroll = Math.floor((scrollStepFloat - scrollStepInt) * nSteps);
  nSteps += Math.floor(remainingToScroll/scrollStepInt);
  remainingToScroll = Math.floor(remainingToScroll % scrollStepInt);

  let i = 0;
  let scrolling = setInterval(function() {
    if (i < nSteps) {
      window.scrollBy(0, direction * scrollStepInt);
      i += 1;
    } else {
      window.scrollBy(0, direction * remainingToScroll);
      clearInterval(scrolling);
      if (callback) {
        callback();
      }
    }
  }, dt);
}
