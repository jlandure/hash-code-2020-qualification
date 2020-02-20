const debug = require('debug')('solve')
const _ = require('lodash')
const gridUtils = require('./grid-utils')

const algo = require('./src/algo1');

function solve(problem, file) {
  return algo(problem, file);
}

//module.exports = solve;
module.exports = solve
