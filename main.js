const startBtn = document.getElementById('start');
const options = document.querySelectorAll('.options button');
const answerSheet = document.getElementById('answer-sheet');
const body = document.querySelector('body');

startBtn.addEventListener('click', e => {
  e.preventDefault();
  document.body.style.background = '#efefef';
  document.querySelector('main').style.display = 'none';
  document.querySelector('section').style.display = 'block';
})

options.forEach(option => {
  option.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('section').style.display = 'none';
    document.querySelector('article').style.display = 'block';
    body.style.backgroundColor = 'white';
  })
})

answerSheet.addEventListener('click', e => {
  e.preventDefault();
  document.querySelector('#table').style.display = 'block';
  body.style.height = 'auto';
})