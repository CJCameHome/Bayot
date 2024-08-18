const games = {};

module.exports.config = {
  name: "guess",
  version: "1.0.0",
  hasPermission: 0,
  credits: "CJ",
  description: "Guess the number I'm thinking of.",
  commandCategory: "games",
  usePrefix: true,
  allowPrefix: true,
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  if (!games[threadID]) {
    games[threadID] = {
      number: Math.floor(Math.random() * 100) + 1,
      guesses: 0
    };
    return api.sendMessage(`I'm thinking of a number between 1 and 100. Try to guess it!`, threadID, messageID);
  }

  const game = games[threadID];
  const guess = Number(args[0]);
  game.guesses++;
  
  if (guess === game.number) {
    api.sendMessage(`Correct! It took you ${game.guesses} guesses.`, threadID, messageID);
    delete games[threadID];
  } else if (guess < game.number) {
    api.sendMessage(`Too low! Try again.`, threadID, messageID);
  } else {
    api.sendMessage(`Too high! Try again.`, threadID, messageID);
  }
};