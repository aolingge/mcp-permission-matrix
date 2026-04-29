import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { checkFile, formatAnnotations, formatMarkdown, formatSarif } from '../src/check.js';

test('good fixture scores higher than weak fixture', () => {
  const good = checkFile('fixtures/good.txt');
  const weak = checkFile('fixtures/weak.txt');
  assert.equal(good.score, 100);
  assert.ok(weak.score < good.score);
});

test('realistic fixture is usable for CI threshold', () => {
  const report = checkFile('fixtures/realistic.txt');
  assert.ok(report.score >= 75);
});

test('report formats are generated', () => {
  const report = checkFile('fixtures/weak.txt');
  assert.match(formatMarkdown(report), /Score:/);
  assert.match(formatAnnotations(report), /warning|^$/);
  assert.equal(formatSarif(report).version, '2.1.0');
});

test('GitHub Actions examples include minimal and reporting integrations', () => {
  const minimal = fs.readFileSync('examples/github-action.yml', 'utf8');
  const reporting = fs.readFileSync('examples/github-action-reporting.yml', 'utf8');

  assert.match(minimal, /npm run check/);
  assert.match(reporting, /--annotations/);
  assert.match(reporting, /--markdown/);
  assert.match(reporting, /--sarif/);
  assert.match(reporting, /github\/codeql-action\/upload-sarif@v3/);
  assert.match(reporting, /GITHUB_STEP_SUMMARY/);
});
