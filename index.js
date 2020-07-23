$(document).ready(() => {
  let username = "";
  let results = [];
  let selectedAnswers = {};

  // Cache the dom elems
  const usernameInput = $("#username");
  const modal = $("#modal-container");
  const quizContainer = $("#quiz-container");
  const submitBtn = $("#submit");
  const resetBtn = $("#reset");
  const btnGroup = $(".buttons");

  // const usernameInput = document.getElementById('username');
  // const modal = document.getElementById('modal-container');
  // // const quizContainer = document.getElementById('quiz-container');
  // const btnGroup = document.querySelector('.buttons');
  // const submitBtn = document.querySelector('#submit');
  // const resetBtn = document.querySelector('#reset');

  // On clicking the quiz answer
  const onAnswerClick = (e) => {
    e.stopPropagation();

    const answerEl = $(e.target);
    const index = answerEl
      .parent()
      .parent()
      .attr("data-index");
    // const index=e.target.parentNode.parentNode.getAttribute('data-index');

    const answer = answerEl.text();
    // const answer=e.target.innerText;
    const isCorrect = results[index].correct_answer === answer;

    selectedAnswers[index] = { answer: answer, isCorrect: isCorrect };

    answerEl
      .addClass("active-answer")
      .siblings()
      .removeClass("active-answer");
  };

  // Render quiz from the retrieved quiz data
  const renderQuiz = (response) => {
    if (response.results.length) {
      // results = response.results;
      results = [].concat(response.results);

      // Loop through the results received from the response and render a quiz question
      results.forEach((quiz, index) => {
        const answers = [quiz.correct_answer]
          .concat(quiz.incorrect_answers)
          .sort(() => Math.random() - 0.5);
        const answerList = $('<ul class="answers-list"></ul>');
        // const answerList = document.createElement('ul')
        // answerList.className = 'answers-list';

        // Loop through the array of answers and render it
        answers.forEach((answer) => {
          answerList.append('<li class="answer">' + answer + "</li>");
          // const ans = document.createElement('li');
          // ans.className = 'answer';
          // ans.innerHTML = answer;
          // answerList.appendChild(ans);
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
      btnGroup.css("display", "flex");
    }
  };

  // fetching quiz data
  const getQuizDetails = () => {
    fetch("https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple")
      .then(res => res.json())
      .then(renderQuiz)
      .catch(err => alert('\t\t\tSomething went wrong!\n' + err));
  };

  // // Using async/await
  // const getQuizDetails = async () => {
  //   try {
  //     const res = await fetch("https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple")
  //     alert(res.ok);
  //     if (!res.ok) {
  //       throw new Error(res.status);
  //     }
  //     const data = await res.json();
  //     renderQuiz(data);
  //   }
  //   catch (error) {
  //     alert('\t\t\tSomething went wrong!\n' + error);
  //   }
  // }


  // Toggle username modal based on requirement
  const toggleUsernameModal = () => {
    if (modal.hasClass("out")) {
      modal.removeClass("out");
    } else {
      modal.addClass("out");
    }
  };

  // Get the username from modal when user presses enter
  const getUsername = (event) => {
    if (event.which === 13 || event.keyCode === 13 || event.key === "Enter") {
      if (usernameInput.val()) {
        username = usernameInput.val();

        toggleUsernameModal();
        getQuizDetails();
      }
      else {
        alert('Please Enter username...');
      }
    }
  };

  // On submitting quiz answers, run this function
  const onSubmit = (e) => {
    e.preventDefault();

    let rightAnswersCount = 0;

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
  };

  // Bind events
  usernameInput.on("keypress", getUsername);
  submitBtn.on("click", onSubmit);
  resetBtn.on("click", () => {
    location.reload();
  });
  // usernameInput.addEventListener("keypress", getUsername);
  // submitBtn.addEventListener('click', onSubmit);
  // resetBtn.addEventListener('click', () => () {
  //   location.reload();
  // });
});