const animations = require('./animations.js');

const about = {
  init: function() {
    this.view.init();
  },

  view: {
    init: function() {
      this.TOOLTIP_FADE_DELAY = 350;

      this.exampleSel = '#example';
      this.example = $(this.exampleSel);
      this.instructionsBtn = $('#instructions-go');
      this.instructionsArea = $('#instructions');


      if (Clipboard.isSupported()) {
        let clipboard = new Clipboard(this.exampleSel);

        this.example.on('mouseleave', () => {
          setTimeout(() => {
            this.example.attr('tooltip', '');
          }, about.TOOLTIP_FADE_DELAY);
        });

        clipboard.on('success', () => {
          this.example.attr('tooltip', 'Copiado para área de transferência!');
        });
        clipboard.on('error', () => {
          this.example.attr('tooltip', 'Erro ao tentar copiar automaticamente');
        });
      }

      this.instructionsBtn.on('click', () => {
        this.instructionsArea.addClass('highlight');
        let rect = this.instructionsArea.get(0).getBoundingClientRect();
        let navbarHeight = parseInt($('nav').css('height'));
        let offset = 10;
        animations.scrollBy(rect.top - (navbarHeight + offset), 400);
      });
    }

  }

};

module.exports = about;
