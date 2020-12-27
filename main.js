const startBtn = document.getElementById('start');
const options = document.querySelectorAll('.options button');
const answerSheet = document.getElementById('answer-sheet');
const body = document.querySelector('body');
const username = document.querySelector('#username');
const profession = document.querySelectorAll('#profession');
const form = document.querySelector('#submit-form');
const user = document.getElementById('user');
const score = document.getElementById('score');
const timeOut = document.getElementById('time');
const allContent = document.querySelector('.all-content');
const warningArea = document.querySelector('.warning-area');
const table = document.getElementById('table');

let tableWrapper = document.createElement('div');
tableWrapper.className = 'overflow-auto';

const regxForUsername = new RegExp( /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/);

form.addEventListener('submit', e => {
  e.preventDefault();
  let selectedProf = profession[0].selectedOptions[0].value;
  let selectedUser = username.value;

  warningArea.classList.add('warning');

  if((selectedUser === '' && selectedProf === '') || (selectedUser === undefined && selectedProf === null)){
    warningArea.textContent = 'Please provide both fields ...';
    removeWarning();
    return;
  }
  else if(selectedUser === '' || selectedUser === undefined){
    warningArea.textContent = 'Please provide username ...';
    removeWarning();
    return;
  }
  else if(!regxForUsername.test(selectedUser)){
    warningArea.textContent = 'Username should only contain alphabets ...';
    removeWarning();
    return;
  }
  else if(selectedProf === '' || selectedProf === undefined){
    warningArea.textContent = 'Please choose any profession ...';
    removeWarning();
    return;
  }
  else {
    
    let question = [];

    const fetchQuestions = async (user, prof) => {
      const res = await fetch(`questions/${prof}.json`);
      const data = await res.json();
      new Question(user, prof, data);
    }

    if(selectedProf){
      fetchQuestions(selectedUser, selectedProf);
    }
    else {
      alert('No Questions available !!!');
    }

    selectedUser = '';
    selectedProf = '';
  }
  
  document.body.style.background = '#efefef';
  document.querySelector('main').style.display = 'none';
  document.querySelector('section').style.display = 'block';
})

function removeWarning(){
  setTimeout(() => {
    warningArea.textContent = '';
    warningArea.classList.remove('warning');
  }, 3000);
}

class Question {
  constructor(username, prof, questions){
    this.score = 0;
    this.correctAnsw = 0;
    this.wrongAnsw = 0;
    this.totalTime = 5 * 60;
    this.selectedUser = username;
    this.selectedProf = prof;
    this.answerSheetDisplay = [...questions];
    this.questions = questions;
    user.textContent = this.selectedUser;
    score.textContent = +this.score;
    setInterval(() => {
      this.getTimer();
      this.totalTime -= 1;
    }, 1000);

    this.showQuestions();
  }

  getTimer(){
    let seconds = Math.floor(this.totalTime % 60);
    let minutes = Math.floor(this.totalTime / 60); 
    let m = (parseInt(minutes, 10) < 10 ? '0' : '') + minutes;
    let s = (parseInt(seconds, 10) < 10 ? '0' : '') + seconds;
    if(this.totalTime <  0){
      this.result();
    } else {
      timeOut.textContent = ` ${m}:${s} `;
    }
  }

  result(){
    let totalScore = this.score;
    let totalTime_Taken = timeOut.textContent;
    let correctAns = this.correctAnsw;
    let wrongAns = this.wrongAnsw;
    let starRating = Math.floor(totalScore / 10);

    let result = document.querySelector('.result');
    let starEle = document.querySelectorAll('.star-rating i');

    if(totalScore >= 30){
      result.textContent = '!! Well Played !!';
    } else if(totalScore < 20) {
      result.textContent = '!! Keep Trying !!';
    } else {
      result.textContent = '!! Not Bad !!';
    }

    for(let i = 0; i < starRating; i++){  
      starEle[i].classList.remove('far');
      starEle[i].classList.add('fas');
    }

    document.getElementById('total_score').textContent = totalScore;
    document.getElementById('total_time').textContent = `(${totalTime_Taken})`;
    document.getElementById('correct_anw').textContent = (correctAns < 10 && correctAns > 0) ? '0' + correctAns : correctAns;
    document.getElementById('wrong_anw').textContent = (wrongAns < 10 && wrongAns > 0) ? '0' + wrongAns : wrongAns;

    document.querySelector('section').style.display = 'none';
    document.querySelector('article').style.display = 'block';
    body.style.backgroundColor = 'white';

    answerSheet.addEventListener('click', () => {
      this.showAnswers();
      document.querySelector('#table').style.display = 'block';
      allContent.style.height = 'auto';
      answerSheet.style.display = 'none';
    })
  }

  showQuestions(){
    if(this.questions.length > 0){
      let question = this.questions.pop();
      let questionNum = 10 - this.questions.length;
      this.makeOptions(question, questionNum);
    } else {
      this.result();
    }
  }

  makeOptions(singleQuestion, questionNum){
    let optionBtn;
    const { question, options, answer } = singleQuestion;

    document.getElementById('question').textContent = question;
    document.getElementById('q-number').textContent = `${questionNum} / 10`;
    let ansCheck = document.querySelector('.checker');

      options.forEach(option => {
        let optionRow = document.querySelector('.options');

        let div = document.createElement('div');
        div.className = 'col-12 col-md-6 my-2 my-md-3';

        optionBtn = document.createElement('button');
        optionBtn.className = 'lead w-75 mx-auto py-2 btn btn-outline-secondary text-break';
        optionBtn.textContent = option;

        div.append(optionBtn);
        optionRow.append(div);


        optionBtn.addEventListener('click', e => {
          optionRow.textContent = null;
          let yourOption = e.target.textContent;
          let isCorrect;

          if(yourOption === answer){
            this.score += 5;
            this.correctAnsw++;            
            score.textContent = +this.score;
            isCorrect = document.createElement('i');
            isCorrect.className = 'fas fa-check-circle text-success fa-2x p-1';
          } else {
            this.wrongAnsw++;
            isCorrect = document.createElement('i');
            isCorrect.className = 'fas fa-times-circle text-danger fa-2x p-1'; 
          }

          ansCheck.append(isCorrect);
          this.showQuestions();
        });

      })
    
  }
    

  showAnswers(){
    let answers = this.answerSheetDisplay;
    if(answers.length > 0){
      let showAns = answers.pop();
      this.makeAnsRow(showAns);
    }
    else {
      table.append(tableWrapper);
      return;
    }
  }

makeAnsRow(ans){
  let count = 10 - ans.id + 1;

  let row = document.createElement('div');
  row.className = 'row no-gutters';

  let qCol = document.createElement('div');
  qCol.className = 'col-9  px-3 py-1';
  qCol.innerHTML = `<p><span>${count})</span> ${ans.question}</p>`;

  let aCol = document.createElement('div');
  aCol.className = 'col-3 text-center px-3 py-1';
  aCol.innerHTML = `<p>${ans.answer}</p>`;

  row.append(qCol);
  row.append(aCol);

  tableWrapper.append(row);

  this.showAnswers();
}

}
