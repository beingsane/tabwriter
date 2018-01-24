const about = {
  init: function() {
    this.view.init();
  },

  view: {
    init: function() {
      this.TOOLTIP_FADE_DELAY = 350;
      this.window = $(window);
      this.document = $(document);
      this.exampleSel = '#example';
      this.example = $(this.exampleSel);
      this.instructionsBtn = $('#instructions-go');
      this.instructionsArea = $('#instructions');
      this.sectionsNav = $('#sections-nav');

      this.sections = [];
      $('a.anchor-link').each(function () {
        const name = $(this).attr('name');
        const section = {
          name: name,
          top: $(this).offset().top
        };
        about.view.sections.push(section);
      });

      this.setEventListeners();
      this.render();
    },

    render: function() {
      // Reset sections nav
      this.sectionsNav.find('li').removeClass('active');
      // Get current section on screen
      const windowTop = this.window.scrollTop();
      let sectionIdx;
      if (this.sections.length > 1) {
        const secondItenTop = this.sections[1].top;
        const lastItenTop = this.sections.slice(-1)[0].top;
        if (windowTop < secondItenTop) {
          sectionIdx = 0;
        } else if (windowTop >= lastItenTop) {
          sectionIdx = this.sections.length - 1;
        } else {
          for (let i = 1, n = this.sections.length; i < n; i++) {
            if (windowTop >= this.sections[i].top && windowTop < this.sections[i + 1].top) {
              sectionIdx = i;
              break;
            }
          }
        }
      } else {
        sectionIdx = 0;
      }
      // Active current section
      const sectionNav = this.sectionsNav.find('a[href="#' +
                                    this.sections[sectionIdx].name + '"]');
      const secNavFirstParent = sectionNav.parents().eq(0);
      const secNavThirdParent = sectionNav.parents().eq(2);
      if (secNavFirstParent.prop('tagName') === 'LI') {
        secNavFirstParent.addClass('active');
      }
      if (secNavThirdParent.prop('tagName') === 'LI') {
        secNavThirdParent.addClass('active');
      }
    },

    setEventListeners: function() {
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
      });

      $(window).on('scroll', () => {
        this.render();
      });
    }

  }

};

module.exports = about;
