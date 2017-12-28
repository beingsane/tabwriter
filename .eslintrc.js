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
    "pixelToNumber": true,
    "scrollByAnimated": true,
    "logoURL": true,
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "quotes": ["warn", "single"]
  }
}
