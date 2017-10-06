import React, { Component }  from 'react';

export default class ChooseGame extends Component {

    constructor(props) {
        super(props);

        this.state = {
            text: 'Choose Your Desired Game',
        };
    }

    render(){
        return (
            <div>
                <h1 style={{textAlign: 'center'}}>
                    {this.state.text}
                </h1>
            </div>
        );
    }
}