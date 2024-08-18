const words = ["javascript", "programming", "hangman", "minigame"];
const games = {};

module.exports.config = {
  name: "hangman",
  version: "1.0.0",
  hasPermission: 0,
  credits: "CJ",
  description: "Play Hangman.",
  commandCategory: "games",
  usePrefix: true,
  allowPrefix: true,
  cooldowns: 5
};

function renderWord(word, guesses) {
  return word.split("").map(letter => (guesses.includes(letter) ? letter : "_")).join(" ");
}

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  if (!games[threadID]) {
    const word = words[Math.floor(Math.random() * words.length)];
    games[threadID] = {
      word,
      guesses: [],
      incorrectGuesses: 0
    };
    return api.sendMessage(`Hangman started! Guess a letter:\n${renderWord(word, [])}`, threadID, messageID);
  }

  const game = games[threadID];
  const guess = args[0];
  if (!guess || guess.length !== 1) return api.sendMessage(`Usage: hangman <letter>`, threadID, messageID);

  if (game.guesses.includes(guess)) return api.sendMessage(`You already guessed that letter!`, threadID, messageID);

  game.guesses.push(guess);
  if (!game.word.includes(guess)) game.incorrectGuesses++;

  const renderedWord = renderWord(game.word, game.guesses);
  if (renderedWord === game.word.split("").join(" ")) {
    api.sendMessage(`Congratulations! You guessed the word: ${game.word}`, threadID, messageID);
    delete games[threadID];
  } else if (game.incorrectGuesses >= 6) {
    api.sendMessage(`You lost! The word was: ${game.word}`, threadID, messageID);
    delete games[threadID];
  } else {
    api.sendMessage(`Incorrect guesses: ${game.incorrectGuesses}\n${renderedWord}`, threadID, messageID);
  }
};