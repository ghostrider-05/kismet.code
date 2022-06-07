export default {
    clearMocks: true,
    collectCoverage: true,
    //TODO: write tests for items
    collectCoverageFrom: [
        '**/*.js',
        '!src/items/actions/Classes/*.{js,ts}',
        '!src/items/conditions/Classes/*.{js,ts}',
        '!src/items/events/Classes/*.{js,ts}',
        '!src/structures/builders/*.{js,ts}',
        '!src/parser/run.{js,ts}',
        '!src/types/*.{js,ts}',
        '!src/test/**/*.{js,ts}',
        '!test/**/*.js',
    ],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    coverageThreshold: {
        global: {
            branches: 70,
            lines: 70,
            statements: 70,
        },
    },
    rootDir: './',
    roots: ['./src/', './test/'],
    testMatch: [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[tj]s?(x)',
    ],
    transform: {},
    verbose: true,
}
