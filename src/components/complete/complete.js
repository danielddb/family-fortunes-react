import Scoreboard from '../scoreboard/scoreboard';
import React from 'react';

export default class Complete extends React.Component {
    get winner() {
        const { player1, player2 } = this.props;
        
        return player1.total > player2.total ? player1 : player2;
    }
    
    render() {
        const { player1, player2, } = this.props;

        return (
            <div className="quiz">
                <div className="scoreboards">
                    <Scoreboard 
                        active={true}
                        name={player1.name}
                        total={player1.total} />
                    <Scoreboard 
                        active={true}
                        name={player2.name}
                        total={player2.total} />
                </div>
                <h1>{this.winner.name} are today's winners!</h1>
            </div>
        );
    }
}