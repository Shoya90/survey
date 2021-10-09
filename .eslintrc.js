module.exports = {
    "env": {
        "commonjs": true,
        "es2021": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
        'no-console': 'off',
        'no-underscore-dangle': ["error", { "allow": ["_id", "_source", "_test"] }],
        'import/no-unresolved': 'off',
        'import/extensions': 'off',
        'require-await': 'error',
        'no-return-await': 'off'
      }
     
};
