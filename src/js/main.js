const index = require('./index.js');
const about = require('./about.js');


const tabwriter = {
  init: function() {
    const namespace = $('body').attr('id');
    if (namespace in this &&
        'init' in this[namespace] &&
        typeof this[namespace]['init'] === 'function'){
      this[namespace].init();
    }
  },

  index: index,

  about: about
  
};

$(function() {
  tabwriter.init();
});
