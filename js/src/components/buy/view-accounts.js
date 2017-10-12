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
                        <td>Creation Date</td>
                    </tr>
                    {this.state.users.map(user =>
                        <tr key={user.account_id}>
                            <td>{user.account_id}</td>
                            <td>{user.email}</td>
                            <td>[Secret Password]</td>
                            <td>{user.created_dt}</td>
                        </tr>
                    )}
                </table>
            </div>
        );
    }
}
