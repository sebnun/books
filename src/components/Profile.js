import React from 'react';
import { firebaseApp } from '../firebase';
import { Link } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            location: '',
            currentName: '',
            currentLocation: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    componentWillMount() {
        firebaseApp.auth().onAuthStateChanged(user => {

            if (user) {
                this.userRef = firebaseApp.database().ref(`users/${user.uid}`);

                this.userRef.on('value', (snapshot) => {

                    if(snapshot.val()) {
                    this.setState({ currentName: snapshot.val().name, currentLocation: snapshot.val().location });
                    }
                })
            }

        });
    }

    componentWillUnmount() {
        this.userRef.off();
    }

    handleLocationChange(e) {
        this.setState({ location: e.target.value });
    }

    handleNameChange(e) {
        this.setState({ name: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const name = this.state.name.trim();
        const location = this.state.location.trim();

        let updates = {};
        updates['/users/' + firebaseApp.auth().currentUser.uid + '/name'] = name;
        updates['/users/' + firebaseApp.auth().currentUser.uid + '/location'] = location;
        firebaseApp.database().ref().update(updates);
    }

    render() {
        return (

            <div className="row">
                <div className="col-sm-12 text-xs-center">

                    <Paper>
                        <br /><br />
                        <h1><Link to="/">Book Trade</Link></h1>
                        <br /><br />
                        <h2>Update Profile</h2>

                        <p>Current Name: {this.state.currentName}</p>
                        <p>Current Location: {this.state.currentLocation}</p>
                        <form onSubmit={this.handleSubmit}>

                            <TextField
                                floatingLabelText="Name"
                                value={this.state.name}
                                onChange={this.handleNameChange}
                                />

                            <br /><br />
                            <TextField
                                floatingLabelText="Location"
                                value={this.state.location}
                                onChange={this.handleLocationChange}
                                />

                            <br /><br />
                            <RaisedButton
                                label="Update"
                                type="submit"
                                primary={true}
                                />

                        </form>

                        <br /><br />
                    </Paper>
                </div>
            </div>

        );
    }
}


export default Profile;

