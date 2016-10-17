import React from 'react';
import { firebaseApp } from '../firebase';
import { Link, browserHistory } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      emailError: '',
      passwordError: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = this.state.email.trim();
    const password = this.state.password.trim();

    firebaseApp.auth().createUserWithEmailAndPassword(email, password).then((user) => {
      browserHistory.push('/all');
    }).catch((error) => {
      if (error.code === 'auth/weak-password') {
        this.setState({ passwordError: error.message, emailError: '' });
      } else {
        this.setState({ emailError: error.message, passwordError: '' });
      }
      //console.log(error);
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-12 text-xs-center">

          <Paper>

            <br /><br />
            <h1><Link to="/">Book Trade</Link></h1>
            <br /><br />
            <h2>Signup</h2>

            <form onSubmit={this.handleSubmit}>

              <TextField
                floatingLabelText="Email"
                value={this.state.email}
                onChange={this.handleEmailChange}
                errorText={this.state.emailError}
              />

              <br /><br />

              <TextField
                floatingLabelText="Password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
                type="password"
                errorText={this.state.passwordError}
              />

              <br /><br />
              <RaisedButton
                label="Signup"
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


export default Signup;
