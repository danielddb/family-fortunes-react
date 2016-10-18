import React from 'react';
import style from './total.styl';

const Total = ({amount}) => {
    return (
        <div className="total">
            <div className="total__label">Total</div>
            <div className={amount === 0 ? "total__amount total__amount--empty" : "total__amount" }>{amount === 0 ? '--' : amount}</div>
        </div>
    );
};

Total.propTypes = {
    amount: React.PropTypes.number.isRequired
};

export default Total;