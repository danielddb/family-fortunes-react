import React from 'react';
import style from './player-selector.styl';

class PlayerSelector extends React.Component {
    constructor() {
        super();
        this.state = {
            player1Name: '',
            player2Name: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.refs.player1Input.focus();
    }

    get hasBothNames() {
        return this.state.player1Name && this.state.player2Name;
    }

    render() {
        return (
            <div className="quiz">
                <h1>Today's teams</h1>
                <form onSubmit={this.handleSubmit} className="player-selector">
                    <div className="player-selector__inputs">
                        <input
                            type="text"
                            ref="player1Input"
                            onChange={this.handleChange}
                            value={this.state.player1Name}
                            className="player-selector__input"
                            placeholder="Team 1" />
                        <input
                            type="text"
                            ref="player2Input"
                            onChange={this.handleChange}
                            value={this.state.player2Name}
                            className="player-selector__input"
                            placeholder="Team 2" />
                    </div>
                    <button className="player-selector__button" disabled={this.hasBothNames ? "" : "disabled"}>Start game</button>
                </form>
            </div>
        );
    }

    handleChange() {
        const player1Name = this.refs.player1Input.value,
            player2Name = this.refs.player2Input.value;

        this.setState({
            player1Name,
            player2Name
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.hasBothNames) return;

        const { player1Name, player2Name } = this.state;

        this.props.onPlayersSelected(player1Name.trim(), player2Name.trim());
    }
}

PlayerSelector.propTypes = {
    onPlayersSelected: React.PropTypes.func.isRequired
};

export default PlayerSelector;