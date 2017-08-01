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
    window.scrollBy(0, rect.top - (navHeight + offset));
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
