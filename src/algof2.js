const flatten = require("lodash/flatten");
const time = [];

function stats(libraries, field) {
  const values = libraries.map(lib => lib[field]);
  values.sort((a, b) => a - b);
  let lowMiddle = Math.floor((values.length - 1) / 2);
  let highMiddle = Math.ceil((values.length - 1) / 2);
  let median = (values[lowMiddle] + values[highMiddle]) / 2;
  let sum = values.reduce((previous, current) => (current += previous));
  let avg = sum / values.length;
  console.log({
    lowMiddle,
    highMiddle,
    median,
    avg,
    min: Math.min(...values),
    max: Math.max(...values)
  });
}

let i = 0;
const libraryScore = (problem, lib) => {
  const signupByCapacity = lib.signupDuration / lib.shipCapacity;
  const scoreByCapacity =
    lib.books.reduce((score, idBook) => score + problem.scores[idBook], 0) /
    lib.shipCapacity;

  const byDay = [];
  for (let day = 0; day < problem.ndays - lib.signupDuration; day++) {
    byDay.push(
      lib.booskByScore
        .slice(0, lib.shipCapacity)
        .reduce((score, idBook) => problem.scores[idBook] + score, 0)
    );
    lib.booskByScore = lib.booskByScore.slice(lib.shipCapacity);
  }
  let sum = byDay.reduce((previous, current) => (current += previous));
  let avg = sum / byDay.length;

  return signupByCapacity / scoreByCapacity;
};

function main(problem, file) {
  let nextSignUpDay = 0;
  let waitingSignup = -1;
  let nextLibrary = 0;

  let libraryOpens = [];
  // console.log(problem)
  let libraries = [];
  const sortLibs = () => {
    libraries = problem.libraries
      // .sort((a, b) => b.shipCapacity - a.shipCapacity)
      // .sort((a, b) => a.signupDuration - b.signupDuration)
      .map((lib, index) => ({ ...lib, id: index }))
      .map(lib => ({
        ...lib,
        booskByScore: lib.books.sort(
          (a, b) => problem.scores[b] - problem.scores[a]
        )
      }))
      .map(lib => ({ ...lib, score: libraryScore(problem, lib) }))
      .sort((a, b) => a.score - b.score);
  };
  sortLibs();

  // console.log(stats(libraries, 'score'))
  // console.log(libraries.slice(0, 2))

  for (let day = 0; day < problem.ndays; day++) {
    // signup process
    if (nextSignUpDay === day && nextLibrary < libraries.length) {
      const library = libraries[nextLibrary];
      library.books = library.books.sort(
        (a, b) => problem.scores[b] - problem.scores[a]
      );
      nextSignUpDay = day + library.signupDuration;
      if (waitingSignup !== -1) {
        nextLibrary += 1;
        libraryOpens.push(libraries[waitingSignup]);
      }
      waitingSignup = nextLibrary;

      // resort after
      sortLibs()
    }

    // select book process
    libraryOpens.forEach(lib => {
      const nextBooks = lib.books.slice(lib.shipCapacity);
      lib.scannedBooks = (lib.scannedBooks || []).concat(nextBooks);
      // lib.scannedBooks = (lib.scannedBooks || []).concat(lib.books.slice((lib.scannedBooks || []).length, (lib.scannedBooks || []).length + lib.shipCapacity))

      // remove books in all libraries
      libraries.forEach(curr => {
        curr.books = curr.books.filter(b => !nextBooks.includes(b));
      });
    });
  }

  // basic output
  const result = libraryOpens.map(lib => [
    `${lib.id} ${lib.scannedBooks.length}`,
    lib.scannedBooks.join(" ")
  ]);

  return [libraryOpens.length, ...flatten(result)];
}

module.exports = main;
