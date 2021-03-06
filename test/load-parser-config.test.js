import test from 'ava';
import SemanticReleaseError from '@semantic-release/error';
import loadParserConfig from './../lib/load/parser-config';

/**
 * AVA macro to verify that `loadParserConfig` return a parserOpts object.
 *
 * @method loadPreset
 * @param {Object} t AVA assertion library.
 * @param {[type]} preset the `conventional-changelog` preset to test.
 */
async function loadPreset(t, preset) {
  t.truthy((await loadParserConfig({preset})).headerPattern);
}
loadPreset.title = (providedTitle, preset) => `${providedTitle} Load "${preset}" preset`.trim();

/**
 * AVA macro to verify that `loadParserConfig` return a parserOpts object.
 *
 * @method loadPreset
 * @param {Object} t AVA assertion library.
 * @param {[type]} config the `conventional-changelog` config to test.
 */
async function loadConfig(t, config) {
  t.truthy((await loadParserConfig({config: `conventional-changelog-${config}`})).headerPattern);
}
loadConfig.title = (providedTitle, config) => `${providedTitle} Load "${config}" config`.trim();

test('Load "conventional-changelog-angular" by default', async t => {
  t.deepEqual(await loadParserConfig({}), (await require('conventional-changelog-angular')).parserOpts);
});

test('Accept a "parserOpts" object as option', async t => {
  const customParserOpts = {headerPattern: /^##(.*?)## (.*)$/, headerCorrespondence: ['tag', 'shortDesc']};
  const parserOpts = await loadParserConfig({parserOpts: customParserOpts});

  t.is(customParserOpts.headerPattern, parserOpts.headerPattern);
  t.deepEqual(customParserOpts.headerCorrespondence, parserOpts.headerCorrespondence);
  t.falsy(parserOpts.noteKeywords);
});

test('Accept a partial "parserOpts" object as option that overlaod a preset', async t => {
  const customParserOpts = {headerPattern: /^##(.*?)## (.*)$/, headerCorrespondence: ['tag', 'shortDesc']};
  const parserOpts = await loadParserConfig({parserOpts: customParserOpts, preset: 'angular'});

  t.is(customParserOpts.headerPattern, parserOpts.headerPattern);
  t.deepEqual(customParserOpts.headerCorrespondence, parserOpts.headerCorrespondence);
  t.truthy(parserOpts.noteKeywords);
});

test('Accept a partial "parserOpts" object as option that overlaod a config', async t => {
  const customParserOpts = {headerPattern: /^##(.*?)## (.*)$/, headerCorrespondence: ['tag', 'shortDesc']};
  const parserOpts = await loadParserConfig({parserOpts: customParserOpts, config: 'conventional-changelog-angular'});

  t.is(customParserOpts.headerPattern, parserOpts.headerPattern);
  t.deepEqual(customParserOpts.headerCorrespondence, parserOpts.headerCorrespondence);
  t.truthy(parserOpts.noteKeywords);
});

test(loadPreset, 'angular');
test(loadConfig, 'angular');
test(loadPreset, 'atom');
test(loadConfig, 'atom');
test(loadPreset, 'ember');
test(loadConfig, 'ember');
test(loadPreset, 'eslint');
test(loadConfig, 'eslint');
test(loadPreset, 'express');
test(loadConfig, 'express');
test(loadPreset, 'jshint');
test(loadConfig, 'jshint');

test('Throw "SemanticReleaseError" if "config" doesn`t exist', async t => {
  const error = await t.throws(
    loadParserConfig({config: 'unknown-config'}),
    /Config: "unknown-config" does not exist:/
  );

  t.true(error instanceof SemanticReleaseError);
  t.is(error.code, 'MODULE_NOT_FOUND');
});

test('Throw "SemanticReleaseError" if "preset" doesn`t exist', async t => {
  const error = await t.throws(
    loadParserConfig({preset: 'unknown-preset'}),
    /Preset: "unknown-preset" does not exist:/
  );

  t.true(error instanceof SemanticReleaseError);
  t.is(error.code, 'MODULE_NOT_FOUND');
});
