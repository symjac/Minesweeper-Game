$(document).ready(function() {

var bombsFlagged = 0;
var gameCountLosses = document.getElementById('game-counter-losses');
var gameCountWins = document.getElementById('game-counter-wins');

setUpBoard ();

$('*').on('click', function () {
  var $flagButtonActive = $(this).hasClass('button-flag' && 'active');
  var $flagButton = $(this).hasClass('button-flag');
  var $flagReady = $(this).hasClass('flag-ready');
  var $flagImage = $('<img class="flag-image">');

  var $newGameButton = $(this).hasClass('button-new');

  var $instructionsOpen = $(this).hasClass('rules-open');
  var $instructionsClose = $(this).hasClass('rules-close');

  var $selectedSquareIsSafe = $(this).hasClass('safe');
  var $selectedSquareIsBomb= $(this).hasClass('bomb');
  var $selectedSquareBombCount = $(this).find('.bomb-count');
  var $selectedSquareFlagged = $(this).hasClass('flagged');


//change flag image by theme
  if ($('.game-square').hasClass('monsters')) {
    $flagImage.attr('src', 'images/chainsaw.png');
  } else if ($('.game-square').hasClass('cops')) {
    $flagImage.attr('src', 'images/disguise.png');
  } else if ($('.game-square').hasClass('skunks')) {
    $flagImage.attr('src', 'images/cage.png');
  };

//clicking buttons
  if (bombsFlagged === 5) {
    $('.game-end').removeClass('hide');
    $('.game-end-won').removeClass('hide');
  } else if ($flagButtonActive) {
    //Flag button deactivated
    $('.game-square').removeClass('flag-ready');
    $('.button-flag').removeClass('active');
  } else if ($flagButton) {
    //Flag button activated
    $('.game-square').addClass('flag-ready');
    $('.button-flag').addClass('active');
  } else if ($newGameButton) {
    //refreshes page for new grid
    location.reload();

//clicking to open/close rules
  } else if ($instructionsClose) {
    //close rules
    $('.rules-open').removeClass('hide');
    $('.game-rules-body').addClass('hide');
    $('.rules-close').addClass('hide');
  } else if ($instructionsOpen) {
    //open rules
    $('.rules-close').removeClass('hide');
    $('.game-rules-body').removeClass('hide');
    $('.rules-open').addClass('hide');

//clicking Flag on grid
  } else if ($selectedSquareFlagged) {
    //remove Flag after its placed
    $(this).removeClass('flagged');
    $(this).find('.flag-image').remove();
  } else  if ($flagReady && $selectedSquareIsBomb) {
    //if flagging Bomb, increase Bombs Flagged count and add Flag
    bombsFlagged += 1;
    $(this).append($flagImage);
    $(this).addClass('flagged');
    $('.game-square').removeClass('flag-ready');
    $('.button-flag').removeClass('active');
  } else if ($flagReady && !($selectedSquareBombCount.hasClass('hide'))) {
    //rare case if user wants to switch a Safe to Flagged
    $selectedSquareBombCount.addClass('hide');
    $(this).append($flagImage);
    $(this).addClass('flagged');
    $('.game-square').removeClass('flag-ready');
    $('.button-flag').removeClass('active');
  } else if ($flagReady) {
    //Flag square
    $(this).append($flagImage);
    $(this).addClass('flagged');
    $('.game-square').removeClass('flag-ready');
    $('.button-flag').removeClass('active');
  } else if ($selectedSquareIsSafe && !$selectedSquareFlagged) {
    //reveal Safe square
    $selectedSquareBombCount.removeClass('hide');
  } else if ($selectedSquareIsBomb && !$selectedSquareFlagged) {
    //reveal Bomb square, game over
    $('.game-end').removeClass('hide');
    $('.game-end-lost').removeClass('hide');
    $('.flag-image').remove();
    $('.bomb-image').removeClass('hide');
    $('.bomb-count').removeClass('hide');
  };

});

function setUpBoard () {
  var allSquares = Array.from({length: 25}, (x,i) => i); //full array of 0-25
  //assign 5 Bombs randomly
  var bombs = [];
  while(bombs.length < 5) {
    var bombIndex = Math.floor(Math.random()*25);
    if(bombs.indexOf(bombIndex) === -1) bombs.push(bombIndex);
  };
  //all remaining squares are Safe, takes the full array of 0-25 minus bombs
  var safes = allSquares.filter((square) => !bombs.includes(square));
  //add Bomb images
  bombs.forEach(function(bomb) {
    var $bombImage = $('<img class="bomb-image hide">');
    //change bomb image by theme
    if ($('.game-square').hasClass('monsters')) {
      $bombImage.attr('src', 'images/monsters.png');
    } else if ($('.game-square').hasClass('cops')) {
      $bombImage.attr('src', 'images/cops.png');
    } else if ($('.game-square').hasClass('skunks')) {
      $bombImage.attr('src', 'images/skunks.png');
    };
    var $bombSquare = $('.game-square').eq(bomb);
    $bombSquare.append($bombImage).addClass('bomb').removeClass('safe');
  });
  //add Safe squares with bomb count
  safes.forEach(function(safe) {
    n = safe;
    safeSquares ();
  });
}

//based on each Safe square's index #, check if its neighboring squares are bombs
function safeSquares () {
  var bombCount = 0;
  var $indexedSquare = $('.game-square').eq(n);

  switch (true) {
    case (n === 0):
      var squareIndexes = [(n+1), (n+5), (n+6)];
      bombCounting ();
    break;
    case (n === 4):
      var squareIndexes = [(n-1), (n+4), (n+5)];
      bombCounting ();
    break;
    case (n === 5 || n === 10 || n === 15 || n === 20):
      var squareIndexes = [(n-5), (n-4), (n+1), (n+5), (n+6), ];
      bombCounting ();
    break;
    case (n === 9 || n === 14 || n === 19  || n === 24):
      var squareIndexes = [(n-6), (n-5), (n-1), (n+4), (n+5)];
      bombCounting ();
    break;
    default:
      var squareIndexes = [(n-6), (n-5), (n-4), (n-1), (n+1), (n+4), (n+5), (n+6)];
      bombCounting ();
  };
  //calculate each Safe square's bomb count
  function bombCounting () {
    squareIndexes.forEach(function(squareIndex) {
      var $nearbySquare = $('.game-square').eq(squareIndex);
      if (($nearbySquare.hasClass('bomb')) && (squareIndex >= 0)) {
        bombCount++;
      };
    });
  };
  //add bomb count to Safe squares
  $indexedSquare.append('<p class="bomb-count hide">'+bombCount+'</p>');
};


});
