const flatten = require('lodash/flatten')
const time = []

function main(problem, file) {
  let nextSignUpDay = 0;
  let waitingSignup = -1;
  let nextLibrary = 0
  
  let libraryOpens = [];

  for (let day = 0; day < problem.ndays; day++) {
    // signup process
    if (nextSignUpDay === day && nextLibrary < problem.nlibraries) {
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
      problem.libraries[lib].scannedBooks = [...new Set([].concat(problem.libraries[lib].scannedBooks || []).concat(problem.libraries[lib].books))]
    })

    console.log({
      day, 
      nextSignUpDay,
      waitingSignup,
      libraryOpens,
      nextLibrary,
      scanned: libraryOpens.map(lib => problem.libraries[lib].scannedBooks),
    })
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
