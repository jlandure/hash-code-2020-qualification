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
        libraryOpens.push(waitingSignup)
      }
      nextLibrary += 1
      waitingSignup = nextLibrary
    }

    // select book process



    console.log({
      day, 
      nextSignUpDay,
      waitingSignup,
      libraryOpens,
      nextLibrary,
    })
  }

  return []
}

module.exports = main
