import React from 'react';
import style from './attempts.styl';

function Attempts({ attempts }) {
    const divs = [];
    for (var i=0; i < attempts; i++) {
        divs.push(<div className="attempt" key={i}>X</div>);
    }
    
    return <div className="attempts">{ divs }</div>;
}

Attempts.propTypes = {
    attempts: React.PropTypes.number.isRequired,
};

export default Attempts;