import Ember from 'ember';

const {
  Component,
  computed,
  observer,
  run: {
    bind
  },
  String: {
    htmlSafe
  },
  assert,
  $
} = Ember;


export
default Component.extend({
  classNames: ['file-picker'],
  classNameBindings: ['multiple:multiple:single'],
  accept: '*',
  multiple: false,
  preview: true,
  dropzone: true,
  progress: true,
  readAs: 'readAsFile',
  selectOnClick: true,
  count: 0,
  errors: [],

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
    if (typeof(this.filesAreValid) === 'function') {
      if (!this.filesAreValid(files)) {
        return;
      }
    }

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
      'readAs method "' + readAs + '" not implemented', (reader[readAs] && readAs !== 'abort')
    );

    return new Ember.RSVP.Promise((resolve, reject) => {
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
        reject({
          event: 'onabort'
        });
      };

      reader.onerror = function(error) {
        reject({
          event: 'onerror',
          error: error
        });
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

  clearPreview: function() {
    this.$('.file-picker__preview').html('');
    this.hidePreview();
    this.$('.file-picker__dropzone').show();

    // reset
    this.set('removePreview', false);
  },

  removePreviewDidChange: observer('removePreview', function() {
    if (this.get('removePreview')) {
      this.clearPreview();
    }
  }),

  // handles DOM events
  // Trigger a input click to open file dialog
  click: function(event) {
    if (this.get('selectOnClick') === true) {
      if (!$(event.target).hasClass('file-picker__input')) {
        this.$('.file-picker__input').trigger('click');
      }
    }
  },
  /* Drag'n'Drop events */
  dragOver: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    event.dataTransfer.dropEffect = 'copy';
  },
  drop: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }

    this.handleFiles(event.dataTransfer.files);
    this.set('count', 0);
    this.$().removeClass('over');
  },
  dragEnter: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (!this.get('multiple')) {
      this.clearPreview();
    }
    var count = this.incrementProperty('count');
    if (count === 1) {
      this.$().addClass('over');
    }
  },
  dragLeave: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    var count = this.decrementProperty('count');
    if (count === 0) {
      this.$().removeClass('over');
    }
  }
});
