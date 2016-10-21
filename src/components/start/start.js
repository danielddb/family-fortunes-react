import React from 'react';

export default class Start extends React.Component {
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
        const enterKey = 13;

        if (e.keyCode == enterKey)
            this.props.onStarted();
    }
    
    render() {
        return (
            <div className="quiz">
                <h1>Family Fortunes</h1>
            </div>
        );
    }
}