import Game from './containers/game/game';
import React from 'react';
import ReactDOM from 'react-dom';
import data from './constants/data';
import style from './base/base.styl';

const PLAYER_1 = {
    name: '',
    total: 0
};

const PLAYER_2 = {
    name: '',
    total: 0
};

ReactDOM.render(<Game data={data} player1={PLAYER_1} player2={PLAYER_2}/>, document.getElementById('app'));

if (module.hot)
    module.hot.accept();