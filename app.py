from flask import Flask, request, render_template, session, jsonify
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = "oh-so-secret"

boggle_game = Boggle()

@app.route('/')
def show_board():
    """Shows  board to start"""

    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get('highscore', 0)
    num_plays = session.get('num_plays', 0)
    return render_template("index.html", 
                           board = board, 
                           highscore = highscore, 
                           num_plays = num_plays)


@app.route('/check-word')
def check_word():
    """Checks if guessed word is in dictionary"""

    board = session['board']
    guess = request.args['guess']
    result = boggle_game.check_valid_word(board, guess)

    return jsonify({"result": result})


@app.route('/end-game', methods=["POST"])
def end_game():
    """Handles end of game, updating high score and number of plays"""

    score = request.json['score']
    highscore = session.get('highscore', 0)
    num_plays = session.get('num_plays', 0)

    session['highscore'] = max(score, highscore)
    session['num_plays'] = num_plays + 1

    #returns true if highscore was broken
    new_highscore = (score > highscore)
    return jsonify({"new_highscore": new_highscore})

