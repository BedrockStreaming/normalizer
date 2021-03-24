module.exports = {
  automock: true,
  unmockedModulePathPatterns: [
    "^[a-z].*$",
    "/node_modules/"
  ],
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!lodash-es)"]
};
