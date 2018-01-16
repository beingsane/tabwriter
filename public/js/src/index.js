const Interpreter = require('./interpreter.js');
const utils = require('./utils.js');

const index = {
  init: function() {
    this.control.init();
  },

  model: {
    init: function() {
      if (sessionStorage.getItem('tabwriter-data')) {
        this.data = JSON.parse(sessionStorage.getItem('tabwriter-data'));
        this.interpreter = new Interpreter(this.data.chordsNumber, this.data.mainSpacing);
        this.data.error = this.interpreter.convert(this.data.instructions);
      } else {
        this.interpreter = new Interpreter();
        this.reset();
      }
    },

    reset: function() {
      this.data = {
        instructions: '',
        title: '',
        description: '',
        chordsNumber: this.interpreter.DEFAULT_CHORDS_NUMBER,
        mainSpacing: this.interpreter.DEFAULT_SPACING,
        error: this.interpreter.convert('')
      };
      sessionStorage.setItem('tabwriter-data', JSON.stringify(this.data));
    },

    update: function(data) {
      for (let key in data) {
        if (key in this.data) {
          this.data[key] = data[key];
        }
      }
      this.interpreter.chordsNumber = this.data.chordsNumber;
      this.interpreter.mainSpacing =  this.data.mainSpacing;
      this.data.error = this.interpreter.convert(this.data.instructions);
      sessionStorage.setItem('tabwriter-data', JSON.stringify(this.data));
    }

  },

  control: {
    init: function() {
      index.model.init();
      index.view.init();
      index.configView.init();
    },

    getData: function() {
      const data = index.model.data;
      data.chords = index.model.interpreter.chords;
      data.tab = index.model.interpreter.tab;
      return data;
    },

    updateData: function(data) {
      index.model.update(data);
      if (index.model.interpreter.tab) {
        index.view.render();
      }
    }

  },

  view: {
    init: function() {
      this.window = $(window);
      this.input = $('#input');
      this.error = $('#error');
      this.dashboard = $('#dashboard');
      this.buttonCreate = $('#btn-create');
      this.buttonDelete = $('#btn-delete');
      this.buttonDownload = $('#btn-download');
      this.outCtrl = $('.output-control');
      this.maxStrLength = this.calibrateWindow();

      const data = index.control.getData();
      this.input.val(data.instructions);

      this.window.on('resize', () => {
        this.maxStrLength = this.calibrateWindow();
        this.render();
      });

      this.buttonCreate.on('click', () => {
        const newInstructions = this.input.val();
        index.control.updateData({
          instructions: newInstructions
        });
        this.buttonCreate.blur();
      });

      this.buttonDelete.on('click', () => {
        this.input.val('');
        index.control.updateData({
          instructions: ''
        });
        this.buttonDelete.blur();
        this.render();
      });

      this.buttonDownload.on('click', () => {
        const data = index.control.getData();
        utils.writePdf(data);
        this.buttonDownload.blur();
      });

      this.render();
    },

    render: function() {
      const data = index.control.getData();
      data.maxLength = this.maxStrLength;
      const tabBlocks = utils.wrapTab(data);
      this.dashboard.html('');
      this.error.html('');

      if (tabBlocks.length) {
        let htmlStr =  '';
        if (data.title) {
          htmlStr += '<h3>' + data.title + '</h3>';
        }
        if (data.description) {
          htmlStr += '<p>' + data.description + '</p>';
        }
        this.dashboard.html(htmlStr);
        tabBlocks.forEach( (block) => {
          const table = utils.appendTable(this.dashboard, block.length, 1);
          block.forEach( (blockRow, i) => {
            $(table.find('td').get(i)).text(blockRow);
          });
        });
        this.outCtrl.css('visibility', 'visible');
      } else {
        this.outCtrl.css('visibility', 'hidden');
      }

      if (data.error.length) {
        this.error.append('<h4>Problemas foram identificados (' +
                          data.error.length + '):</h4>');
        data.error.forEach( (errorMsg, i) => {
          this.error.append('<p></p>');
          this.error.find('p').slice(-1).text((i + 1) + ') ' + errorMsg);
        });
        this.error.css('display', 'block');
      } else {
        this.error.css('display', 'none');
      }
    },

    calibrateWindow: function() {
      const singleCellTable = utils.appendTable(this.dashboard, 1, 1);
      const maxStrLen = utils.maxStrLenNoWrap(singleCellTable.find('td').slice(-1));
      this.dashboard.html('');
      return maxStrLen;
    }

  },

  configView: {
    init: function() {
      this.buttonConfig = $('#btn-config');
      this.buttonSaveConfig = $('#btn-save-config');
      this.buttonResetConfig = $('#btn-reset-config');
      this.buttonCloseConfig = $('#btn-close-config');

      this.configArea = $('#config-area');
      this.configTitle = $('#tab-title');
      this.configDescription = $('#tab-description');
      this.configChordsNumber = $('#tab-chords-number');
      this.configSpace = $('#tab-space');

      this.buttonConfig.on('click', () => {
        this.configArea.slideToggle();
        this.render();
        this.buttonConfig.blur();
      });

      this.buttonSaveConfig.on('click', (event) => {
        const newChordsNumber = Number(this.configChordsNumber.val());
        const newSpace = Number(this.configSpace.val());
        const newTitle = this.configTitle.val();
        const newDescription = this.configDescription.val();
        let error = false;
        if (isNaN(newChordsNumber) || newChordsNumber < 1 || newChordsNumber > 20 ) {
          this.configChordsNumber.next('.form-error').text('Mínimo de 1 corda e máximo de 20.');
          error = true;
        } else {
          this.configChordsNumber.next('.form-error').text('');
        }
        if (isNaN(newSpace) || newSpace < 1) {
          this.configSpace.next('.form-error').text('Espaçamento mínimo: 1');
          error = true;
        } else {
          this.configSpace.next('.form-error').text('');
        }
        event.preventDefault();
        this.buttonSaveConfig.blur();
        if (error) {
          return;
        } else {
          index.control.updateData({
            title: newTitle,
            description: newDescription,
            chordsNumber: newChordsNumber,
            mainSpacing: newSpace
          });
        }
        this.configArea.slideToggle();
        this.render();
      });

      this.buttonResetConfig.on('click', () => {
        this.configTitle.val('');
        this.configDescription.val('');
        this.configChordsNumber.val(6);
        this.configSpace.val(2);
        this.buttonResetConfig.blur();
      });

      this.buttonCloseConfig.on('click', () => {
        this.configArea.slideToggle();
        this.render();
        this.buttonCloseConfig.blur();
      });

      this.render();
    },

    render: function() {
      const data = index.control.getData();
      this.configTitle.val(data.title);
      this.configDescription.val(data.description);
      this.configChordsNumber.val(data.chordsNumber);
      this.configSpace.val(data.mainSpacing);
      this.configSpace.next('.form-error').text('');
      this.configChordsNumber.next('.form-error').text('');
    }
  }

};

module.exports = index;
