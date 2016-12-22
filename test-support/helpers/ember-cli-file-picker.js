/* global Blob, jQuery */

import Ember from 'ember';

function createFile(content = ['test'], options = {}) {
  const {
    name,
    type,
    lastModifiedDate
  } = options;

  const file = new Blob(content, {type : type ? type : 'text/plain'});
  file.name = name ? name : 'test.txt';

  return file;
}

const uploadFileHelper = function(content, options) {
  const file = createFile(content, options);

  const event = jQuery.Event('change');
  event.target = {
    files: [file]
  };

  jQuery('.file-picker__input').trigger(event);
};

const uploadFile = Ember.Test.registerAsyncHelper('uploadFile', function(app, content, options) {
  uploadFileHelper(content, options);

  return wait();
});

export { uploadFile };
export { uploadFileHelper };
