const types = [
  ':package: build', 
  ':watch: ci', 
  ':book: docs', 
  ':art: feat', 
  ':bug: fix', 
  ':computer: perf', 
  ':rainbow: refactor', 
  ':construction: revert',
  ':sparkles: style', 
  ':wrench: test', 
  ':hammer: chore'
];

module.exports = {
  extends: ['@commitlint/config-conventional'],

  rules: {
    'type-enum': [2, 'always', types],
    'header-case': [2, 'always', 'lower-case'],
    'body-case': [2, 'always', 'sentence-case'],
    'body-min-length': [2, 'always', 0]
  }
};