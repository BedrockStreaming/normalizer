module.exports = api => {
  return {
    presets: [
      [
        "@babel/preset-env",
        api.env("test")
          ? { targets: { node: "current" } }
          : {
              targets: {
                node: "10"
              }
            }
      ]
    ]
  };
};
