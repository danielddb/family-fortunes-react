import Attempts from '../../components/attempts/attempts';
import Question from '../../components/question/question';
import React from 'react';
import style from './questions.styl';
import { ANSWER_KEY_MAP, PLAYER_KEY_MAP, ATTEMPT_KEY, NEXT_KEY } from '../../constants/app.js';

const BUZZER_AUDIO = require('./audio/buzzer.mp3'), 
    CORRECT_AUDIO = require('./audio/correct-no-presenter.mp3'),
    TOP_CORRECT_AUDIO = require('./audio/top-correct-no-presenter.mp3'), 
    INCORRECT_AUDIO = require('./audio/incorrect-no-presenter.mp3'),
    WON_BOARD_AUDIO = require('./audio/won-board.mp3');

class Questions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attempts: {},
            disableInput: false,
            isBuzzerRound: true,
            stolen: false,
            data: props.data,
            playerAnswers: [],
            questionIndex: 0
        }
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keyup', this.handleKeyUp);
    }

    componentWillUnMount() {
        window.addEventListener('keyup', this.handleKeyUp);
    }

    handleKeyUp(e) {
        const { currentPlayer } = this.props;

        if(this.state.disableInput) return;

        if(currentPlayer === '') {
            if(PLAYER_KEY_MAP[e.keyCode]) {
                const audio = new Audio(BUZZER_AUDIO);
                audio.play();
                this.props.onPlayerChange(PLAYER_KEY_MAP[e.keyCode]);
                this.props.onMessageUpdate(`${this.props[this.props.currentPlayer].name} buzzed`);
            }
            return;
        }

        if(this.isCurrentQuestionComplete) {
            if(e.keyCode !== NEXT_KEY) return;

            if(this.state.data.length === this.state.questionIndex + 1) {
                this.props.onQuestionsComplete();
                this.props.onMessageUpdate('');
            }
            else {
                this.props.onPlayerChange('');
                this.props.onMessageUpdate('');
                this.setState({
                    questionIndex: this.state.questionIndex + 1,
                    isBuzzerRound: true,
                    stolen: false
                });
            }
        }
        if(this.canPlayOrPass) {
            if(!PLAYER_KEY_MAP[e.keyCode]) return;

            this.props.onPlayerChange(PLAYER_KEY_MAP[e.keyCode]);
            this.props.onMessageUpdate('');

            this.resetPlayersAttempts(
                this.state.questionIndex,
                0,
                () => this.setState({
                    isBuzzerRound: false,
                })
            );
        }
        else {
            this.updatePlayerAnswers(ANSWER_KEY_MAP[e.keyCode]);
            this.updatePlayerAttempts(e.keyCode);
        }
    }

    /**
     * Updates player attempts
     * @param {number} answerIndex
     */
    updatePlayerAttempts(keyCode) {
        const { attempts, questionIndex, isBuzzerRound, stolen } = this.state,
            { currentPlayer } = this.props;

        if(keyCode === ATTEMPT_KEY) {
            if(stolen) return;

            const newAttempts = { ...attempts };
            newAttempts[questionIndex] = { ...this.currentQuestionAttempts };
            newAttempts[questionIndex][currentPlayer] = this.currentQuestionAttemptsForCurrentPlayer + 1;

            this.setState({ attempts: newAttempts });

            const audio = new Audio(INCORRECT_AUDIO);
            audio.play();

            // if current player has had 1 attempt
            // and opponent has had no attempts
            // and is buzzer round
            // switch player.
            if(this.currentQuestionAttemptsForCurrentPlayer == 1
                && this.currentQuestionAttemptsForOpponent == 0
                && isBuzzerRound) {
                    this.props.onPlayerChange(this.opponentKey);
                    this.props.onMessageUpdate(`${this.props[this.props.currentPlayer].name} turn to guess`);
            }
            // if current player has had 1 attempt
            // and opponent has had 1 attempt
            // and is buzzer round...
            // reset attempts for both players
            // then switch player.
            else if(this.currentQuestionAttemptsForCurrentPlayer == 1
                && this.currentQuestionAttemptsForOpponent == 1
                && isBuzzerRound) {
                    this.props.onMessageUpdate(`${this.props[this.opponentKey].name}, try again`);
                    this.resetPlayersAttempts(
                        questionIndex,
                        2000,
                        () => this.props.onPlayerChange(this.opponentKey)
                    );
            }
            // if current player has had 3 attempts...
            // switch player - chance to steal the board
            else if(this.currentQuestionAttemptsForCurrentPlayer == 3) {
                this.props.onPlayerChange(this.opponentKey);
                this.props.onMessageUpdate(`Chance to steal the board`);
            }
            // if current player has had 1 attempt
            // and opponent has had 3 attempts...
            // failed to steal.
            // switch player - reveal board
            else if(this.currentQuestionAttemptsForCurrentPlayer == 1
                && this.currentQuestionAttemptsForOpponent == 3) {
                this.setState({
                    stolen: true
                });
                this.props.onPlayerChange(this.opponentKey);
                this.props.onMessageUpdate(`${this.props[this.props.currentPlayer].name} won the board`);
            }
        }
    }

    /**
     * Resets player attempts for a question
     * @param {number} answerIndex
     */
    resetPlayersAttempts(questionIndex, delay = 0, callback = () => {}) {
        const { attempts } = this.state,
            { currentPlayer } = this.props;

        const newAttempts = { ...attempts };
        newAttempts[questionIndex] = { ...this.currentQuestionAttempts };
        newAttempts[questionIndex][currentPlayer] = 0;
        newAttempts[questionIndex][this.opponentKey] = 0;

        this.setState({ disableInput: true });
        setTimeout(() => this.setState({ attempts: newAttempts, disableInput: false }, callback()), delay);
    }

    /**
     * Updates player answers for the current question
     * @param {number} answerIndex
     */
    updatePlayerAnswers(answerIndex) {
        const { playerAnswers, questionIndex, isBuzzerRound } = this.state;

        if(!this.answerExistsInCurrentQuestion(answerIndex)
            || this.currentQuestionAnswerAnswered(answerIndex)) return;

        let answers = [ ...playerAnswers ];
        answers[questionIndex] = [ ...this.currentQuestionAnswers ];
        
        if(answers[questionIndex].indexOf(answerIndex) === -1)
            answers[questionIndex].push(answerIndex);

        this.setState({ playerAnswers: answers });

        if(!this.currentQuestionAnswerAnswered(0)
            && this.currentQuestionAttemptsForCurrentPlayer == 0 
            && this.currentQuestionAttemptsForOpponent == 0
            && this.currentQuestionAnswers.length == 1
            && isBuzzerRound) {
                this.props.onPlayerChange(this.opponentKey);
                this.props.onMessageUpdate(`${this.props[this.props.currentPlayer].name} turn to guess`);
        }
        else if(!this.currentQuestionAnswerAnswered(0)
                && this.currentQuestionAttemptsForCurrentPlayer == 0 
                && this.currentQuestionAttemptsForOpponent == 0
                && this.currentQuestionAnswers.length == 2
                && isBuzzerRound) {
                    if(answerIndex >= this.currentQuestionAnswers[0])
                        this.props.onPlayerChange(this.opponentKey);
                    this.props.onMessageUpdate(`${this.props[this.props.currentPlayer].name}, play or pass?`);
        }
        else if(this.isCurrentQuestionComplete) {
            this.props.onQuestionComplete(this.currentQuestionAnswersTotal);
            this.props.onMessageUpdate(`${this.props[this.props.currentPlayer].name} won the board`);
        }
        else if(this.canPlayOrPass) {
            this.props.onMessageUpdate(`${this.props[this.props.currentPlayer].name}, play or pass?`);
        }
        else if(this.currentQuestionAttemptsForOpponent == 3) {
            this.setState({
                stolen: true
            });
            this.props.onMessageUpdate(`${this.props[this.props.currentPlayer].name} won the board`);
        }

        if(answerIndex === 0) {
            const audio = new Audio(TOP_CORRECT_AUDIO);
            audio.play();
        }
        else {
            const audio = new Audio(CORRECT_AUDIO);
            audio.play();
        }
    }

    /**
     * Checks answer is answered in the current question
     * @param {number} answerIndex
     */
    currentQuestionAnswerAnswered(answerIndex) {
        return this.currentQuestionAnswers.indexOf(answerIndex) !== -1;
    }

    /**
     * Checks if answer exists in the current question
     * @param {number} answerIndex
     */
    answerExistsInCurrentQuestion(answerIndex) {
        return this.currentQuestion.answers[answerIndex] !== undefined;
    }

    get canPlayOrPass() {
        return this.currentQuestionAnswerAnswered(0)
            && this.currentQuestionAttemptsForCurrentPlayer == 0 
            && this.currentQuestionAnswers.length <= 2
            && this.state.isBuzzerRound
            ||
            this.currentQuestionAttemptsForOpponent == 0
            && this.currentQuestionAnswers.length == 2
            && this.state.isBuzzerRound
            ||
            this.currentQuestionAttemptsForOpponent == 1
            && this.currentQuestionAnswers.length == 1
            && this.state.isBuzzerRound;
    }

    get currentQuestionAnswersTotal() {
        return this.currentQuestion.answers.map(answer => answer.total).reduce((prev, curr) => prev + curr); 
    }

    get isCurrentQuestionComplete() {
        return this.currentQuestionAnswers.length == this.currentQuestion.answers.length;
    }

    get currentQuestionAttempts() {
        return this.state.attempts[this.state.questionIndex] || {};
    }

    get currentQuestionAttemptsForCurrentPlayer() {
        return this.currentQuestionAttempts[this.props.currentPlayer] || 0;
    }

    get currentQuestionAttemptsForOpponent() {
        return this.currentQuestionAttempts[this.opponentKey] || 0;
    }

    get currentQuestionAnswers() {
        return this.state.playerAnswers[this.state.questionIndex] || [];
    }

    get currentQuestion() {
        return this.state.data[this.state.questionIndex];
    }

    get opponentKey() {
        return this.props.currentPlayer === 'player1' ? 'player2' : 'player1';
    }

    render() {
        const isBuzzerRound = this.props.currentPlayer === '';

        let divs = null;

        if(isBuzzerRound)
            divs = (
                <div className="u-text-center">
                    <h1>Buzzer round!</h1>
                    <p>Q{this.state.questionIndex + 1} of {this.state.data.length}</p>
                </div>
            );
        else {
            divs = (
                <div className="questions">
                    <Attempts attempts={this.currentQuestionAttempts['player1'] || 0}/>
                    <Question
                        number={this.state.questionIndex + 1}
                        question={this.currentQuestion}
                        playerAnswers={this.currentQuestionAnswers}/>
                    <Attempts attempts={this.currentQuestionAttempts['player2'] || 0}/>
                </div>
            )
        }

        return divs;
    }
}

Questions.propTypes = {
    currentPlayer: React.PropTypes.string.isRequired,
    data: React.PropTypes.array.isRequired,
    onMessageUpdate: React.PropTypes.func.isRequired,
    onQuestionComplete: React.PropTypes.func.isRequired,
    onQuestionsComplete: React.PropTypes.func.isRequired,
    onPlayerChange: React.PropTypes.func.isRequired
};

export default Questions;