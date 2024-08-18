const choices = ["rock", "paper", "scissors"];

module.exports.config = {
  name: "rps",
  version: "1.0.0",
  hasPermission: 0,
  credits: "CJ",
  description: "Play Rock-Paper-Scissors.",
  commandCategory: "games",
  usePrefix: true,
  allowPrefix: true,
  cooldowns: 5
};

function determineWinner(userChoice, botChoice) {
  if (userChoice === botChoice) return "It's a tie!";
  if ((userChoice === "rock" && botChoice === "scissors") ||
      (userChoice === "scissors" && botChoice === "paper") ||
      (userChoice === "paper" && botChoice === "rock")) {
    return "You win!";
  }
  return "You lose!";
}

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  if (!args.length) return api.sendMessage(`Usage: rps <rock/paper/scissors>`, threadID, messageID);

  const userChoice = args[0].toLowerCase();
  if (!choices.includes(userChoice)) return api.sendMessage(`Invalid choice!`, threadID, messageID);

  const botChoice = choices[Math.floor(Math.random() * choices.length)];
  const result = determineWinner(userChoice, botChoice);
  api.sendMessage(`You chose ${userChoice}, I chose ${botChoice}. ${result}`, threadID, messageID);
};