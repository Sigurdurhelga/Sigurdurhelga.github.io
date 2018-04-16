// Create object-oriented structure of questions
function Question(questionText, questionAnswer) {
    this.questionText = questionText;
    this.questionAnswer = questionAnswer;
}

Question.prototype.displayQuestion = function() {}

Question.prototype.answerQuestion = function(answer) {
    return answer === this.questionAnswer;
}

function MultipleChoice (questionText, questionAnswer, questionOptions) {
    Question.call(this, questionText, questionAnswer);
    this.questionOptions = questionOptions;
}

MultipleChoice.prototype = Object.create(Question.prototype);
MultipleChoice.prototype.constructor = MultipleChoice;


MultipleChoice.prototype.displayQuestion = function () {
    $('.question-text').text(this.questionText);
    let answerradios = "";
    for(let i = 0; i < this.questionOptions.length; i++){
        answerradios += "<div class='radio'><label><input type='radio' name='answer' value='"+this.questionOptions[i].key+"'>"+this.questionOptions[i].value+"</label></div>";
    }
    $('#answerForm').append(answerradios);
}

function ShortAnswer (questionText, questionAnswer) {
    Question.call(this, questionText, questionAnswer);
}

ShortAnswer.prototype = Object.create(Question.prototype);
ShortAnswer.prototype.constructor = ShortAnswer;

ShortAnswer.prototype.displayQuestion = function () {
    $('.question-text').text(this.questionText);
    $('#answerForm').append("<input type='text' class='form-control sa-input' placeholder='Type your answer here' name='answer'/>")
}

function TrueOrFalse (questionText, questionAnswer) {
    Question.call(this, questionText, questionAnswer);
}

TrueOrFalse.prototype = Object.create(Question.prototype);
TrueOrFalse.prototype.constructor = TrueOrFalse;

TrueOrFalse.prototype.displayQuestion = function () {
    $('.question-text').text(this.questionText);
    let answerradios = "";
    answerradios += "<div class='radio'><label><input type='radio' name='answer' value='true'>true</label></div>";
    answerradios += "<div class='radio'><label><input type='radio' name='answer' value='false'>false</label></div>";
    $('#answerForm').append(answerradios);

}