var remote = require('electron').remote;

var letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var numbers = ['0','1','2','3','4','5','6','7','8','9'];
var colors = ['#b22222', '#ff8c00', '#808000', '#32cd32', '#9400d3', '#ffd700', '#008b8b', '#0000ff', '#ff69b4'];
var correctMessages = ["That's it!", "Good job!", "You're doing great!", "That's right!", "You did it!", "Yes!", "Very good!", "Good work!"];
var incorrectMessage = 'Incorrect!';
var findMessages = {};

var mode;
var characterCount = 3;
var rounds = 0;
var clicksEnabled = true;
var speakMessages = true;

switch (remote.process.argv.length) {
  case 3:
    if (remote.process.argv[2] == 'quiet') {
      speakMessages = false;
    } else {
      mode = remote.process.argv[2];
    }
    break;
  case 4:
    if (remote.process.argv[3] == 'quiet') speakMessages = false;
    mode = remote.process.argv[2];
    break;
}

window.onload = function() {
  startMenu();
};

var el = document.getElementById('letters');
el.setAttribute('class', 'letters-container');

var list = document.createElement('ul');
list.setAttribute('class', 'letters-list');
el.appendChild(list);

if (speakMessages) {
  for (var i = 0; i < letters.length; i++) {
    findMessages[letters[i]] = new Audio('assets/sounds/letter'+letters[i]+'.mp3');
  }
  for (var i = 0; i < numbers.length; i++) {
    findMessages[numbers[i]] = new Audio('assets/sounds/number'+numbers[i]+'.mp3');
  }
  correctMessages = [];
  for (var i = 0; i < 8; i++) {
    correctMessages.push(new Audio('assets/sounds/correct'+i+'.mp3'));
  }
  incorrectMessage = new Audio('assets/sounds/incorrect.ogg');
} else {
  for (var i = 0; i < letters.length; i++) {
    findMessages[letters[i]] = 'Find the letter '+letters[i];
  }
  for (var i = 0; i < numbers.length; i++) {
    findMessages[numbers[i]] = 'Find the number '+numbers[i];
  }

  var msg = document.createElement('p');
  msg.setAttribute('class', 'letters-msg');
  document.body.appendChild(msg);
}


function startMenu() {
  var modes = ['letters', 'numbers', 'both'];
  if (mode) {
    nextRound();
    return;
  }

  for (var i = 0; i < modes.length; i++) {
    var menuItem = document.createElement('li');
    menuItem.setAttribute('data-mode', modes[i]);
    menuItem.setAttribute('style', 'color:'+randomColor()+';');

    var image = document.createElement('img');
    image.setAttribute('src', 'assets/images/'+modes[i]+'.png');
    image.setAttribute('alt', modes[i]);
    menuItem.appendChild(image);

    menuItem.addEventListener('click', function() {
      mode = this.getAttribute('data-mode');
      nextRound();
    });

    list.appendChild(menuItem);
  } 
}


function nextRound() {
  var characters = [];
  var characterPool = buildCharacterPool();
console.log(characterPool);
  if (characterCount < characterPool.length && characterCount < 24) {
    rounds--;
    if (rounds < 1) {
      characterCount++;
      rounds = getRandomInt(4) + 2;
    }
  }

  for (var i = 0; i < characterCount; i++) {
    var characterIndex = getRandomInt(characterPool.length);
    characters.push(characterPool[characterIndex]);
    characterPool.splice(characterIndex, 1);
  }

  var listClass = list.getAttribute('class');
  if (characterCount > 8) list.setAttribute('class', listClass+' more');
  if (characterCount > 15) list.setAttribute('class', listClass+' most');

  startRound(characters);
}


function startRound(characters) {
  var requestedCharacter = randomCharacterFrom(characters);

  while (list.firstChild) list.removeChild(list.firstChild);

  for (var i = 0; i < characters.length; i++) {
    var letterItem = document.createElement('li');
    letterItem.setAttribute('data-letter', characters[i]);
    letterItem.setAttribute('style', 'color:'+randomColor()+';');
    letterItem.textContent = characters[i];

    letterItem.addEventListener('click', function() {
      if (!clicksEnabled) return;

      clicksEnabled = false;
      var selectedCharacter = this.getAttribute('data-letter');
      this.setAttribute('class', 'clicked');

      if (selectedCharacter == requestedCharacter) {
        sayCorrectMessage(function() {
          setTimeout(function() {
            nextRound();
          }, 1500);
        });
      } else {
        sayMessage(incorrectMessage, function() {
          setTimeout(function() {
            clicksEnabled = true;
            sayFindMessageFor(requestedCharacter);
          }, 1000);
        });
      }
    });

    list.appendChild(letterItem);
  }

  clicksEnabled = true;
  sayFindMessageFor(requestedCharacter);
}


function randomColor() {
  return colors[getRandomInt(colors.length)];
}

function randomCharacterFrom(characters) {
  return characters[getRandomInt(characters.length)];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function buildCharacterPool() {
  var pool;

  switch (mode) {
    case 'both':
      pool = letters.concat(numbers);
      break;
    case'numbers':
      pool = numbers.slice(0);
      break;
    case 'letters':
    default:
      pool = letters.slice(0);
  }

  return pool;
}

function sayFindMessageFor(character, callback) {
  sayMessage(findMessages[character], callback);
}

function sayCorrectMessage(callback) {
  sayMessage(correctMessages[getRandomInt(correctMessages.length)], callback);
}

function sayMessage(message, callback) {
  if (speakMessages) {
    message.onended = null;
    if (callback) message.onended = callback;
    message.play();
  } else {
    msg.textContent = message;
    if (callback) callback();
  }
}
