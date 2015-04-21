import Ember from 'ember';

const {
  Component,
  computed,
  observer,
  run,
  assert
} = Ember;

const { bind } = run;
const { Promise } = Ember.RSVP;
const { htmlSafe } = Ember.String;

export default Component.extend({
  classNames: ['file-picker'],
  classNameBindings: ['multiple:multiple:single'],
  accept: '*',
  multiple: false,
  preview: true,
  dropzone: true,
  progress: true,
  readAs: 'readAsFile',

  progressStyle: computed('progressValue', function() {
    var width = this.get('progressValue') || 0;
    return htmlSafe('width: ' + width + '%;');
  }),

  /**
   * When the component got inserted
   */
  didInsertElement: function() {
    this.hideInput();
    this.hidePreview();
    this.hideProgress();

    this.$('.file-picker__input').on(
      'change', bind(this, 'filesSelected')
    );
  },

  willDestroyElement: function() {
    this.$('.file-picker__input').off(
      'change', bind(this, 'filesSelected')
    );
  },

  /**
   * When the file input changed (a file got selected)
   * @param  {Event} event The file change event
   */
  filesSelected: function(event) {
    this.handleFiles(event.target.files);
  },

  handleFiles: function(files) {
    // TODO implement
    // if (!this.isValidFileType(files)) {
    //   this.set('errors.fileTypeNotAllowed', true);
    //   return;
    // }
    
    if (this.get('preview')) {
      this.updatePreview(files);
    }
    
    if (this.get('multiple')) {
      this.sendAction('filesLoaded', files);
    } else {
      if (this.get('readAs') === 'readAsFile') {
        this.sendAction('fileLoaded', files[0]);
      } else {
        this.readFile(files[0], this.get('readAs'))
          .then((file) => {
            this.sendAction('fileLoaded', file);
          });
      }
    }
  },

  /**
   * Update preview
   * @param  {Array} files The selected files
   */
  updatePreview: function(files) {
    if (this.get('multiple')) {
      // TODO
    } else {
      this.clearPreview();
      this.$('.file-picker__progress').show();

      this.readFile(files[0], 'readAsDataURL')
        .then(bind(this, 'addPreviewImage'));

      this.$('.file-picker__dropzone').hide();
    }

    this.$('.file-picker__preview').show();
  },
  
  addPreviewImage: function(file) {
    var image = this.$(
      '<img src="' + file.data + '" class="file-picker__preview__image ' +
      (this.get('multiple') ? 'multiple' : 'single') + '">');

    this.hideProgress();
    this.$('.file-picker__preview').append(image);
  },

  /**
   * Reads a file 
   * @param {File} file A file
   * @param {String} readAs One of
   *  - readAsArrayBuffer
   *  - readAsBinaryString
   *  - readAsDataURL
   *  - readAsText
   * @return {Promise}
   */
  readFile: function(file, readAs) {
    const reader = new FileReader();

    assert(
      'readAs method "' + readAs + '" not implemented',
      (reader[readAs] && readAs !== 'abort')
    );

    return new Promise((resolve, reject) => {
      reader.onload = function(event) {
        resolve({
          // TODO rename to file / breaking change
          filename: file.name,
          type: file.type,
          data: event.target.result,
          size: file.size
        });
      };

      reader.onabort = function() {
        reject({ event: 'onabort' });
      };

      reader.onerror = function(error) {
        reject({ event: 'onerror', error: error });
      };

      reader.onprogress = (event) => {
        this.set('progressValue', event.loaded / event.total * 100);
      };

      reader[readAs](file);
    });
  },

  hideInput: function() {
    this.$('.file-picker__input').hide();
  },

  hidePreview: function() {
    this.$('.file-picker__preview').hide();
  },

  hideProgress: function() {
    this.$('.file-picker__progress').hide();
  },

  clearPreview: observer('removePreview', function() {
    if (this.get('removePreview')) {
      this.$('.file-picker__preview').html('');
      this.hidePreview();
      this.$('.file-picker__dropzone').show();

      // reset
      this.set('removePreview', false);
    }
  }),

  // handles DOM events
  eventManager: {
    // Trigger a input click to open file dialog
    click: function(event, view) {
      view.$('.file-picker__input').trigger('click');
    },
    dragOver: function(event, view) {
      if (event.preventDefault) {
        event.preventDefault();
      }

      event.dataTransfer.dropEffect = 'copy';
    },
    dragEnter: function(event, view) {
      if (!view.get('multiple')) {
        view.clearPreview();
      }

      view.$().addClass('over');
    },
    dragLeave: function(event, view) {
      view.$().removeClass('over');
    },
    drop: function(event, view) {
      if (event.preventDefault) {
        event.preventDefault();
      }

      view.handleFiles(event.dataTransfer.files);
    }
  }
});
