const path = require("path");

module.exports = {
  entry: {
    login: ["./pages/login/script.ts", "./pages/login/load.ts"],
    register: ["./pages/registration/script.ts"],
    students: ["./pages/students/script.ts", "./pages/students/load.ts"],
    classrecords: [
      "./pages/classrecords/script.ts",
      "./pages/classrecords/load.ts",
    ],
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
      "@scripts": path.resolve(__dirname, "./scripts"), // Alias for common scripts folder
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
