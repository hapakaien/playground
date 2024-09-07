module.exports = {
	env: {
		es2021: true,
		node: true,
		jest: true,
	},
	extends: [
		'airbnb-base',
		'airbnb-typescript/base',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:prettier/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.eslint.json',
	},
	plugins: ['@typescript-eslint'],
	rules: {
		// typescript-eslint
		'@typescript-eslint/restrict-template-expressions': [
			'error',
			{
				allowNumber: true,
				allowBoolean: true,
				allowAny: true,
				allowNullish: true,
				allowRegExp: true,
			},
		],

		// import
		'import/prefer-default-export': 'off',
		'import/no-default-export': 'error',
		'import/no-cycle': 'off',
	},
};
