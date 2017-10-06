import React, { Component }  from 'react';
//import { Text, StyleSheet } from 'react-native';

export default class ChooseGame extends Component {

    constructor(props) {
        super(props);

        this.state = {
            titleText: 'Choose Your Game',
        };
    }

    render(){
        return (
            <text style={styles.titleText}>
                {this.state.titleText}
            </text>
        );
    }
}

// const styles = Stylesheet.create({
//     titleText: {
//         fontSize: 40,
//         fontWeight: 'bold',
//         textAlign: 'center',
//     },
// });