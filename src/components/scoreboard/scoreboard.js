import React from 'react';
import style from './scoreboard.styl';

function Scoreboard({active, name, total}) {
    return (
        <div className={active ? "scoreboard scoreboard--active" : "scoreboard"}>
            <div className="scoreboard__name">{name}</div>
            <div className={total === 0 ? "scoreboard__total scoreboard__total--empty" : "scoreboard__total" }>{total === 0 ? '--' : total}</div>
        </div>
    );
}

Scoreboard.propTypes = {
    active: React.PropTypes.bool.isRequired,
    name: React.PropTypes.string.isRequired,
    total: React.PropTypes.number.isRequired
};

export default Scoreboard;