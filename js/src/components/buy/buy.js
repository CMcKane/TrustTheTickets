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
            	console.log(res);
                const posts = res.data.posts;
                this.setState({ posts });
            });
    }

    render() {
        return (
            <div>
                <ul>
                    {this.state.posts.map(post =>
                        <li key={post.id}>{post.title}</li>
                    )}
                </ul>
            </div>
        );
    }
}
