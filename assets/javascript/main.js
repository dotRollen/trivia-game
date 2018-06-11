var game = {
	questions: [
		{
			question: "What's is your name?",
			answer: "edward",
		},
		{
			question: "What is your favourite color?",
			answer: "orange",
		},
	 	{
			question: "What is the air speed velocity of an unlaiden swallow?",
			answer: "African or European?"
		}
	],
	currentQuestion: 0,
	start: false,
	round: false,
	newRound: false,
	time: 30,
	timeStart: false,
	countDown: function () {
		if(!game.timeStart) {
			intervalId = setInterval(game.count, 1000);
			game.timeStart = true;
			game.round = true;
		}
	},
	count: function () {
		if(game.time > 0) {
			game.time--;
			$("#countdown").text(game.time);
		} else {
			clearInterval(intervalId);
			game.round = false;
			game.newRound = true;
		}
	},
	stopCount: function () {
		clearInterval(intervalId);
		game.timeStart = false;
	},
	renderQuestion: function (indexQ) {
		var question = indexQ.question,
				answer = indexQ.answer,
				qH3 = $("<h3>").text(question)

		$(".questions").append(qH3);
	}
}

$(".start-game").on("click", function() {
	$(".start-game").hide();
	$(".questions").show();
	$(".time").show();
	game.start = true;
	while (game.start) {
		var i = game.currentQuestion,
				indexQ = game.questions[i];

		if (game.newRound) {
			game.currentQuestion++
			game.newRound = false;
		}
		if (!game.round) {
			game.renderQuestion(indexQ);
			game.countDown();
		}
	}
});
