import Attempts from './components/attempts/attempts';
import Complete from './components/complete/complete';
import PlayerSelector from './components/player-selector/player-selector';
import Scoreboard from './components/scoreboard/scoreboard';
import Start from './components/start/start';
import React from 'react';
import ReactDOM from 'react-dom';
import data from './constants/data';
import style from './base/base.styl';
import style1 from './components/quiz/quiz.styl';
import style2 from './components/question/question.styl';
import style3 from './components/answer/answer.styl';
import style4 from './components/total/total.styl';

const PLAYER_1_SYMBOL = 'player1',
    PLAYER_2_SYMBOL = 'player2',
    MAX_ATTEMPTS = 3,
    MAX_STEAL_ATTEMPTS = 1,
    CORRECT_AUDIO = require('./components/answer/audio/correct-no-presenter.mp3'),
    TOP_CORRECT_AUDIO = require('./components/answer/audio/top-correct-no-presenter.mp3'),
    INCORRECT_AUDIO = require('./components/quiz/audio/incorrect-no-presenter.mp3');

const PLAYER_1 = {
    name: '',
    active: false,
    total: 0,
    attempts: {},
    answers: {}
};

const PLAYER_2 = {
    name: '',
    active: false,
    total: 0,
    attempts: {},
    answers: {}
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            player1: props.player1,
            player2: props.player2,
            screenIndex: 0
        };
        this.handleGameStarted = this.handleGameStarted.bind(this);
        this.handlePlayersSelected = this.handlePlayersSelected.bind(this);
        this.handleComplete = this.handleComplete.bind(this);

        const theme = require('./components/start/audio/theme.mp3');
        this.themeTune = new Audio(theme);
        
        const end = require('./components/complete/audio/end-theme.mp3');
        this.endThemeTune = new Audio(end);
    }

    get isStartScreen() {
        this.themeTune.play();
        return this.state.screenIndex === 0;
    }

    get isPlayerSelectScreen() {
        return this.state.screenIndex === 1;
    }

    get isGameScreen() {
        this.themeTune.pause();
        this.themeTune.currentTime = 0;
        return this.state.screenIndex === 2;
    }

    get isGameEndScreen() {
        this.endThemeTune.play();
        return this.state.screenIndex === 3;
    }

    handleGameStarted() {
        this.setState({
            screenIndex: this.state.screenIndex + 1
        });
    }

    handlePlayersSelected(player1Name, player2Name) {
        const player1 = {
            ...this.state.player1,
            name: player1Name
        };

        const player2 = {
            ...this.state.player2,
            name: player2Name
        };

        this.setState({
            player1,
            player2,
            screenIndex: this.state.screenIndex + 1
        });
    }

    handleComplete(player1, player2) {
        this.setState({
            screenIndex: this.state.screenIndex + 1,
            player1,
            player2
        });
    }

    render() {
        if (this.isStartScreen)
            return <Start onStarted={this.handleGameStarted}/>
        else if (this.isPlayerSelectScreen)
            return <PlayerSelector onPlayersSelected={this.handlePlayersSelected} />
        else if (this.isGameScreen)
            return <Game
                        player1={this.state.player1}
                        player2={this.state.player2}
                        questions={this.props.data}
                        onComplete={this.handleComplete} />
        else if (this.isGameEndScreen)
            return <Complete
                        player1={this.state.player1}
                        player2={this.state.player2} />
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            questionIndex: 0,
            player2: props.player2,
            player1: props.player1,
            playerSelectMode: true
        };
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keyup', this.handleKeyUp);
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    handleKeyUp(e) {
        const key = e.keyCode,
            enterKey = 13,
            spaceKey = 32,
            leftKey = 37,
            rightKey = 39;

        if(key === enterKey && this.isActiveQuestionComplete) {
            // if all questions complete
            if(this.props.questions.length === this.state.questionIndex + 1) {
                this.props.onComplete(this.state.player1, this.state.player2);
                return;
            }
            // else go to next question
            else {
                this.setState({
                    questionIndex: this.state.questionIndex + 1,
                    playerSelectMode: true
                });
            }
        }

        if(!this.isActiveQuestionComplete && !this.state.playerSelectMode && key === spaceKey) {
            const audio = new Audio(INCORRECT_AUDIO);
            audio.play();
            this.updateAttempts(this.state.questionIndex);
        }
        else if(key === spaceKey) {
            const audio = new Audio(INCORRECT_AUDIO);
            audio.play();
        }
        

        if(key === rightKey && this.state.playerSelectMode) this.switchActivePlayer(PLAYER_2_SYMBOL);
        if(key === leftKey && this.state.playerSelectMode) this.switchActivePlayer(PLAYER_1_SYMBOL);
    }

    get activePlayer() {
        const { player1, player2 } = this.state;
        if(!player1.active && !player2.active)
            return null;
        else
            return player1.active ? player1 : player2;
    }

    get activePlayerKey() {
        const { player1, player2 } = this.state;
        if(!player1.active && !player2.active)
            return null;
        else
            return player1.active ? PLAYER_1_SYMBOL : PLAYER_2_SYMBOL;
    }

    get isActiveQuestionComplete() {
        let correct = true; 
        
        this.props.questions[this.state.questionIndex].answers.forEach((answer, i) => {
            if(!this.getCombinedAnswers[i])
                correct = false;
        });

        return correct;
    }

    get getCombinedAnswers() {
        return { ...this.state.player1.answers[this.state.questionIndex], ...this.state.player2.answers[this.state.questionIndex] };
    }

    render() {
        const { questions } = this.props,
            { player1, player2, questionIndex, playerSelectMode } = this.state;

        const questionToggle = !playerSelectMode
        ? (
            <Question 
                activePlayer={this.activePlayer}
                disabled={this.isActiveQuestionComplete || playerSelectMode}
                player1={player1}
                player2={player2}
                question={questions[questionIndex]}
                questionIndex={questionIndex}
                onAnswerAnswered={this.handleAnswerAnswered.bind(this)}
                />
        )
        : (
            <div className="u-text-center">
                <h1>Buzzer round</h1>
                <p>Q{this.state.questionIndex + 1} of {questions.length}</p> 
            </div>
        );

        return(
            <div className="quiz">
                <div className="scoreboards">
                    <Scoreboard 
                        active={player1.active && !playerSelectMode }
                        name={player1.name}
                        total={player1.total} />
                    <Scoreboard 
                        active={player2.active && !playerSelectMode}
                        name={player2.name}
                        total={player2.total} />
                </div>
                {questionToggle}
            </div>
        );
    }

    handleAnswerAnswered(questionIndex, answerIndex) {
        if(this.state.playerSelectMode) return;
        
        let activeAnswers = this.activePlayer.answers;

        if(activeAnswers[questionIndex] === undefined) activeAnswers[questionIndex] = {};
        if(activeAnswers[questionIndex][answerIndex] === undefined) activeAnswers[questionIndex][answerIndex] = 0;

        this.setState({
            [this.activePlayerKey]: {
                ...this.activePlayer,
                answers: {
                    ...activeAnswers,
                    [questionIndex]: {
                        ...activeAnswers[questionIndex],
                        [answerIndex]: this.props.questions[questionIndex].answers[answerIndex].total
                    }
                }
            }
        },() => {
            if(this.isActiveQuestionComplete)
                this.setState({
                    [this.activePlayerKey]: {
                        ...this.state[this.activePlayerKey],
                        total: this.state[this.activePlayerKey].total + this.props.questions[questionIndex].answers.map((answer) => answer.total).reduce((prev, curr) => prev + curr)
                    }
                });
        });
    }

    updateAttempts(questionIndex) {
        this.setState({
            [this.activePlayerKey]: {
                ...this.activePlayer,
                attempts: {
                    ...this.activePlayer.attempts,
                    [questionIndex]: (this.activePlayer.attempts[questionIndex] || 0) + 1
                }
            }
        }, () => {
            const opponentKey = this.activePlayerKey === PLAYER_1_SYMBOL ? PLAYER_2_SYMBOL : PLAYER_1_SYMBOL,
                opponentAttempts = this.state[opponentKey].attempts[questionIndex],
                activePlayerAttempts = this.activePlayer.attempts[questionIndex];
            
            // opponent wins as active player has failed their steal
            if(activePlayerAttempts === MAX_STEAL_ATTEMPTS && opponentAttempts === MAX_ATTEMPTS) {
                console.log('opponent wins!');
                this.switchActivePlayer(opponentKey);
            }
            // switch player when max attempts reached
            else if(activePlayerAttempts === MAX_ATTEMPTS) {
                console.log('max attempts reached');
                this.switchActivePlayer(opponentKey);
            }
        });
    }
    
    switchActivePlayer(playerKey, callback = () => {}) {
        const opponentKey = playerKey === PLAYER_1_SYMBOL ? PLAYER_2_SYMBOL : PLAYER_1_SYMBOL;

        this.setState({
            [playerKey]: {
                ...this.state[playerKey],
                active: true
            },
            [opponentKey]: {
                ...this.state[opponentKey],
                active: false
            },
            playerSelectMode: false
        }, () => callback());
    }
}

