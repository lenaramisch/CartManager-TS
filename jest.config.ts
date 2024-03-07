const esModules = ['@apollo/.*'].join('|');

module.exports = {
transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'ts-jest',
},
transformIgnorePatterns: [`/node_modules/(?!${esModules})`, '/node_modules/@apollo/client/utilities/utilities.cjs.js'],
testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
collectCoverageFrom: ['src/**/*', '!src/vendor/**'],
moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
testEnvironment: 'node',
preset: 'ts-jest/presets/js-with-ts',
globals: {
    'ts-jest': {
        tsconfig: 'tsconfig.test.json',
        },
    },
};
