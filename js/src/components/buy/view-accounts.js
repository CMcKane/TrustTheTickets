import React, { Component }  from 'react';
import { TTTGet } from '../backend/ttt-request';

export default class ViewAccounts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        };
    }

    componentDidMount() {
        TTTGet("/users")
            .then(res => {
                console.log(res);
                const users = res.data.users;
                this.setState({ users });
            });
    }

    render() {
        return (
            <div>
                <table>
                    <tr>
                        <td>Account ID</td>
                        <td>Email</td>
                        <td>Password</td>
                        <td>Timestamp</td>
                    </tr>
                    {this.state.users.map(user =>
                        <tr key={user.accountID}>
                            <td>{user.accountID}</td>
                            <td>{user.email}</td>
                            <td>[Secret Password]</td>
                            <td>{user.timestamp}</td>
                        </tr>
                    )}
                </table>
            </div>
        );
    }
}
