import React, { Component } from 'react';
import Fetch from 'react-fetch';

export default class Movies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
    }

    onError(error){
        console.log(error)
    }

    // https://daveceddia.com/ajax-requests-in-react/

    render(){
        return(
            <Fetch url="http://httpbin.org/headers" onError={this.onError}>
                <TestComponent/>
            </Fetch>
        )
    }
}

class TestComponent extends React.Component{
    render(){
        return(
            <div>
                {this.props.headers ? <div>Your user-agent: {this.props.headers['User-Agent']}</div>: 'loading'}
            </div>
        )
    }
}