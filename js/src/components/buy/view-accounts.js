import React, { Component }  from 'react';
import axios from 'axios';
import PageHeader from 'react-dom';

export default class ViewAccounts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        };
    }

    componentDidMount() {
        axios.get("http://127.0.0.1:5000/users")
            .then(res => {
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
