let score = 0;
let sec = 5;
let correct_guesses = new Set();

/** Sets timer and stops guesses when timer is up
 * 
 * timer resource:
 * https://www.youtube.com/watch?time_continue=348&v=x7WJEmxNlEs&embeds_referring_euri=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Dhow%2Bto%2Bput%2Ba%2Btimer%2Bon%2Ba%2Bgame%2Bjs%2Bdom%2Bjs%26sca_esv%3D97d3c4185a5a42ee%26rlz%3D1C5CHFA_enUS939US939%26sxsrf%3DA&source_ve_path=Mjg2NjMsMjg2NjMsMjM4NTE&feature=emb_title
 */ 
const timer = setInterval(countdown, 1000);

function countdown(){
    displayTimer(sec);
    sec--; 
    if (sec < 0){
        clearInterval(timer);
        endGame();
    }
}

/**
 * Front-end display functions
 */
function displayTimer(sec){
    $(".timer").text(`${sec}`)
}

function displayMessage(msg, cls){
    $("#response").removeClass().addClass(`${cls}`).html(msg);
}

function displayScore(score){
    $(".score").text(score)
}

/**
 * handles guess by checking response from server and displaying corresponding message
 */
async function handleGuess(evt){
    evt.preventDefault();
    let guess = $("#guess").val();
    console.log(guess);
    const resp = await axios.get('/check-word', {params: {guess}});
    
    //checks for word validity from server response
    if (resp.data.result === 'not-on-board'){
        displayMessage(`<b>${guess.toUpperCase()}</b> isn't on the board!`, 'invalid');
    }
    else if (resp.data.result === 'not-word'){
        displayMessage(`<b>${guess.toUpperCase()}</b> isn't a valid word!`, 'invalid');
    }
    else if (resp.data.result === 'ok'){
        if (correct_guesses.has(guess)){
            displayMessage(`You already guessed <b>${guess.toUpperCase()}</b>!`, 'invalid');
        }
        else{
            displayMessage(`<b>${guess.toUpperCase()}</b> is on the board!`, 'valid');
            correct_guesses.add(guess);
            score += guess.length;
        }
        displayScore(score);
    }
    $("#submit-word-form").trigger('reset');
}
$("#submit-word-form").on("submit", handleGuess);


/** Stop guessing and checks if score beat highscore by sending score to server
 *  Displays appropriate message
 */
async function endGame(){
    $('#submit-button').prop('disabled', true);
    const resp = await axios.post('/end-game', {score: score});
    if (resp.data.new_highscore){
        displayMessage(`Hooray! You set a new highscore: <b>${score}<b>` , 'finish');
    }
    else{
        displayMessage(`Good job, you scored: <b>${score}<b>`, 'finish');
    }
}