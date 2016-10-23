import React from 'react';
import style from './question.styl';

function Question({ number, playerAnswers, question }) {
    const total = question.answers.map((answer, i) => playerAnswers.indexOf(i) !== -1 ? answer.total : 0)
        .reduce((prev, curr) => prev + curr);

    const answers = question.answers.map((answer, i) => {
        return playerAnswers.indexOf(i) !== -1
            ? (
                <div className="question__answer" key={i}>
                    <div className="question__answer-number">{i + 1}</div>
                    <div className="question__answer-title question__answer-title--answered">{answer.title}</div>
                    <div className="question__answer-total">{answer.total}</div>
                </div>
            )
            : (
                <div className="question__answer" key={i}>
                    <div className="question__answer-number">{i + 1}</div>
                    <div className="question__answer-title"></div>
                    <div className="question__answer-total question__answer-total--empty">--</div>
                </div>
            );
    });

    return (
        <div className="question">
            <div className="question__title">{number}. {question.title}</div>
            <div className="question__answers">
                {answers}
            </div>
            <div className="question__total">
                <div className="question__total-label">Total</div>
                <div className={total === 0 ? "question__total-amount question__total-amount--empty" : "question__total-amount" }>{total === 0 ? '--' : total}</div>
            </div>
        </div>
    );
}

Question.propTypes = {
    number: React.PropTypes.number.isRequired,
    question: React.PropTypes.object.isRequired,
    playerAnswers: React.PropTypes.array.isRequired
};

export default Question;