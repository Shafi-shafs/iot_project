import React from 'react';
// import { Navigate } from 'react-router-dom';
import '../css/Login.css';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleLogin = () => {
    const { username, password } = this.state;
    // Check if username and password match the hardcoded values
    if (username === 'admin' && password === 'admin') {
      // Call the onLoginSuccess prop passed from App.js
      this.props.onLoginSuccess();
    } else {
      alert('Invalid username or password');
    }
  };

  render() {
    return (
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
        <form className='login-container'>
          <h3>Login Here</h3>

          <label htmlFor="username">Username</label>
          <input className='loginInput' type="text" placeholder="Email or Phone" id="username" name="username" value={this.state.username} onChange={this.handleInputChange} />

          <label htmlFor="password">Password</label>
          <input className='loginInput' type="password" placeholder="Password" id="password" name="password" value={this.state.password} onChange={this.handleInputChange} />

          {/* Call handleLogin method when button is clicked */}
          <button className='loginButton' type="button" onClick={this.handleLogin}>Log In</button>
          <div className="social">
            <div className="go">
              <i className="fab fa-google"></i> Google
            </div>
            <div className="fb">
              <i className="fab fa-facebook"></i> Facebook
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default LoginForm; // Export LoginForm as default
