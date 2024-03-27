let score = 0;
let sec = 60;


//timer resource:
//https://www.youtube.com/watch?time_continue=348&v=x7WJEmxNlEs&embeds_referring_euri=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Dhow%2Bto%2Bput%2Ba%2Btimer%2Bon%2Ba%2Bgame%2Bjs%2Bdom%2Bjs%26sca_esv%3D97d3c4185a5a42ee%26rlz%3D1C5CHFA_enUS939US939%26sxsrf%3DA&source_ve_path=Mjg2NjMsMjg2NjMsMjM4NTE&feature=emb_title
const timer = setInterval(countdown, 1000);

function countdown(){
    displayTimer(sec);
    sec--; 
    if (sec < 0){
        clearInterval(timer);
    }
}

function displayTimer(sec){
    $(".timer").text(`${sec}`)
}


function displayMessage(msg){
    $(".response").html(msg)
}


function displayScore(score){
    $(".score").text(score)
}


async function handleGuess(evt){
    evt.preventDefault();
    let guess = $("#guess").val();
    const resp = await axios.get("/check-word", {params: {guess}});
    
    //checks for word validity from server response
    if (resp.data.result === 'not-on-board'){
        displayMessage(`<bold>${guess}</bold> isn't on the board`);
    }
    else if (resp.data.result === 'not-a-word'){
        displayMessage(`<bold>${guess}</bold> isn't a word`);
    }
    else{
        displayMessage(`<bold>${guess}</bold> is on the board!`);
        score += guess.length;
        displayScore(score);
    }
}
$("#submit-word-form").on("submit", handleGuess)

// async function endGame(){

// }