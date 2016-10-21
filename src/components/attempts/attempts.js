import React from 'react';
import style from './attempts.styl';

function Attempts({ total }) {
    const attempts = [];
    for (var i=0; i < total; i++) {
        attempts.push(<div className="attempt" key={i}>X</div>);
    }
    
    return <div className="attempts">{ attempts }</div>;
}

Attempts.propTypes = {
    total: React.PropTypes.number.isRequired
};

export default Attempts;