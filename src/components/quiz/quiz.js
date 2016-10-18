import React from 'react';
import Question from '../question/question';
import style from './quiz.styl';

class Quiz extends React.Component {
    constructor() {
        super();
        this.state = {
            answers: {},
            index: -1
        };
        this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keyup', this.onKeyUp);
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.onKeyUp);
    }

    onKeyUp(e) {
        if(!this.isEnd)
            if(this.isStart || this.isQuestionComplete)
                if(e.keyCode === 39) // right key
                    this.setState({
                        index: this.state.index + 1
                    });
                    
        if(this.state.index >= 0)
            if(e.keyCode === 37) // left key
                this.setState({
                    index: this.state.index - 1
                });

        if(e.keyCode === 32) { // space key
            const file = require('./audio/incorrect.mp3');
            const audio = new Audio(file);
            audio.play();
        }
    }

    handleAnswerSelected(questionIndex, answerIndex) {
        let answers = this.state.answers;
        if(answers[questionIndex] === undefined)
            answers[questionIndex] = {};

        if(answers[questionIndex][answerIndex] === undefined)
            answers[questionIndex][answerIndex] = {};

        this.setState({
            answers
        });
    }

    isQuestionAnswerAnswered(answers, questionIndex, answerIndex) {
        return (answers[questionIndex] === undefined || answers[questionIndex][answerIndex] === undefined) ? false : true;
    }

    render() {
        const { index } = this.state;

        if (this.isStart) {
            return (
                <div className="quiz">
                    <h1>Family Fortunes</h1>
                </div>
            );
        }
        else if (this.isEnd) {
            return (
                <div className="quiz">
                    <div>
                        <div>Thanks for playing!</div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="quiz">
                    <Question
                    index={index}
                    question={this.props.quiz[index]}
                    answers={this.state.answers}
                    onAnswerSelected={this.handleAnswerSelected} />
                </div>
            );
        }
    }

    get isStart() {
        return this.state.index === -1;
    }

    get isEnd() {
        return this.state.index === this.props.quiz.length;
    }

    get isQuestionComplete() {
        let correct = true; 
        
        this.props.quiz[this.state.index].answers.forEach((answer, i) => {
            if(!this.isQuestionAnswerAnswered(this.state.answers, this.state.index, i ))
                correct = false;
        });

        return correct;
    }
}

Quiz.propTypes = {
    quiz: React.PropTypes.array.isRequired
};

export default Quiz;