const path = require("path");

module.exports = {
	entry: {
		home: ["./scripts/home.ts"],
		login: ["./pages/login/script.ts"],
		register: ["./pages/registration/script.ts"],
		students: ["./pages/students/script.ts", "./pages/students/load.ts"],
		classrecords: ["./pages/classrecords/script.ts"],
		viewrecord: ["./pages/viewrecord/script.ts"],
		transmutation: ["./pages/transmutations/script.ts"],
		checkgrades: ["./pages/checkgrades/script.ts"],
	},
	output: {
		filename: "[name].bundle.js", // Output filename based on entry point name
		path: path.resolve(__dirname, "dist"), // Output directory
		publicPath: "/dist/",
	},
	resolve: {
		extensions: [".ts", ".js"], // Resolve TypeScript and JavaScript files
		alias: {
			flowbite: path.resolve(__dirname, "node_modules/flowbite"),
			"@scripts": path.resolve(__dirname, "./dist/js/scripts"), // Alias for common scripts folder
		},
	},
	module: {
		rules: [
			{
				test: /\.ts$/, // Apply the following loaders to TypeScript files
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
};
