import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { uploadFileHelper } from '../../helpers/ember-cli-file-picker';

const {
  run
} = Ember;

moduleForComponent('file-picker', 'Integration | Component | file picker', {
  integration: true
});

test('it\'s testable', function(assert) {
  assert.expect(3);

  // test double for the external action
  this.set('externalAction', (actual) => {
    const {
      size,
      type,
      name
    } = actual;

    assert.equal(size, 4, 'has a size of 4');
    assert.equal(type, 'text/plain', 'has a type of text/plain');
    assert.equal(name, 'test.txt', 'has the correct name');
  });

  this.render(hbs`{{file-picker fileLoaded=(action externalAction)}}`);

  run(() => {
    uploadFileHelper(['test']);
  });
});
