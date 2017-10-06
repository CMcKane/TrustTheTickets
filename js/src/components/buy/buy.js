import React from 'react';
import axios from 'axios';

export default class Buy extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: []
        };
    }

    componentDidMount() {
        axios.get("http://127.0.0.1:5000/users")
            .then(res => {
                const posts = res.data.posts;
                this.setState({ posts });
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
                    {this.state.posts.map(post =>
                        <tr key={post.accountID}>
                            <td>{post.accountID}</td>
                            <td>{post.email}</td>
                            <td>{post.password}</td>
                            <td>{post.timestamp}</td>
                        </tr>
                    )}
                </table>
            </div>
        );
    }
}