class Question extends React.Component {

    isAnswered(questionIndex, answerIndex) {
        const answers = { ...this.props.player1.answers[questionIndex], ...this.props.player2.answers[questionIndex] };
        if(answers[answerIndex] === undefined) return;
        return true;
    }

    get total() {
        const { question, questionIndex } = this.props;

        const answers = { ...this.props.player1.answers[questionIndex], ...this.props.player2.answers[questionIndex] };

        return question.answers.map((answer, i) => { 
            if(answers[i] === undefined) return 0;
            return answers[i];
         }).reduce((prev, curr) => prev + curr);
    }

    render() {
        const { activePlayer, player1, player2, question, questionIndex } = this.props;

        return(
            <div className="board">
                <Attempts total={player1.attempts[questionIndex] || 0} />
                <div className="question">
                    <div className="question__title">{questionIndex + 1}. {question.title}</div>
                    {this.props.question.answers.map((answer, i) => {
                        return (
                            <Answer 
                                answer={answer}
                                answered={this.isAnswered(questionIndex, i)}
                                answerIndex={i}
                                disabled={this.props.disabled}
                                onAnswered={this.props.onAnswerAnswered}
                                questionIndex={questionIndex}
                                key={i} />
                        );
                    })}
                    <div className="total">
                        <div className="total__label">Total</div>
                        <div className={this.total === 0 ? "total__amount total__amount--empty" : "total__amount" }>{this.total === 0 ? '--' : this.total}</div>
                    </div>
                </div>
                <Attempts total={player2.attempts[questionIndex] || 0} />
            </div>
        );
    }
}

