
class BoggleGame {
    constructor(sec){
        this.score = 0;
        this.sec = sec;
        this.correct_guesses = new Set();
        //timer every second and logic for ending game
        this.timer = setInterval(this.countdown.bind(this), 1000);
        //event listener when a guess submitted
        $("#submit-word-form").on("submit", this.handleGuess.bind(this));
    }

    /** Sets timer and stops guesses when timer is up
     * 
     * timer resource:
     * https://www.youtube.com/watch?time_continue=348&v=x7WJEmxNlEs&embeds_referring_euri=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Dhow%2Bto%2Bput%2Ba%2Btimer%2Bon%2Ba%2Bgame%2Bjs%2Bdom%2Bjs%26sca_esv%3D97d3c4185a5a42ee%26rlz%3D1C5CHFA_enUS939US939%26sxsrf%3DA&source_ve_path=Mjg2NjMsMjg2NjMsMjM4NTE&feature=emb_title
     */ 
    countdown(){
        this.displayTimer(this.sec);
        this.sec--; 
        if (this.sec < 0){
            clearInterval(this.timer);
            this.endGame();
        }
    }

    /**
     * Front-end display functions
     */
    displayTimer(sec){
        $(".timer").text(`${sec}`)
    }

    displayScore(score){
        $(".score").text(score)
    }

    displayMessage(msg, cls){
        $("#response").removeClass().addClass(`${cls}`).html(msg);
    }

    displayWords(word){
        $("#words").append(`<li>${word}</li>`);
    }

    /**
     * handles guess by checking response from server and displaying corresponding message
     */
    async handleGuess(evt){
        evt.preventDefault();
        let guess = $("#guess").val();
        console.log(guess);
        const resp = await axios.get('/check-word', {params: {guess}});
        
        //checks for word validity from server response
        if (resp.data.result === 'not-on-board'){
            this.displayMessage(`<b>${guess.toUpperCase()}</b> isn't on the board!`, 'invalid');
        }
        else if (resp.data.result === 'not-word'){
            this.displayMessage(`<b>${guess.toUpperCase()}</b> isn't a valid word!`, 'invalid');
        }
        else if (resp.data.result === 'ok'){
            if (this.correct_guesses.has(guess)){
                this.displayMessage(`You already guessed <b>${guess.toUpperCase()}</b>!`, 'invalid');
            }
            else{
                this.displayMessage(`<b>${guess.toUpperCase()}</b> is on the board!`, 'valid');
                this.correct_guesses.add(guess);
                this.score += guess.length;
            }
            this.displayScore(this.score);
        }
        $("#submit-word-form").trigger('reset');
    }

    /** Stop guessing and checks if score beat highscore by sending score to server
     *  Displays appropriate message
     */
    async endGame(){
        $('#submit-button').prop('disabled', true);
        const resp = await axios.post('/end-game', {score: this.score});
        if (resp.data.new_highscore){
            this.displayMessage(`Hooray! You set a new highscore: <b>${this.score}<b>` , 'finish');
        }
        else{
            this.displayMessage(`Good job, you scored: <b>${this.score}<b>`, 'finish');
        }
        //displays play again and all valid guessed words
        $("#play-again").removeClass('hidden');
        for (let word of this.correct_guesses){
            this.displayWords(`${word.toUpperCase()}`);
        }
    }
}

let game = new BoggleGame(60);