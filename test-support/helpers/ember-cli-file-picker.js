/* global Blob, jQuery */

import Ember from 'ember';

const uploadFileHelper = function(content, name, lastModifiedDate) {
  const file = new Blob(
    content ? content : ['']
  );
  file.name = name ? name : '';
  file.lastModifiedDate = lastModifiedDate ? lastModifiedDate : new Date();
  const event = jQuery.Event('change');
  event.target = {
    files: [file]
  };

  Ember.run(() => {
    this.$('.file-picker__input').trigger(event);
  });
};

const uploadFile = Ember.Test.registerAsyncHelper('uploadFile', function(app, content, name, lastModifiedDate) {
  const file = new Blob(
    content ? content : ['']
  );
  file.name = name ? name : '';
  file.lastModifiedDate = lastModifiedDate ? lastModifiedDate : new Date();

  return triggerEvent(
    '.file-picker__input',
    'change',
    { target: { files: [file] } }
  );
});

export { uploadFile };
export { uploadFileHelper };
