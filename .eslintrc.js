module.exports = {
    root: true,
    "env": {
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "no-undef": "off",
        "jest/no-mocks-import": "off",
        "jest/no-try-expect": "off",
        "jest/no-jasmine-globals": "off",
        "jest/expect-expect": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "promise/always-return": "off"
    }
};
