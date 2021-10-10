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
        'no-underscore-dangle': ["error", { "allow": ["_id"] }],
        'require-await': 'error',
        'object-curly-spacing': ['error', 'always']
      }
     
};
