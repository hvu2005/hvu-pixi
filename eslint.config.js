

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: "lastest",
      sourceType: 'module'
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '**/three.alias.js',
            '**/three.alias'
          ],
          paths: [
            {
              name: 'three.alias.js',
              message: 'Hãy import từ "@three.alias" thay vì trực tiếp từ file three.alias.js.'
            }
          ]
        }
      ]
    }
  }
];
