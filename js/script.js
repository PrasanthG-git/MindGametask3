function createElement(tagName, attributes, textContent = "") {
  const element = document.createElement(tagName);
  for (let attribute in attributes) {
    element.setAttribute(attribute, attributes[attribute]);
  }
  element.textContent = textContent;
  return element;
}

let timerInterval = null;
let startTime = null;

function initializeGame() {
  const imagearr = [
    { name: "apple", img: "./public/apple.jpg" },
    { name: "orange", img: "./public/orange.jpg" },
    { name: "guava", img: "./public/guava.jpg" },
    { name: "grape", img: "./public/grape.jpg" },
    { name: "mango", img: "./public/mango.jpg" },
    { name: "pineapple", img: "./public/pineapple.jpg" },
    { name: "pomegranate", img: "./public/pomegranate.jpg" },
    { name: "watermelon", img: "./public/watermelon.jpg" },
  ];

  let gameGrid = imagearr.concat(imagearr);
  gameGrid = gameGrid.sort(() => 0.5 - Math.random());

  let firstGuess = "";
  let secondGuess = "";
  let count = 0;
  let previousTarget = null;
  let delay = 1200;
  let isChecking = false;
  let matchesFound = 0;
  const totalPairs = imagearr.length;

  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = ""; // Clear the game board for resetting

  // Timer setup
  startTime = new Date().getTime();
  const timerElement = document.getElementById("timer");

  const updateTimer = () => {
    const currentTime = new Date().getTime();
    const timeTaken = Math.floor((currentTime - startTime) / 1000);
    timerElement.textContent = `Time: ${timeTaken}s`;
  };

  if (timerInterval) {
    clearInterval(timerInterval);
  }
  timerInterval = setInterval(updateTimer, 1000);

  const resetGuesses = () => {
    firstGuess = "";
    secondGuess = "";
    count = 0;
    previousTarget = null;
    isChecking = false;

    const selectedCards = document.querySelectorAll(".selected");
    selectedCards.forEach((card) => {
      card.classList.remove("selected");
      card.querySelector("img").style.visibility = "hidden";
    });
  };

  const checkForMatch = () => {
    const selectedCards = document.querySelectorAll(".selected");
    if (firstGuess === secondGuess) {
      selectedCards.forEach((card) => {
        setTimeout(() => {
          card.remove(); // Remove matched cards from the DOM
        }, 500);
      });
      matchesFound++;
      if (matchesFound === totalPairs) {
        clearInterval(timerInterval);
        const totalTime = timerElement.textContent;
        setTimeout(() => {
          alert(`Congratulations! You found all the matches in ${totalTime}`);
        }, delay);

        // Show reset button after the game is completed
        document.getElementById("reset-button").style.display = "block";
      }
      isChecking = false;
    } else {
      setTimeout(resetGuesses, delay);
    }
  };

  const handleCardClick = (event) => {
    const clicked = event.target;

    if (
      isChecking ||
      clicked.nodeName === "SECTION" ||
      clicked === previousTarget ||
      clicked.parentNode.classList.contains("selected") ||
      clicked.parentNode.classList.contains("match")
    ) {
      return;
    }

    clicked.parentNode.classList.add("selected");
    clicked.parentNode.querySelector("img").style.visibility = "visible";

    if (count === 0) {
      firstGuess = clicked.parentNode.getAttribute("data-name");
      count++;
      previousTarget = clicked;
    } else {
      secondGuess = clicked.parentNode.getAttribute("data-name");
      count++;

      if (firstGuess && secondGuess) {
        isChecking = true;
        setTimeout(checkForMatch, delay);
      }
    }
  };

  gameGrid.forEach((item) => {
    const card = createElement("div", {
      class: "card",
      "data-name": item.name,
    });

    const front = createElement("div", { class: "front" });
    const back = createElement("div", { class: "back" });
    const img = createElement("img", { src: item.img, alt: item.name });
    img.style.visibility = "hidden"; // Hide the image initially

    back.appendChild(img);
    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener("click", handleCardClick);

    gameBoard.appendChild(card);
  });

  // Hide reset button during game play
  document.getElementById("reset-button").style.display = "none";
}

// Reset function to restart the game without refreshing the page
function resetGame() {
  initializeGame();
}

// Initialize game on page load
window.onload = () => {
  initializeGame();
};
