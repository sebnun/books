import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { firebaseApp } from '../firebase';
import { Link, browserHistory } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loggedIn: firebaseApp.auth().currentUser ? true : false,
      title: '',
      open: false
    }
  }

  componentWillMount() {
    firebaseApp.auth().onAuthStateChanged(user => {
      this.setState({
        loggedIn: (null !== user) //user is null when not loggedin 
      })
    });
  }

  handleLogout() {
    firebaseApp.auth().signOut().then(() => {
      console.log("sign out succesful");
      browserHistory.push('/');
    }, (error) => {
      console.log(error);
    });
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleAdd = () => {

    const bookData = {
      title: this.state.title,
      user: firebaseApp.auth().currentUser.uid,
      email: firebaseApp.auth().currentUser.email
    }

    const newBookKey = firebaseApp.database().ref().child('books').push().key;

    var updates = {};
    updates['/books/' + newBookKey] = bookData;

    firebaseApp.database().ref().update(updates);

    this.setState({ open: false });
  }

  handleTitleChange = (event) => {
    this.setState({
      title: event.target.value,
    });
  };

  render() {

    const actions = [
      <FlatButton
        label="Add"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleAdd}
        />,
    ];

    return (
      <MuiThemeProvider>
        <div className="container">

          <Dialog
            title="Add Book"
            actions={actions}
            open={this.state.open}
            onRequestClose={this.handleClose}
            >
            <TextField
              id="muh-textfield"
              value={this.state.title}
              onChange={this.handleTitleChange}
              />
          </Dialog>


          {this.state.loggedIn ?

            <div className="row">
              <div className="col-sm-12">

                <Toolbar>
                  <ToolbarGroup>
                    <ToolbarTitle text="Book Trade" />
                    <RaisedButton label="Add" primary={true} onTouchTap={this.handleOpen} />
                    <Link to="/all"><RaisedButton label="All Books" /></Link>
                  </ToolbarGroup>
                  <ToolbarGroup>

                    <Link to="/messages"><RaisedButton label="Requests" /></Link>
                    <Link to="/profile"><RaisedButton label="Profile" /></Link>
                    <RaisedButton label="Logout" onTouchTap={this.handleLogout} />
                  </ToolbarGroup>
                </Toolbar>

              </div>
            </div>


            : ''}

          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
