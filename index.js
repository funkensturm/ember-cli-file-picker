/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-file-picker',

  included: function included(app) {
    this._super.included(app);

    var isProduction = app.env === 'production';
    if (!isProduction) {
      app.import(app.bowerDirectory + '/blob/Blob.js', { type: 'test' });
    }
  }
};
