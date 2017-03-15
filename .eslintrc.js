module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'import',
    'react'
  ],
  env: {
    es6: true,
    browser: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:react/recommended'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off'
  },
  settings: {
    'import/ignore': [
      'node_modules',
      '.(json|css|svg|png)$'
    ]
  }
}
