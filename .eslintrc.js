module.exports = {
    root: true,
    env: {
        "jest/globals": true
    },
    extends: [
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:jest/recommended",
        "plugin:promise/recommended",
        "plugin:json/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        "ecmaVersion": 2018,
        "sourceType": "module",
        "project": "./tsconfig.json"
    },
    plugins: [
        "@typescript-eslint",
        "jest",
        "promise",
        "json"
    ],
    rules: {
        "quote-props": "off",
        "comma-dangle": "off",
        "operator-linebreak": "off",
        "import/prefer-default-export": "off",
        "import/order": "off",
        "import/no-extraneous-dependencies": "off",
        "implicit-arrow-linebreak": "off",
        "import/newline-after-import": "off",
        "class-methods-use-this": "off",
        "arrow-parens": "off",
        "arrow-body-style": "off",
        "no-restricted-syntax": "off",
        "no-restricted-properties": "off",
        "no-plusplus": "off",
        "newline-per-chained-call": "off",
        "no-case-declarations": "off",
        "@typescript-eslint/no-useless-constructor": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/prefer-interface": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-member-accessibility": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/ban-types": "off",

        "max-len": [ "error", { "code": 120 } ],
        "no-console": [ "error" ],
        "semi": [ "error", "always" ],
        "array-bracket-spacing": [ "error", "always" ],
        "object-curly-spacing": [ "error", "always" ],
        "object-curly-newline": [ "error", { "consistent": true, "minProperties": 9 } ],
        "no-underscore-dangle": [ "error", { "allow": [ "_id" ] } ],
        "no-return-await": "warn",
        "no-await-in-loop": "warn",
        "@typescript-eslint/indent": [ "error", 2 ],
        "@typescript-eslint/explicit-function-return-type": [ "warn", {
            "allowExpressions": true,
            "allowTypedFunctionExpressions": true
        } ], // allowExpressions=true applies to closures only, not function declaration
        "@typescript-eslint/ban-ts-comment": "warn",
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "warn",
        "jest/no-identical-title": "error",
        "jest/valid-expect": "error",
        "jest/valid-expect-in-promise": "error",
        // https://github.com/xjamundx/eslint-plugin-promise/blob/master/docs/rules/always-return.md
        "promise/always-return": "warn",
        "prefer-destructuring": [ "error", { "VariableDeclarator": { "array": false, "object": true } } ],

        "quotes": "off",
        "@typescript-eslint/quotes": [ "error", "double" ],
        // https://github.com/typescript-eslint/typescript-eslint/issues/2447
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": [ "error", {
            ignoreTypeValueShadow: true
        } ],
    }
};
