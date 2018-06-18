var game = {
	// Questions and answers for the game to chose.
	questions: [
		{
			question: "What is your name?",
			answers: [
				[prompt("Enter player Name"), 1], //Added 0 or 1 for wrong or right answer.
				["King Arthur", 0],
				["Sir Robbin", 0],
				["Sir Lancelot", 0],
			],
		},
	 	{
			question: "What is the air speed velocity of an unlaiden swallow?",
			answers: [
				["What?", 0],
				["24 miles per hour", 1],
				["18 miles per hour", 0],
				["African or European?", 1],
			],
		},
		{
			question: "What is the capital of Assyria?",
			answers: [
				["I don't know that!", 0],
				["Assur", 1],
				["Trenton", 0],
				["Camelot", 0],
			],
		},
	],
	currentQuestion: 0,
	answerTally: 0,
	start: false,
	time: 30,
	timedOut: false,
	incorrectHTML: `
		<center>
		<img src="assets/images/deathholygrail.png" width="300px">
		<p>AAAAAUUUUUGGGGGGHHHHHH!!!!!</p></center>
		<br />
	`,
	correctHTML:  `
		<center>
		<img src="assets/images/correct.png" width="300px">
		</center>
		<br />
	`,
	countDown: function () {
		//Starts teh countdown timer and turns game start to true. Checks
		// if game is running already to avoid timer sync issues.
		if(!game.start) {
			intervalId = setInterval(game.count, 1000);
			game.start = true;
		}
	},
	count: function () {
		//Reduces the time by 1 digit, if time has hit 0 
		// then the game will time out before the player answers
		if(game.time >= 1) {
			game.time--;
		} else {
			game.timeOut();
		}
		$("#countdown").text(game.time);
	},
	timeOut: function () {
		//When a player times the game is reset for the player to
		// continue to the next question
		game.start = false;
		game.timedOut = true;
		game.endRound();
	},
	newRound: function () {
		// Game resetting function and generating new question.
		game.currentQuestion++;
		game.time = 30;
		game.renderQuestion();
		game.renderAnswers();
		game.renderTimer();
		game.countDown();
	},
	renderQuestion: function () {
		//Generates new question HTML based on the specific question
		// in the current order
		var curQuestion = game.questions[game.currentQuestion];
		var qH3 = $("<h3>").text(curQuestion.question),
			aDiv = $("<div>").attr("id", "answers");
		qH3.attr("class", "questions");
		$(".game").html(qH3);
		$(".game").append(aDiv);
	},
	renderAnswers: function () {
		//Generates the four answers for the current question
		var curQuestion = game.questions[game.currentQuestion];
		var answers = curQuestion.answers;
		for ( var i = 0; i < answers.length; i++) {
			var aP = $("<p>"),
				aButton = $("<button>");
			aButton.attr({
				"data-value": i,
				"class": `answer mdl-button mdl-js-button 
						mdl-button--raised mdl-button--colored`,
			});
			aButton.text(answers[i][0]);
			aP.append(aButton);
			$("#answers").append(aP);
		}
	},
	renderTimer: function () {
		//Sets up the HTML for the countdown clock
		var pTimer = $('<p id="timer">').text("Time Remaining: ");
		var spanCount = $('<span id="countdown">').text(game.time);
		pTimer.append(spanCount);
		$(".game").append(pTimer);
	},
	correctAnswer: function (answers) {
		//Condition check to see if the answer chosen is correct
		for (var i = 0; i < answers.length; i++) {
			if (answers[i][1] == 1) {
				var corrAnswer = answers[i][0];
				return corrAnswer;
			}
		}
	},
	checkAnswer: function (answer) {
		//Checks if question is correct by the player, if answer
		// is incorrect game moves onto a new round reset with
		//out incrementing score
		var curQuestion = game.questions[game.currentQuestion];
		var answers = curQuestion.answers;
		if(answer == game.correctAnswer(answers)) {
			game.answerTally++;
			game.endRound;
		} else {
			game.endRound;
		}
		return game.correctAnswer(answers);
	},
	endRound: function (answer) {
		//Stops the timer intervals that may be running.
		clearInterval(intervalId);
		game.checkAnswer(answer);
		var curQuestion = game.questions[game.currentQuestion];
		var answers = curQuestion.answers;
		//Does a condition check to see if all questions have
		//been played or not.
		if (game.currentQuestion < 2) {
			//If the round was ended due to a time out this condition
			// is triggered
			if (game.timedOut) {
				$(".game").html(
					"<center><p><h2>TIME IS UP!</h2></p></center>" 
					+ game.incorrectHTML);
				game.timedOut = false;
			}
			//If the round was ended due to a player choosing an answer
			// then the answer is checked if it is correct or not
			// if no answer is given incase of timeout. Then condition is 
			//skipped
			if(answer != null) {
				if(answer === game.correctAnswer(answers)) {
					$(".game").html(
						"<center><h2>That is correct!</h2></center>" 
						+ game.correctHTML);
				} else {
					$(".game").html(
						"<center><h2>Incorrect!</h2></center>" 
						+ game.incorrectHTML);
				}
			}
			game.showAnswer();
			setTimeout(game.newRound, 4000);
		} else {
			game.gameOver();
		}
	},
	showAnswer: function () {
		//Shows the correct answer when round ends
		var curQuestion = game.questions[game.currentQuestion];
		var answers = curQuestion.answers;
		$(".game").append(
			"<center><p>And the correct answer is..." 
			+ (game.correctAnswer(answers)) + "</p></center>");
	},
	gameOver: function () {
		game.showAnswer();
		//Checks the player's score for different winning or 
		//losing end screen.
		if (game.answerTally >= 2 ){
			$(".game").html(game.correctHTML + "<center><p>" 
				+ game.answerTally 
				+ " out of 3! Right... off you go.</p></center>")
		} else {
			$(".game").html(game.incorrectHTML 
				+ "<center><p>" 
				+ game.answerTally 
				+ " out of 3! You lose...</p></center>")
		}
	}
}

$(".start-game").click(function() {
	//When a player presses start the game is set into motion.
	$(".start-game").hide();
	game.renderQuestion();
	game.renderAnswers();
	game.renderTimer();
	game.countDown();
});

$("body").on("click", ".answer", function() {
	//When a player chooses an answer the text is captured
	// and moved into a variable to be checked with the correct answer.
	var answer = $(this).text().trim();
	game.start = false;
	game.endRound(answer);
});