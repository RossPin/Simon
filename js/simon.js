var colors = ['red','green','blue','orange'];
var sequence = [];
var playerSequence = [];
var flashTime = 1000;
var pauseTime = 500;
var entryTimer;
var sound;
var strict = false;

function setStrict() {
  strict = !strict;
  if (strict) $('#strictBtn').addClass('btn-danger');
  else $('#strictBtn').removeClass('btn-danger');
}

function start() {
  $('#startBtn').attr('onclick', 'restart()');
  $('#startBtn').text('Restart');  
  $("#strictBtn").prop('disabled', true);
  addStep();
  setTimeout(function(){
    playSequence(0);
  }, 1000);     
}

function getSound(color){
  if (color === 'red') return 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3';
  if (color === 'green') return 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3';
  if (color === 'blue') return 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3';
  if (color === 'orange') return 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3';
  
}

function playSequence(i) {
  if (i >= sequence.length) {
    if (sequence.length > 0) playerTurn();
    return;
  }  
  $('.'+sequence[i]).addClass(sequence[i]+'On');  
  sound = new Audio(getSound(sequence[i]));
  sound.play();
  setTimeout(function(){
    $('.'+sequence[i]).removeClass(sequence[i]+'On');
    setTimeout(function(){
      playSequence(i+1);
    }, pauseTime);
  }, flashTime);
}

function playerTurn(){
  startListeners();
  entryTimer = setTimeout(function() {
  flashBoard('fail');
}, 2000);  
}

function startListeners(){
  $('.red').on('click', select)
  $('.green').on('click', select)
  $('.blue').on('click', select)
  $('.orange').on('click', select)
}

function stopListeners(){
  $('.red').off()
  $('.green').off()
  $('.blue').off()
  $('.orange').off()
}

function select(evt){
  clearTimeout(entryTimer);
  var color = evt.target.classList[1]
  $('.'+color).addClass(color+'On');
  sound = new Audio(getSound(color));
  sound.play();
  setTimeout (function(){
    $('.'+color).removeClass(color+'On');
    if (color !== sequence[playerSequence.length]){
      flashBoard('fail');
      return;
    }
    playerSequence.push(color);  
    if (playerSequence.length === sequence.length) checkProgress(); 
    else entryTimer = setTimeout(function() {
      flashBoard('fail');
      }, 2000);
  }, 400);
}

function flashBoard(color) {
  playerSequence = [];
  stopListeners();
  clearTimeout(entryTimer);
  $('.center').addClass(color)
  setTimeout(function(){
      $('.center').removeClass(color)    
      if (color === 'succeed') addStep();
      if (strict && color === 'fail'){
          restart();
          start();
        }
      else setTimeout(function(){        
        playSequence(0);
    }, 1000);
    }, 1000);
}

function addStep() {    
  sequence.push(colors[Math.floor(Math.random()*4)]);  
  console.log(sequence);
  $('#count').text(sequence.length);   
}

function restart() {
  playerSequence = [];
  stopListeners();
  sequence = [];
  clearTimeout(entryTimer);
  $('#startBtn').attr('onclick', 'start()');
  $('#startBtn').text('Start');
  $("#strictBtn").prop('disabled', false);
  $('#count').text(sequence.length);
  $('.paddle').removeClass('pink');
  $('#banner').text('')
  $('#steps').css('display', 'block')
}

function checkProgress() {
  if (sequence.length === 20) {
    winGame();
    return;
  }
  if (sequence.length === 5 || sequence.length === 9 || sequence.length === 13){
    flashTime -= 200;
    pauseTime -= 100;
  }      
  flashBoard('succeed');
}

function winGame(){
  stopListeners();
  clearTimeout(entryTimer);
  $('.paddle').addClass('pink');
  $('#banner').text('WINNER!!');
  $('#steps').css('display', 'none')
}
