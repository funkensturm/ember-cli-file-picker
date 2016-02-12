import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | index');

test('Works for readAsFile', function(assert) {
  visit('/');

  uploadFile(
    ['file content'],
    'file.name'
  );

  andThen(function() {
    assert.equal(find('dl .size').text(), 'file content'.length);
    assert.equal(find('dl .name').text(), 'file.name');
  });
});

test('Works for readAsText', function(assert) {
  visit('/');

  fillIn('select', 'readAsText');

  uploadFile(
    ['file content'],
    'file.name'
  );

  andThen(function() {
    assert.equal(find('dl .size').text(), 'file content'.length);
    assert.equal(find('dl .name').text(), 'file.name');
    assert.equal(find('dl .data').text(), 'file content');
  });
});
