import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { uploadFileHelper } from '../../helpers/ember-cli-file-picker';

moduleForComponent('file-picker', 'Integration | Component | file picker', {
  integration: true
});

test('it\'s testable', function(assert) {
  assert.expect(0);
  this.render(hbs`{{file-picker}}`);
  uploadFileHelper();
});
