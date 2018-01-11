const animations = {
  scrollBy: function(ynum, duration, callback) {
    const xnum = 0;
    const direction = (ynum < 0 ? -1 : 1);
    const dt = 10;
    let nSteps = (duration/dt >= 15 ? duration/dt : 15);
    const scrollStepFloat = Math.abs(ynum)/(nSteps);
    const scrollStepInt = Math.floor(scrollStepFloat);
    let remainingToScroll = Math.floor((scrollStepFloat - scrollStepInt) * nSteps);

    nSteps += Math.floor(remainingToScroll/scrollStepInt);
    remainingToScroll = Math.floor(remainingToScroll % scrollStepInt);

    let step = 0;
    const scrollingInterval = setInterval(function() {
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

  outCtrlShow: function(duration) {
    $('.output-control .btn-custom').animate({
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    }, duration, function() {
      $('.output-control').animate({
        width: '100%'
      }, duration);
      $('.output-control .input-group input').css('display', 'table-cell');
      $('.output-control .input-group input').animate({
        borderWidth: '1px',
        padding: '6px 12px'
      }, duration, function() {
        $('.output-control .btn-custom').html(
          '<i class="fa fa-download" aria-hidden="true"></i>'
        );
      });
    });
  },

  outCtrlHide: function(duration) {
    $('.output-control').animate({
      width: '60px'
    }, duration);
    $('.output-control .input-group input').animate({
      borderWidth: '0',
      padding: '0'
    }, duration, function() {
      $('.output-control .input-group input').css('display', 'none');
      $('.output-control .btn-custom').animate({
        borderTopLeftRadius: '40px',
        borderBottomLeftRadius: '40px',
      }, duration, function() {
        $('.output-control .btn-custom').html(
          '<i class="fa fa-file-pdf-o" aria-hidden="true"></i>'
        );
      });
    });
  }

};

module.exports = animations;
