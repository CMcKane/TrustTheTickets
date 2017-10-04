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
        axios.get(`http://www.reddit.com/r/gifs.json`)
            .then(res => {
                const posts = res.data.data.children.map(obj => obj.data);
                this.setState({ posts });
            });
    }

    render() {
        return (
            <div>
                <h1>{`/r/gifs`}</h1>
                <ul>
                    {this.state.posts.map(post =>
                        <li key={post.id}>{post.title}</li>
                    )}
                </ul>
            </div>
        );
    }
}