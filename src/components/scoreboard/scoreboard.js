import React from 'react';
import style from './scoreboard.styl';

function Scoreboard({ active, player }) {
    const divStyle = {
        color: 'orange',
        fontWeight: 'bold'
    };

    return (
        <div className={active ? "scoreboard scoreboard--active" : "scoreboard"}>
            <div className="scoreboard__name">{player.name}</div>
            <div className={player.total === 0 ? "scoreboard__total scoreboard__total--empty" : "scoreboard__total" }>{player.total === 0 ? '--' : player.total}</div>
        </div>
    );
}

Scoreboard.propTypes = {
    player: React.PropTypes.object.isRequired
};

export default Scoreboard;