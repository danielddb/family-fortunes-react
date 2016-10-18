import React from 'react';
import Answer from '../answer/answer';
import Total from '../total/total';
import style from './question.styl';

class Question extends React.Component {

    constructor() {
        super();
        this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
    }

    handleAnswerSelected(answerIndex) {
        this.props.onAnswerSelected(this.props.index, answerIndex);
    }

    checkAnswer(answerIndex) {
        const { answers, index } = this.props;

        return this.isAnswered(answers, index, answerIndex );
    }

    isAnswered(answers, questionIndex, answerIndex) {
        return (answers[questionIndex] === undefined || answers[questionIndex][answerIndex] === undefined) ? false : true;
    }

    render() {
        return (
            <div className="question" ref={(ref) => this.question = ref}>
                <div className="question__title">{this.props.index + 1}. {this.props.question.title}</div>
                {this.props.question.answers.map((answer, i) => {
                    return (
                        <Answer 
                        answer={answer}
                        answered={this.checkAnswer(i)}
                        index={i} 
                        questionIndex={this.props.index}
                        onAnswerSelected={this.handleAnswerSelected} key={i} />
                    );
                })}
                <Total amount={this.total}/>
            </div>
        );
    }

    get isComplete() {
        const { answers, question, index } = this.props;
        
        let correct = true; 

        question.answers.forEach((answer, i) => {
            if(!this.isAnswered(answers, index, i ))
                correct = false;
        });

        return correct;
    }

    get total() {
        return this.props.question.answers.map((answer, i) => { 
            return this.checkAnswer(i) ? answer.total : 0;
         }).reduce((prev, curr) => prev + curr);
    }

}

Question.propTypes = {
    answers: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    onAnswerSelected: React.PropTypes.func.isRequired,
    question: React.PropTypes.object.isRequired 
};

export default Question;