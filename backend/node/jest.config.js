/** @type {import('jest').Config} */
const config = {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	setupFiles: ['dotenv/config'],
	// globalTeardown: './__tests__/teardown.ts',
	testMatch: ['**/src/**/*.spec.ts', '**/__tests__/**/*.test.ts'],
	transform: {
		'^.+\\.(t|j)sx?$': '@swc/jest',
	},
};

module.exports = config;
