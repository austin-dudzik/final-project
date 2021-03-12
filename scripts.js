// Set collection type points
let humanPoints = 0;
let cowPoints = 0;
let chickenPoints = 0;

// Define variable
let numberRerolls;

// Assign functions to buttons
$("button#startTurn").click(startTurn);
$("button#reroll").click(reroll);
$("button#endTurn").click(endTurn);
$("button#scoreHumans").click(scoreHumans);
$("button#scoreCows").click(scoreCows);
$("button#scoreChickens").click(scoreChickens);

// Define each type of die face
let faces = ["", "tank", "raygun", "raygun", "human", "cow", "chicken"];

// Define dice array
let dice = [];

// Capitalize first letter of string
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

$(document).ready(function() {

  // Start the turn
  startTurn();

  // Add point and reroll values to page
  $("span#humanPoints").text(humanPoints);
  $("span#cowPoints").text(cowPoints);
  $("span#chickenPoints").text(chickenPoints);

  $("span#numberRerolls").text(numberRerolls);


});

// Function to get random die face
function getRandomDieFace() {
  // Generate random number between 1 and 6
  let randomDie = (Math.floor(Math.random() * 6) + 1);
  // Return value from array that matches rand number
  return faces[randomDie];
}

// Create die object function
function createDieObject(index) {

  // Define variable for random die
  let dieFace = getRandomDieFace();

  // Define variable
  let isHeld;

  // If die face is tank
  if (dieFace === "tank") {
    isHeld = true;
  } else {
    // If die face is not tank
    isHeld = false;
  }

  // Define and return the generated object
  let results = {
    face: dieFace,
    held: isHeld,
    toggleHeld: function() {
      this.held = !this.held;
    }
  };

  // Add values into array at specific index
  dice.splice(index, 1, results);

}


function sortDice(a, b) {

  // If a and b are equal
  if (a.held === b.held) {

    // Sort alphabetically by face name
    if (a.face < b.face) {
      return -1;
    } else if (a.face > b.face) {
      return 1;
    } else {
      return 0;
    }

  } else {

    // Sort by true/false
    if (a.held > b.held) {
      return -1;
    } else if (a.held < b.held) {
      return 1;
    } else {
      return 0;
    }

  }

};



function rollAllDice() {

  // Create new die at each index
  for (let i = 0; i < dice.length; i++) {
    createDieObject(i);
  }

}

function drawDie(index) {
  $(this).toggleClass("held");
}

function drawAllDice() {

  dice.sort(sortDice);

  for (let i = 0; i < dice.length; i++) {
    createDieObject(i);
  }

}

function toggleHeld(event) {
  // Get die id from parameter and toggle held function
  dice[event.data.param].toggleHeld();
}

function startTurn() {

  numberRerolls = 2;

  $("button#startTurn").hide();
  $("button#reroll").show();
  $("button#endTurn").show();

  $("span#numberRerolls").text(numberRerolls);

  // Hide buttons on page load
  $("button#scoreHumans").hide();
  $("button#scoreCows").hide();
  $("button#scoreChickens").hide();

  $("div#gameArea").empty();

  // Generate 13 random dice on load
  for (let i = 0; i < 13; i++) {

    // Create die with index
    createDieObject(i);

    // Add a new piece to the page
    $("<div>").attr("id", i).addClass("piece").appendTo("#gameArea");

    // If die happens to be tank
    if (dice[i].face === "tank") {
      $(`div#${i}`).addClass("held tank");
    }

    // Append image to new piece and set alt text
    $("<img>").attr({
      src: `img/${dice[i].face}.png`,
      alt: capitalize(dice[i].face)
    }).appendTo(`div#${i}`);

    // Append name of die to piece
    $("<p>").text(capitalize(dice[i].face)).appendTo(`div#${i}`);


    $(`div#${i}`).bind('click', {
      param: i
    }, toggleHeld);


  }

  // Perform when die is clicked
  $(".piece").click(drawDie);

  // Put dice in order
  //dice.sort(sortDice);
  //$("div#gameArea").empty();
  //reroll()
  //numberRerolls++;

}

