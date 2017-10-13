import React, { Component }  from 'react';
import { TTTGet } from '../backend/ttt-request';
import '../buy/view-account.css';

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
            <div class="container">
                <table style={{width: '80%'}}>
                        <th>Account ID</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Creation Date</th>
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
