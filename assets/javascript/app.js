//Ensure that js doesn't get run until the HTML document is finished loading
$(document).ready(function () {
    //Trivia questions function
    $.fn.trivia = function () {
        var triv = this;
        triv.userPick = null;
        triv.answers = {
            correct: 0,
            incorrect: 0
        };
        //Initial timer values setting
        triv.count = 30;
        triv.current = 0;
        //Questions, answer options, and correct response array
        triv.questions = [{

            question: "Where is the breech on an artillery piece?",
            choices: ["Beginning of tube", "End of tube", "Underneath tube", "On top of tube"],
            correct: 0

        }, {
            question: "Where is the muzzle on an artllery piece?",
            choices: ["Beginning of tube", "End of tube", "Underneath tube", "On top of tube"],
            correct: 1

        }, {
            question: "What device is used to fire an artillery piece?",
            choices: ["Puller", "Fuze", "Lanyard", "Handle"],
            correct: 2

        }, {
            question: "In gunnery, drift is a function of_____?",
            choices: ["Elevation", "Deflection", "Windspeed", "Yaw"],
            correct: 0

        }, {
            question: "The nickname of the field artillery is ____?",
            choices: ["Duke of Battle", "Queen of Battle", "King of Battle", "Prince of Tides"],
            correct: 2

        }, {
            question: "What are the two colors of the field artillery?",
            choices: ["White and Red", "Maroon and White", "Scarlet and Yellow", "Red and Gold"],
            correct: 2
        }];
        //Ask question function
        triv.ask = function () {
            if (triv.questions[triv.current]) {
                $('#timer').html("Time remaining: " + "00:" + triv.count + " secs");
                $('#questions').html(triv.questions[triv.current].question);
                var choicesArr = triv.questions[triv.current].choices;

                for (var i = 0; i < choicesArr.length; i++) {
                    var button = $('<button>');
                    button.text(choicesArr[i]);
                    button.attr('data-id', i);
                    $('#choices').append(button);
                }
                window.triviaCounter = setInterval(triv.timer, 1000);
            } else {
                $('body').append($('<div />', {
                    text: 'Unanswered: ' + (
                        triv.questions.length - (triv.answers.correct + triv.answers.incorrect)),
                    class: 'result'
                }));
                //Start button becomes Restart button
                $('#start_button').text('Restart').appendTo('body').show();
                pauseAudio();
            }
        };
        //Timer countdown function
        triv.timer = function () {
            triv.count--;
            if (triv.count <= 0) {
                setTimeout(function () {
                    triv.nextQ();
                });

            } else {
                $("#timer").html("Time remaining: " + "00:" + triv.count + " secs");
            }
        };
        //Next question function that resets timer function
        triv.nextQ = function () {
            triv.current++;
            clearInterval(window.triviaCounter);
            triv.count = 30;
            $('#timer').html("");
            setTimeout(function () {
                triv.cleanUp();
                triv.ask();
            }, 1000)
        };
        //Clean up between questions by resetting timer, question, and answer html data
        triv.cleanUp = function () {
            $('h2[id]').each(function () {
                $(this).html('');
            });
            $('.correct').html('Correct answers: ' + triv.answers.correct);
            $('.incorrect').html('Incorrect answers: ' + triv.answers.incorrect);
        };
        //Answer counter
        triv.answer = function (correct) {
            var string = correct ? 'correct' : 'incorrect';
            triv.answers[string]++;
            $('.' + string).html(string + ' answers: ' + triv.answers[string]);
        };
        return triv;
    };
    //Start button
    var Trivia;
    var audio = document.getElementById("Army_Song");
    function playAudio() {
        audio.play();
    }
    function pauseAudio() {
        audio.pause();
    }

    $("#start_button").click(function () {
        /* document.getElementById("Army_Song").addEventListener("play", Trivia);
        console.log(); */
        playAudio();
        $(this).hide();
        $('.result').remove();
        $('#choices').html('');
        Trivia = new $(window).trivia();
        Trivia.ask();
    });
    //User answer selection response routine
    $('#choices').on('click', 'button', function () {
        var userPick = $(this).data("id"),
            triv = Trivia || $(window).trivia(),
            index = triv.questions[triv.current].correct,
            correct = triv.questions[triv.current].choices[index];

        if (userPick !== index) {
            $('#choices').text("Incorrect! The correct answer was: " + correct);
            triv.answer(false);
        } else {
            $('#choices').text("Your answer is correct! It was: " + correct);
            triv.answer(true);
        }
        triv.nextQ();
    });

}); 