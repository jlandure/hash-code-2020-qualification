const _ = require("lodash/fp");
const assert = require("assert");
const debug = require("debug")("read");
const fs = require("fs");
const jolicitron = require("jolicitron");

module.exports = function read(filePath) {
  const cachedFile = `${filePath.split(".")[0]}.in.json`;
  try {
    fs.accessSync(cachedFile);
    debug(`using cached ${cachedFile}`);
  } catch (err) {
    if (err.code === "ENOENT") {
      debug(
        `not using cached input file because it does not exist at: ${cachedFile}`
      );
    } else {
      debug(`not using cached input file because:`, err);
    }
    const textFromInputFile = fs.readFileSync(filePath, "utf8");
    debug(`read ${textFromInputFile.length} chars from ${filePath}`);
    const result = module.exports.parse(textFromInputFile);
    fs.writeFileSync(cachedFile, JSON.stringify(result));
    debug(`written cached input file to ${cachedFile}`);
    return result;
  }
  return require(`./${cachedFile}`);
};

const parse = inputText => {
  const { parsedValue } = jolicitron((save, n) => [
    save("nbooks"),
    save("nlibraries"),
    "ndays",
    n("scores", { length: "nbooks" }),
    n(
      "libraries",
      { length: "nlibraries" },
      save("nbooks"),
      "signupDuration",
      "shipCapacity",
      n("books", { length: "nbooks" })
    )
  ])(inputText);
  debug("end");
  return parsedValue;
};

const assertValid = _.tap(parserOutput => {});

const parseAndValidate = _.flow(
  parse,
  assertValid,
  _.tap(() => debug("parsing completed"))
);

module.exports.parse = parse;
