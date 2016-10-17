import React from 'react';
import { firebaseApp } from '../firebase';

import FlatButton from 'material-ui/FlatButton';

class All extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            books: [] //{ title: '', user: '', email: '', id: ''}
        }
    }

    componentWillMount() {
        this.booksRef = firebaseApp.database().ref('books');

        this.booksRef.on('value', (snapshot) => {

            const books = [];

            if (snapshot.val()) {
                Object.keys(snapshot.val()).forEach(key => {
                    books.push({ title: snapshot.val()[key].title, user: snapshot.val()[key].user, email: snapshot.val()[key].email, id: key })
                });
            }
            this.setState({ books });
        })
    }

    componentWillUnmount() {
        this.booksRef.off();
    }

    handleRequest(userId, bookTitle) {

        const messageData = {
            bookTitle: bookTitle,
            fromUser: firebaseApp.auth().currentUser.uid,
            type: 'request'
        }
        const newMessageRef = firebaseApp.database().ref(`users/${userId}/messages`).push();

        newMessageRef.set(messageData);
    }

    render() {
        return (
            <div>
                {this.state.books.map(book => {
                    return (
                        <div key={book.id}>
                            <h3>{book.title}</h3>
                            <p>{book.email}
                                {book.user !== firebaseApp.auth().currentUser.uid ? 
                                    <FlatButton
                                    label="Request Trade"
                                    secondary={true}
                                    onTouchTap={this.handleRequest.bind(this, book.user, book.title)}
                                    />
                                    : ''}
                            </p>
                        </div>
                    )
                })}
            </div>
        )
    }

}

export default All;