import React from 'react';
import { firebaseApp } from '../firebase';

import FlatButton from 'material-ui/FlatButton';

class Messages extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            messages: [] // {id: '', bookTitle: '', type: '', fromUser: ''}
        }
    }

    componentWillMount() {

        firebaseApp.auth().onAuthStateChanged(user => {

            if (user) {
                this.messagesRef = firebaseApp.database().ref(`users/${user.uid}/messages`);

                this.messagesRef.on('value', (snapshot) => {

                    const messages = [];

                    if (snapshot.val()) {
                        Object.keys(snapshot.val()).forEach(key => {
                            messages.push({ bookTitle: snapshot.val()[key].bookTitle, fromUser: snapshot.val()[key].fromUser, type: snapshot.val()[key].type, id: key })
                        });
                    }
                    this.setState({ messages });
                })
            }

        });


    }

    sendMessage(userId, bookTitle, type) {
        const messageData = {
            bookTitle: bookTitle,
            fromUser: firebaseApp.auth().currentUser.uid,
            type: type
        }
        const newMessageRef = firebaseApp.database().ref(`users/${userId}/messages`).push();

        newMessageRef.set(messageData);
    }

    componentWillUnmount() {
        this.messagesRef.off();
    }

    makeMessageUI(message) {
        if (message.type === 'request') {
            return <div key={message.id}>
                <h3>{message.bookTitle}</h3>
                <p>Request:
                                <FlatButton
                        label="Accept"
                        secondary={true}
                        onTouchTap={this.sendMessage.bind(this, message.fromUser, message.bookTitle, 'accept')}
                        />
                    <FlatButton
                        label="decline"
                        secondary={true}
                        onTouchTap={this.sendMessage.bind(this, message.fromUser, message.bookTitle, 'decline')}
                        />
                </p>
            </div>
        } else if (message.type === 'accept') {
            return <div key={message.id}>
                <h3>{message.bookTitle}</h3>
                <p>Accepted :)</p>
            </div>
        } else {
            return <div key={message.id}>
                <h3>{message.bookTitle}</h3>
                <p>declihed :(</p>
            </div>
        }
    }

    render() {



        return (
            <div>
                {this.state.messages.map(message => {
                    return this.makeMessageUI(message)
                })}
            </div>
        )
    }

}

export default Messages;