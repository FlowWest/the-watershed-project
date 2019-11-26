// might need path.join

module.exports = {
  transform: {
    "^.+\\.jsx?$": `${__dirname}/jest-preprocess.js`,
  },
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `${__dirname}/__mocks__/file-mock.js`,
  },
  moduleFileExtensions: ["test.js", "js", "json", "jsx", "ts", "tsx", "node"],
  testPathIgnorePatterns: [`node_modules`, `.cache`, `public`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
  globals: {
    __PATH_PREFIX__: ``,
  },
  testURL: `http://localhost:6001`,
  setupFiles: [`${__dirname}/loadershim.js`],
  setupFilesAfterEnv: [`${__dirname}/setup-test-env.js`],
}