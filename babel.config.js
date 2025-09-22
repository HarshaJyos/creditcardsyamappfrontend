module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxRuntime: "automatic" }],
      "@babel/preset-react",
      "@babel/preset-typescript",
    ],
    plugins: ["@babel/plugin-syntax-jsx"],
  };
};
