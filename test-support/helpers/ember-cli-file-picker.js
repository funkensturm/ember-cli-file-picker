import Ember from 'ember';
/* global Blob, jQuery */
const uploadFileHelper = function(app, content, name, lastModifiedDate) {
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

const uploadFile = Ember.Test.registerAsyncHelper('uploadFile', uploadFileHelper);

export { uploadFile };
export { uploadFileHelper };
