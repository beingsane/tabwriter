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
  window.scrollBy(0, rect.top);
});
