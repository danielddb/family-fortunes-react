import PlayerSelect from '../../components/player-select/player-select';
import Questions from '../questions/questions';
import Scoreboard from '../../components/scoreboard/scoreboard';
import React from 'react';
import style from './game.styl';
import { NEXT_KEY } from '../../constants/app.js';

const THEME_AUDIO = require('./audio/theme.mp3'),
    COMPLETE_AUDIO = require('./audio/end-theme.mp3');

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPlayer: '',
            player1: props.player1,
            player2: props.player2,
            messages: '',
            progress: 0,
            themeAudio: new Audio(THEME_AUDIO),
            completeAudio: new Audio(COMPLETE_AUDIO)
        };
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keyup', this.handleKeyUp);

        this.state.themeAudio.play();
    }

    componentWillUnMount() {
        window.addEventListener('keyup', this.handleKeyUp);
    }

    handleKeyUp(e) {
        if((this.state.progress == 0 || this.state.progress == 1 || !this.state.progress >= 2) && e.keyCode === NEXT_KEY)
            this.updateProgress();
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
            player2
        });
    }

    /**
     * Handles when the current player is changed
     */
    handlePlayerChange(player) {
        this.setState({
            currentPlayer: player
        });
    }

    handleQuestionComplete(total) {
        this.setState({
            [this.state.currentPlayer] : {
                ...this.state[this.state.currentPlayer],
                total: this.state[this.state.currentPlayer].total + total
            }
        });
    }

    handleQuestionsComplete() {
        const { player1, player2, progress } = this.state;

        if(progress === 2) {
            this.updateProgress();

            if(player1.total == player2.total)
                this.handlePlayerChange(this.winner)
            else
                this.handlePlayerChange(player1.total > player2.total ? 'player1' : 'player2');

            this.state.completeAudio.play();
        }
    }

    handleMessageUpdate(message) {
        this.setState({
            messages: message
        });
    }

    updateProgress() {
        this.setState({
            progress: this.state.progress + 1
        });

        if(this.state.progress === 2)
            this.state.themeAudio.pause();
        else if(this.state.progress === 3)
            this.state.themeAudio.pause();
    }

    get winner() {
        const { player1, player2 } = this.state;
        
        if(player1.total == player2.total) return false;
        return player1.total > player2.total ? player1 : player2;
    }

    render() {
        const { currentPlayer, player1, player2, progress, playerAnswers } = this.state,
            { data } = this.props;
        
        if(progress === 0) {
            return (
                <div className="game">
                    <h1>Family Fortunes</h1>
                </div>
            );
        }
        if(progress === 1) {
            return (
                <div className="game">
                    <PlayerSelect onPlayersSelected={this.handlePlayersSelected.bind(this)} />
                </div>
            );
        }
        else if(progress === 2) {
            return (
                <div className="game">
                    <div className="scoreboards">
                        <Scoreboard player={player1} active={currentPlayer === 'player1'} />
                        {this.state.messages ? <div>{this.state.messages}</div> : null}
                        <Scoreboard player={player2} active={currentPlayer === 'player2'} />
                    </div>
                    <Questions 
                        currentPlayer={currentPlayer}
                        data={data}
                        player1={this.state.player1}
                        player2={this.state.player2}
                        onMessageUpdate={this.handleMessageUpdate.bind(this)}
                        onQuestionComplete={this.handleQuestionComplete.bind(this)}
                        onQuestionsComplete={this.handleQuestionsComplete.bind(this)}
                        onPlayerChange={this.handlePlayerChange.bind(this)}/>
                </div>
            );
        }
        else if(progress === 3) {
            return (
                <div className="game">
                    <div className="scoreboards">
                        <Scoreboard player={player1} active={currentPlayer === 'player1'} />
                        {this.state.messages ? <div>{this.state.messages}</div> : null}
                        <Scoreboard player={player2} active={currentPlayer === 'player2'} />
                    </div>
                    <h1>{this.winner ? `${this.winner.name} are today's winners!` : `It's a draw!`}</h1>
                </div>
            );
        }
        else {
            return null;
        }
    }
}

Game.propTypes = {
    data: React.PropTypes.array.isRequired,
    player1: React.PropTypes.object.isRequired,
    player2: React.PropTypes.object.isRequired
};

export default Game;