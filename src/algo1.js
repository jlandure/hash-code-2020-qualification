const flatten = require('lodash/flatten')
const time = []

function stats (problem, field) {
  const values = problem.libraries.map(lib => lib[field])
  values.sort((a, b) => a - b);
  let lowMiddle = Math.floor((values.length - 1) / 2);
  let highMiddle = Math.ceil((values.length - 1) / 2);
  let median = (values[lowMiddle] + values[highMiddle]) / 2;
  let sum = values.reduce((previous, current) => current += previous);
  let avg = sum / values.length;
  console.log({ lowMiddle, highMiddle, median, avg, min: Math.min(...values), max: Math.max(...values) })
}

function main(problem, file) {
  let nextSignUpDay = 0;
  let waitingSignup = -1;
  let nextLibrary = 0
  
  let libraryOpens = [];
  // console.log(problem)
  stats(problem, 'nbooks')
  

  for (let day = 0; day < problem.ndays; day++) {
    // signup process
    if (nextSignUpDay === day && nextLibrary < problem.libraries.length) {
      const library = problem.libraries[nextLibrary];
      nextSignUpDay = day + library.signupDuration; 
      if (waitingSignup !== -1) {
        nextLibrary += 1
        libraryOpens.push(waitingSignup)
      }
      waitingSignup = nextLibrary
    }

    // select book process
    libraryOpens.forEach(lib => {
      if (!problem.libraries[lib].scannedBooks) {
        problem.libraries[lib].scannedBooks = problem.libraries[lib].books
      }
      // problem.libraries[lib].scannedBooks = [...new Set([].concat(problem.libraries[lib].scannedBooks || []).concat(problem.libraries[lib].books))]
    })

    // console.log({
    //   day, 
    //   nextSignUpDay,
    //   waitingSignup,
    //   libraryOpens,
    //   nextLibrary,
    //   scanned: libraryOpens.map(lib => problem.libraries[lib].scannedBooks),
    // })
  }
  
  // basic output 
  const result = libraryOpens.map((lib) => [
    `${lib} ${problem.libraries[lib].scannedBooks.length}`,
    problem.libraries[lib].scannedBooks.join(' ')
  ])

  return [
    libraryOpens.length,
    ...flatten(result)
  ]
}

module.exports = main
