import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['file-picker'],
  classNameBindings: ['multiple:multiple:single'],
  accept: '*',
  multiple: false,
  preview: true,
  dropzone: true,

  /**
   * When the component got inserted
   */
  didInsertElement: function() {
    this.hideInput();
    this.hidePreview();

    this.$('.file-picker__input').on(
      'change', this.filesSelected.bind(this)
    );
  },

  willDestroyElement: function() {
    this.$('.file-picker__input').off(
      'change', this.fileSelected.bind(this)
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
      this.sendAction('fileLoaded', files[0]);
    }
  },

  /**
   * Update preview
   * @param  {Array} files The selected files
   */
  updatePreview: function(files) {
    if (this.get('multiple')) {
      // TODOD
    } else {
      this.clearPreview();

      this.readFile(files[0], 'readAsDataURL')
        .then(this.addPreviewImage.bind(this));

      this.$('.file-picker__dropzone').hide();
    }

    this.$('.file-picker__preview').show();
  },
  
  addPreviewImage: function(file) {
    var image = this.$(
      '<img src="' + file.content + '" class="file-picker__preview__image ' +
      (this.get('multiple') ? 'multiple' : 'single') + '">');

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
    var reader = new FileReader();

    Ember.assert(
      'readAs method "' + readAs + '" not implemented',
      (reader[readAs] && readAs !== 'abort')
    );

    return new Ember.RSVP.Promise(function(resolve, reject) {
      reader.onload = function(event) {
        resolve({ content: event.target.result });
      };

      reader.onabort = function() {
        reject({ event: 'onabort' });
      };

      reader.onerror = function(error) {
        reject({ event: 'onerror', error: error });
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
  
  clearPreview: function() {
    this.$('.file-picker__preview').html('');
    this.hidePreview();
  },

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
        view.$('.file-picker__dropzone').show();
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
