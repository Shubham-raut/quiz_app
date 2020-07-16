$(document).ready(function () {
  var results = [],
    username = '',
    selectedAnswers = {};

  //dom elements
  var quizContainer = $("#quiz-container");
  var usernameInput = document.getElementById('username');
  var modal = document.getElementById('modal-container');
  // var quizContainer = document.getElementById('quiz-container');
  var btnGroup = document.querySelector('.buttons');
  var submitBtn = document.querySelector('#submit');
  var resetBtn = document.querySelector('#reset');

  // on clicking the ans
  function onAnswerClick(e) {
    e.stopPropagation();
    var answerEl = $(e.target);
    var index = answerEl
      .parent()
      .parent()
      .attr("data-index");
    // var index=e.target.parentNode.parentNode.getAttribute('data-index');

    var answer = answerEl.text();
    // var answer=e.target.innerText;
    var isCorrect = results[index].correct_answer === answer;

    selectedAnswers[index] = { answer: answer, isCorrect: isCorrect };

    answerEl
      .addClass("active-answer")
      .siblings()
      .removeClass("active-answer");
  }

  // Render quiz from the retrieved quiz data
  function renderQuiz(response) {
    if (response.results.length) {
      // results = response.results;
      results = [].concat(response.results);

      // Loop through the results received from the response and render a quiz question
      results.forEach(function (quiz, index) {
        var answers = [quiz.correct_answer]
          .concat(quiz.incorrect_answers)
          .sort(() => Math.random() - 0.5);

        // answerList=$('<ul class="answers-list"></ul>');
        var answerList = document.createElement('ul')
        answerList.className = 'answers-list';

        // Loop through the array of answers and render it
        answers.forEach(function (answer, index) {
          // answerList.append('<li class="answer">' + answer + "</li>");
          var ans = document.createElement('li');
          ans.className = 'answer';
          ans.innerHTML = answer;
          answerList.appendChild(ans);
        });

        // Loop through results and render question and answer
        quizContainer.append(
          '<li class="quiz-block" data-index="' +
          index +
          '" id=question-' +
          index +
          '><h4 class="question">' +
          (index + 1) +
          ". " +
          quiz.question +
          "</h4></li>"
        );

        $("#question-" + index + "").append(answerList);
      });

      // document.querySelector('.answer').addEventListener('click', onAnswerClick);
      $(".answer").on("click", onAnswerClick);
      btnGroup.style.display = "flex";
    }
  }

  // fetching quiz data
  function getQuizDetails() {
    fetch('https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple')
      .then(res => res.json())
      .then(renderQuiz);
  }

  // Toggle username modal based on requirement
  function toggleUsernameModal() {
    modal.className = 'out';
  }

  // accepting and verifying username username
  function getUsername(event) {
    if (event.which === 13 || event.keyCode === 13 || event.key === "Enter") {
      if (usernameInput.value.trim()) {
        username = usernameInput.value.trim();
        toggleUsernameModal();
        getQuizDetails();
      }
      else {
        alert('Please Enter username...');
      }
    }
  }

  // On submitting quiz answers, run this function
  function onSubmit(e) {
    e.preventDefault();

    var rightAnswersCount = 0;

    if (Object.keys(selectedAnswers).length === results.length) {
      rightAnswersCount = Object.values(selectedAnswers).filter(
        answer => answer.isCorrect
      ).length;

      quizContainer.html(
        "<li>" +
        username +
        ", you have answered " +
        rightAnswersCount +
        " questions correctly.</li>"
      );
    } else {
      alert("Please answer all questions");
    }
  }

  // Bind events
  usernameInput.addEventListener("keypress", getUsername);
  submitBtn.addEventListener('click', onSubmit);
  resetBtn.addEventListener('click', function () {
    location.reload();
  });

});