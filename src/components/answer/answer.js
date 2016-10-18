import React from 'react';
import style from './answer.styl';

class Answer extends React.Component {

    constructor() {
        super();
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keyup', this.handleKeyUp);
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    handleKeyUp(e) {
        if(this.getIndexAsKeyboardCode(e.keyCode) === this.props.index) {
            let file,
                audio,
                timeout = 1300;
            
            if(this.props.index === 0)
                file = require('./audio/top-correct.mp3');
            else {
                file = require('./audio/correct.mp3');
                timeout = 1200;
            }

            audio = new Audio(file);
            audio.play();

            setTimeout(() => this.props.onAnswerSelected(this.props.index), timeout);
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

    render() {
        if(this.props.answered) {
            return(
                <div className="answer">
                    <div className="answer__number">{this.props.index + 1}</div>
                    <div className="answer__title answer__title--answered">{this.props.answer.title}</div>
                    <div className="answer__total">{this.props.answer.total}</div>
                </div>
            );
        }
        else {
            return(
                <div className="answer">
                    <div className="answer__number">{this.props.index + 1}</div>
                    <div className="answer__title"></div>
                    <div className="answer__total answer__total--empty">--</div>
                </div>
            );
        }
    }
}

Answer.propTypes = {
    answer: React.PropTypes.object.isRequired, 
    answered: React.PropTypes.bool.isRequired,
    index: React.PropTypes.number.isRequired,
    onAnswerSelected: React.PropTypes.func.isRequired 
};

export default Answer;