let totalTanks = 0;
let totalRayguns = 0;

function lost() {

  for (let i = 0; i < dice.length; i++) {

    if (dice[i].face === "tank" && dice[i].held === true) {
      totalTanks++
    } else if (dice[i].face === "raygun" && dice[i].held === true) {
      totalRayguns++;
    }

  }

  if (totalTanks > totalRayguns) {
    return true;
  } else {
    return false;
  }

}

function endTurn() {

  $("button#reroll").hide();
  $("button#endTurn").hide();

  if (lost() === true) {
    $("p#message").text("Too many tanks! No points this turn.");
  } else {
    startTurn();
  }

}

function reroll() {

  numberRerolls--;

  if(numberRerolls === 0) {
    $("button#reroll").hide();
    $("button#endTurn").hide();

    if(humanPoints === 0) {
    $("button#scoreHumans").show();
  }
  if(chickenPoints === 0) {
    $("button#scoreCows").show();
  }
  if(cowPoints === 0) {
    $("button#scoreChickens").show();
  }

  }

  $("span#numberRerolls").text(numberRerolls);

  $("div#gameArea").empty();

  for (let i = 0; i < 13; i++) {

    if (dice[i].held === false) {
      createDieObject(i);
    }

    dice.sort(sortDice);


    // Add a new piece to the page
    $("<div>").attr("id", i).addClass("piece").appendTo("#gameArea");

    // If die happens to be tank
    if (dice[i].face === "tank") {
      $(`div#${i}`).addClass("held tank");
    }

    if (dice[i].held === true) {
      $(`div#${i}`).addClass("held");
    }

    // Append image to new piece and set alt text
    $("<img>").attr({
      src: `img/${dice[i].face}.png`,
      alt: capitalize(dice[i].face)
    }).appendTo(`div#${i}`);

    // Append name of die to piece
    $("<p>").text(capitalize(dice[i].face)).appendTo(`div#${i}`);


    $(`div#${i}`).bind('click', {
      param: i
    }, toggleHeld);

  }

  // Perform when die is clicked
  $(".piece").click(drawDie);


}

function endGame() {
  $("button").hide();
  $("p#message").text(`Game over! Your final score was ${humanPoints + cowPoints + chickenPoints}!`)
}

function scoreHumans() {

  for (let i = 0; i < dice.length; i++) {
    if (dice[i].face === "human" && dice[i].held === true) {
      $("button#scoreHumans").hide();
      humanPoints++;
      $("span#humanPoints").text(humanPoints);
      $("p#message").text(`You scored ${humanPoints} for humans`)
    }

    if (humanPoints > 0 && cowPoints > 0 && chickenPoints > 0) {
      endGame();
    } else {
    }


  }
}

function scoreCows() {

  for (let i = 0; i < dice.length; i++) {
    if (dice[i].face === "cow" && dice[i].held === true) {
      $("button#scoreCows").hide();
      cowPoints++;
      $("span#cowPoints").text(cowPoints);
      $("p#message").text(`You scored ${cowPoints} for cows`)
    }
  }

  if (humanPoints > 0 && cowPoints > 0 && chickenPoints > 0) {
    endGame();
  } else {

  }

}

function scoreChickens() {

  for (let i = 0; i < dice.length; i++) {
    if (dice[i].face === "chicken" && dice[i].held === true) {
      $("button#scoreChickens").hide();
      chickenPoints++;
      $("span#chickenPoints").text(chickenPoints);
      $("p#message").text(`You scored ${chickenPoints} for chickens`)
      reroll();
    }
  }

  if (humanPoints > 0 && cowPoints > 0 && chickenPoints > 0) {
    endGame();
  } else {

  }

}