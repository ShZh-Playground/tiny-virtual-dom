const types = [
  '📦 build', 
  '⌚ ci', 
  '📖 docs', 
  '🎨 feat', 
  '🐛 fix', 
  '💻 perf', 
  '🌈 refactor', 
  '🚧 revert',
  '✨ style', 
  '🛡 test', 
  '⚙ chore'
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