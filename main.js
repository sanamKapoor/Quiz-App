
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


form.addEventListener('submit', e => {
  e.preventDefault();
  let selectedProf = profession[0].selectedOptions[0].value;
  let selectedUser = username.value;

  if((selectedUser === '' && selectedProf === '') || (selectedUser === undefined && selectedProf === null)){
    document.querySelector('.warning').innerHTML = 'Please enter both fields ...';

    setTimeout(() => {
      document.querySelector('.warning').innerHTML = '';
    }, 3000);
    return;
  }
  else if(selectedUser === '' || selectedUser === undefined){
     document.querySelector('.warning').innerHTML = 'Please enter username ...';

    setTimeout(() => {
      document.querySelector('.warning').innerHTML = '';
    }, 3000);
    return;
  }
  else if(!isNaN(selectedUser)){
    document.querySelector('.warning').innerHTML = 'Username should contain alphabets ...';

    setTimeout(() => {
      document.querySelector('.warning').innerHTML = '';
    }, 3000);
    return;
  }
  else if(selectedProf === '' || selectedProf === undefined){
    
    document.querySelector('.warning').innerHTML = 'Please choose any profession ...';

    setTimeout(() => {
      document.querySelector('.warning').innerHTML = '';
    }, 3000);
    return;

  }
  else {
    
    let question = [];

    const fetchQuestions = async (user, prof, type) => {
      const res = await fetch(`questions/${type}.json`);
      const data = await res.json();
      new Question(user, prof, data);
    }

    if(selectedProf === 'web-dev'){
      fetchQuestions(selectedUser, selectedProf, 'web-dev');
    }
    else if(selectedProf === 'mobile-dev') {
      fetchQuestions(selectedUser, selectedProf, 'mobile-dev');
    }
    else if (selectedProf === 'digital-marketer') {
      fetchQuestions(selectedUser, selectedProf, 'digital-marketer');
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
    user.textContent = this.selectedUser.toUpperCase();
    score.innerHTML = +this.score;
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
      timeOut.innerHTML = `${m}:${s}`;
    }
  }

  result(){
    let totalScore = this.score;
    let totalTime_Taken = timeOut.innerHTML;
    let correctAns = this.correctAnsw;
    let wrongAns = this.wrongAnsw;
    let starRating = Math.floor(totalScore / 10);
    console.log(starRating);
    let result = document.querySelector('.result');
    let starEle = document.querySelectorAll('.star-rating i');

    if(totalScore >= 30){
      result.innerHTML = '!! Well Played !!';
    } else if(totalScore < 20) {
      result.innerHTML = '!! Keep Trying !!';
    } else {
      result.innerHTML = '!! Not Bad !!';
    }

    for(let i = 0; i < starRating; i++){  
      starEle[i].classList.remove('far');
      starEle[i].classList.add('fas');
    }

    document.getElementById('total_score').innerHTML = totalScore;
    document.getElementById('total_time').innerHTML = `( ${totalTime_Taken} )`;
    document.getElementById('correct_anw').innerHTML = correctAns < 10 ? '0' + correctAns : correctAns;
    document.getElementById('wrong_anw').innerHTML = wrongAns < 10 ? '0' + wrongAns : wrongAns;

    document.querySelector('section').style.display = 'none';
    document.querySelector('article').style.display = 'block';
    body.style.backgroundColor = 'white';

    answerSheet.addEventListener('click', () => {
      this.showAnswers();
      document.querySelector('#table').style.display = 'block';
      body.style.height = 'auto';
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
    const { id, question, options, answer } = singleQuestion;

    document.getElementById('question').innerHTML = question;
    document.getElementById('q-number').innerHTML = `${questionNum}/10`;
    let ansCheck = document.querySelector('.checker');

      options.forEach(option => {
        let optionRow = document.querySelector('.options');

        let div = document.createElement('div');
        div.className = 'col-12 col-md-6 my-2 my-md-3';

        optionBtn = document.createElement('button');
        optionBtn.className = 'lead w-75 mx-auto py-2 btn btn-outline-secondary';
        optionBtn.innerHTML = option;

        div.append(optionBtn);
        optionRow.append(div);


        optionBtn.addEventListener('click', e => {
          optionRow.textContent = null;
          let yourOption = e.target.textContent;
          let isCorrect;

          if(yourOption === answer){
            this.score += 5;
            this.correctAnsw++;            
            score.innerHTML = +this.score;
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
      return;
    }
}

makeAnsRow(ans){
  let count = 10 - ans.id + 1;
  let table = document.getElementById('table');

  let row = document.createElement('div');
  row.className = 'row no-gutters';

  let qCol = document.createElement('div');
  qCol.className = 'col col-9  px-3 py-1';
  qCol.innerHTML = `<p><span>${count})</span> ${ans.question}</p>`;

  let aCol = document.createElement('div');
  aCol.className = 'col col-3 text-center px-3 py-1';
  aCol.innerHTML = `<p>${ans.answer}</p>`;

  row.append(qCol);
  row.append(aCol);

  table.append(row);

  this.showAnswers();
}

}
