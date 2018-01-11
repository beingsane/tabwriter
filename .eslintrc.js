module.exports = {
  "env": {
    "es6": true,
    "browser": true,
    "node": true,
    "jquery": true
  },
  "extends": "eslint:recommended",
  "globals": {
    "Clipboard": true,
    "jsPDF": true,
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "quotes": ["warn", "single"],
    "semi": ["error", "always"],
    "camelcase": ["error", {"properties": "always"}],
    "max-len": ["warn", {
      "code": 100,
      "ignoreUrls": true
    }]
  }
}
