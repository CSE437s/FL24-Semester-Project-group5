
module.exports = {
    parser: '@typescript-eslint/parser', 
    extends: [
        'eslint:recommended',
        'next/core-web-vitals',
        'plugin:@typescript-eslint/recommended', 
        'plugin:react/recommended',
        'plugin:next/recommended',
    ],
    settings: {
        react: {
            version: 'detect', 
        },
    },

};