class Answer extends React.Component {
    constructor(props) {
        super(props);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keyup', this.handleKeyUp);
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.handleKeyUp);
    }
    
    render() {
        const { answer, answered, answerIndex, questionIndex } = this.props;

        if(this.props.answered) {
            return(
                <div className="answer">
                    <div className="answer__number">{answerIndex + 1}</div>
                    <div className="answer__title answer__title--answered">{answer.title}</div>
                    <div className="answer__total">{answer.total}</div>
                </div>
            );
        }
        else {
            return(
                <div className="answer">
                    <div className="answer__number">{answerIndex + 1}</div>
                    <div className="answer__title"></div>
                    <div className="answer__total answer__total--empty">--</div>
                </div>
            );
        }
    }

    handleKeyUp(e) {
        if(this.getIndexAsKeyboardCode(e.keyCode) === this.props.answerIndex 
            && !this.props.answered
            && !this.props.disabled) {
                let audio;
                if(this.props.answerIndex === 0) {
                    audio = new Audio(TOP_CORRECT_AUDIO);
                    audio.play();
                }
                else {
                    audio = new Audio(CORRECT_AUDIO);
                    audio.play();
                }
                this.props.onAnswered(this.props.questionIndex, this.props.answerIndex);
        }
    }

    getIndexAsKeyboardCode(keyCode) {
        switch(keyCode) {
            case 49:
                return 0;
            case 50:
                return 1;
            case 51:
                return 2;
            case 52:
                return 3;
            case 53:
                return 4;
            case 54:
                return 5;
            case 55:
                return 6;
            case 56:
                return 7;
            case 57:
                return 8;
        }
    }
} 

ReactDOM.render(<App data={data} player1={PLAYER_1} player2={PLAYER_2}/>, document.getElementById('app'));

if (module.hot)
    module.hot.accept();