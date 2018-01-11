const Interpreter = require('./interpreter.js');
const utils = require('./utils.js');
const animations = require('./animations.js');

const index = {
  init: function() {
    this.control.init();
  },

  model: {
    init: function() {
      this.chords = ['e', 'B', 'G', 'D', 'A', 'E'];
      this.interpreter = new Interpreter(this.chords);

      if (sessionStorage.getItem('tabwriter-data')) {
        this.instructions = sessionStorage.getItem('tabwriter-data');
        this.interpreter.convert(this.instructions);
      } else {
        sessionStorage.setItem('tabwriter-data', '');
        this.instructions = '';
      }
    },

    reset: function() {
      sessionStorage.setItem('tabwriter-data', '');
      this.instructions = '';
      this.interpreter.convert(this.instructions);
    },

    update: function(data) {
      for (let key in data) {
        if (key === 'instructions' || key === 'chords')
        this[key] = data[key];
      }

      const error = this.interpreter.convert(this.instructions);
      if (!error.length) {
        sessionStorage.setItem('tabwriter-data', this.instructions);
      }
    }

  },

  control: {
    init: function() {
      index.model.init();
      index.view.init();
    },

    getData: function() {
      const tab = index.model.interpreter.tab;
      const chords = index.model.chords;
      const instructions = index.model.instructions;
      const parameters = {
        tab: tab,
        chords: chords,
        instructions: instructions
      };
      return parameters;
    },

    updateData: function(data) {
      index.model.update(data);
      index.view.render();
    }

  },

  view: {
    init: function() {
      this.window = $(window);
      this.input = $('#input');
      this.dashboard = $('#dashboard');
      this.buttonCreate = $('#btn-create');
      this.buttonDelete = $('#btn-delete');
      this.buttonDownload = $('#btn-download');
      this.outCtrl = $('.output-control');
      this.outCtrlInput = $('.output-control .input-group input');
      this.outCtrlVisible = false;
      this.outCtrlAnimationTime = 400;
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
        if (this.outCtrlVisible) {
          animations.outCtrlHide(0);
          this.outCtrlVisible = false;
        }
        this.buttonDelete.blur();
      });

      this.buttonDownload.on('click', () => {
        if (this.outCtrlVisible) {
          const data = index.control.getData();
          data.tabTitle = this.outCtrlInput.val();
          utils.writePdf(data);
          animations.outCtrlHide(this.outCtrlAnimationTime);
        } else {
          animations.outCtrlShow(this.outCtrlAnimationTime);
        }

        this.outCtrlVisible = !this.outCtrlVisible;
        this.buttonDownload.blur();
      });

      this.render();
    },

    render: function() {
      const data = index.control.getData();
      data.maxLength = this.maxStrLength;
      const tabBlocks = utils.wrapTab(data);
      this.dashboard.html('');

      if (tabBlocks.length) {
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
    },

    calibrateWindow: function() {
      const singleCellTable = utils.appendTable(this.dashboard, 1, 1);
      const maxStrLen = utils.maxStrLenNoWrap(singleCellTable.find('td').slice(-1));
      this.dashboard.html('');
      return maxStrLen;
    }

  }

};

module.exports = index;
