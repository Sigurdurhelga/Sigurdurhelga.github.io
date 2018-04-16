/**
 * The functionality of the game
 */

function gameHandler(num_questions) {

    this.defaultTime = 20;
    this.currentTimeout = null;
    this.total_questions = num_questions;
    this.questions_left = num_questions;
    this.playerScore = 0;
    this.currentQuestion = null;


    this.hideSetups = function() {
        $('#answerForm').text("");
    }

    this.confirmAnswer = function (answer) {
        if(answer){
            if(this.currentQuestion.answerQuestion(answer)){
                this.playerScore+=1;
            }
        }
    };

    this.gameEnd = function(){
        clearInterval(this.currentTimeout);
        $('.game-screen').hide();
        $('.end-screen').show();
        $('.score-text').text("You got "+this.playerScore+" / "+this.total_questions);
    };

    this.getNextQuestion = function (){
        if(this.questions_left == 0){
            this.gameEnd();
            return;
        }
        this.questions_left -= 1;
        let keys = Object.keys(window.giveMeAnAnswer.qna);
        let randomType = keys[Math.floor(Math.random() * keys.length)];
        let randomQuestion = window.giveMeAnAnswer.qna[randomType][Math.floor(Math.random() * window.giveMeAnAnswer.qna[randomType].length)]
        this.hideSetups();
        if(randomType === 'multiple'){
            this.currentQuestion = new MultipleChoice(randomQuestion.question, randomQuestion.answer, randomQuestion.options);
        } else if (randomType === 'shortAnswer') {
            this.currentQuestion = new ShortAnswer(randomQuestion.question, randomQuestion.answer);
        } else if (randomType === 'trueorfalse') {
            this.currentQuestion = new TrueOrFalse(randomQuestion.question, randomQuestion.answer);
        }
        this.currentQuestion.displayQuestion();
    };

    this.resetTimer = function(){
        clearInterval(this.currentTimeout);
        this.getNextQuestion();
        this.currentTimeout = setInterval(function() {
            this.confirmAnswer();
            this.getNextQuestion();
        }.bind(this), this.defaultTime * 1000);
    }
    this.currentTimeout = setInterval(function() {
        this.confirmAnswer();
        this.getNextQuestion();
    }.bind(this), this.defaultTime * 1000);
    this.getNextQuestion();
}

let game = null;

$("#gameForm").submit(function(e){
    e.preventDefault();
    let answer = $('#gameForm').serialize();
    answer = answer.split('=')[1];
    game.confirmAnswer(answer);
    game.resetTimer();
});

$(function () {
    $('#startGameBtn').on('click', function () {
        var numQuestions = $(this).prev().children();
        var nQuestions = parseInt(numQuestions.val());
        numQuestions.removeClass('input-error');
        if (!(numQuestions.val() === '') && nQuestions <= 10 && nQuestions > 0) {
            $(this).parent().fadeOut();
            $('.game-screen').fadeIn('slow');
            $('.question-text').show();
            game = new gameHandler(nQuestions);
        } else {
            // Display error message
            numQuestions.addClass('input-error');
            numQuestions.val('');
        }
    });
    $('#retryButton').on('click', function(){
        game = null;
        $('.end-screen').hide();
        $('.entry-screen').show();
    })
});