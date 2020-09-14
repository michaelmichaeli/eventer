import React, { Component } from 'react';
import { connect } from 'react-redux';

import { login, logout, signup } from '../store/actions/userActions.js'

import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import eventBusService from "../services/eventBusService.js";


class Login extends Component {
  state = {
    msg: '',
    loginCred: {
      userName: '',
      password: ''
    },
    signupCred: {
      userName: '',
      password: '',
      fullName: ''
    },
    showSignupSection: false,
    imgUrl: ''
  };

  componentDidMount() {
    if (this.props.loggedInUser) {
      if (window.cloudinary) {
        let widget = window.cloudinary.createUploadWidget({
          cloudName: 'dsqh7qhpg',
          uploadPreset: 'lh8fyiqe',
          // cropping: true,
          // croppingCoordinatesMode: 'custom',
          // gravity: 'custom',
          croppingAspectRatio: 1,
          maxFiles: 1
        }, (error, result) => { this.checkUploadResult(result) })

        this.setState({ msg: `Hello, welcome ${this.props.loggedInUser.fullName}`, widget })
      }
    }
  }

  myRef = null;

  loginHandleChange = ev => {
    const { name, value } = ev.target;
    this.setState(prevState => ({
      loginCred: {
        ...prevState.loginCred,
        [name]: value
      }
    }));
  };

  signupHandleChange = ev => {
    const { name, value } = ev.target;
    this.setState(prevState => ({
      signupCred: {
        ...prevState.signupCred,
        [name]: value
      }
    }));
  };

  doLogin = async ev => {
    ev.preventDefault();
    const { userName, password } = this.state.loginCred;
    if (!userName || !password) {
      return this.setState({ msg: 'Please enter both User-Name and Password' });
    }
    const userCreds = { userName, password };
    //this.props.login(userCreds)s
    const user = await this.props.login(userCreds);
    const { loggedInUser } = this.props;
    if (loggedInUser.userName !== 'Guest') {
      eventBusService.emit('user-login', user._id)
      this.props.history.push(`/`)
    }
    else this.setState({ msg: 'Incorrect User-Name / Password' })

  };

  doSignup = async ev => {
    ev.preventDefault();
    const { userName, password, fullName } = this.state.signupCred;
    const { imgUrl } = this.state;
    if (!userName || !password || !fullName) {
      return this.setState({ msg: 'All inputs are required!' });
    }
    const signupCreds = { userName, password, fullName, imgUrl };
    const userCreds = { userName, password };
    await this.props.signup(signupCreds);
    const user = await this.props.login(userCreds);
    if (user) eventBusService.emit('user-login', user._id)
    this.setState({ signupCred: { userName: '', password: '', fullName: '' } }, () => {
      this.props.history.push(`/`);
    })
  };

  removeUser = userId => {
    this.props.removeUser(userId);
  };


  showWidget = (ev, widget) => {
    ev.preventDefault();
    widget.open()
  }

  checkUploadResult = (resultEvent) => {
    if (resultEvent.event === 'success') {
      this.setState((prevState) => {
        return {
          imgUrl: resultEvent.info.secure_url
        }
      })
    }
  }

  render() {
    const classes = makeStyles((theme) => ({
      root: {
        '& .MuiTextField-root': {
          margin: theme.spacing(1),
          width: '25ch',
        },
      },
    }));
    let signupSection = (
      <div>

        <form onSubmit={this.doSignup}
          className={`${classes.root} flex column`}
          noValidate
          autoComplete="off" ref={(ref) => this.myRef = ref}
        >

          <span className="material-icons">face</span>

          <p className="txt">
            Please set yout credencials and click on SIGN-UP to submit
            </p>

          <TextField
            id="userNameSignup"
            label="Email"
            defaultValue="Default Value"
            helperText="*Required"
            variant="outlined"
            className="TextField"
            name="userName"
            value={this.state.signupCred.userName}
            onChange={this.signupHandleChange}
          />
          {/* <input
          type="text"
          name="userName"
          value={this.state.signupCred.userName}
          onChange={this.signupHandleChange}
          placeholder="Email"
        /> */}
          {/* <br /> */}
          <TextField
            id="passwordSignup"
            label="Password"
            //  defaultValue="Default Value"
            helperText="*Required"
            variant="outlined"
            className="TextField"
            name="password"
            value={this.state.signupCred.password}
            onChange={this.signupHandleChange}
            type="password"
          />
          {/* <input
          name="password"
          value={this.state.signupCred.password}
          onChange={this.signupHandleChange}
          placeholder="Password"
        /> */}
          {/* <br /> */}
          <TextField
            id="fullName"
            label="Your full name"
            // defaultValue="Default Value"
            helperText="*Required"
            variant="outlined"
            className="TextField"
            name="fullName"
            value={this.state.signupCred.fullName}
            onChange={this.signupHandleChange}
          />
          {/* <input
          type="text"
          name="fullName"
          value={this.state.signupCred.fullName}
          onChange={this.signupHandleChange}
          placeholder="Username"
        /> */}
          {/* <br /> */}
          <p className="txt">
            For better experience, you can now add a photo from any device for your profile
            </p>

          <Button onClick={(ev) => { this.showWidget(ev, this.state.widget); }}
            variant="contained"
            color="default"
            className={classes.button}
            startIcon={<CloudUploadIcon />}
          >Upload Profile image
          </Button>

          {this.state.imgUrl && (<div><img className="profile-img square-ratio" alt="" src={this.state.imgUrl} /> <h1>{this.state.signupCred.fullName}</h1></div>)}

          <Button variant="contained" color="primary" onClick={this.doSignup}>Sign-up</Button>

          <button hidden>Signup</button>

        </form>

        <Button variant="contained"
          color="default"
          onClick={async () => {
            const user = await this.props.login({ userName: "Guest", password: "1" });
            eventBusService.emit('user-login', user._id)
            this.props.history.push(`/`)
          }}>
          Continue as Guest</Button>


        <Button variant="contained"
          color="primary"
          onClick={() => { this.setState({ showSignupSection: false, msg: `Hello, welcome ${this.props.loggedInUser.fullName}` }, () => { }); }}>
          I already have User Name and Password</Button>

      </div>
    );
    let loginSection = (
      <div>

        <form onSubmit={this.doLogin} className={`${classes.root} flex column`} noValidate autoComplete="off">
          <span className="material-icons"> account_circle </span>

          <p className="txt">Please Login here.</p>

          <TextField
            id="userName"
            label="Email"
            // defaultValue="Default Value"
            helperText="*Required"
            variant="outlined"
            className="TextField"
            name="userName"
            value={this.state.loginCred.userName}
            onChange={this.loginHandleChange}
          />

          {/* <input
          type="text"
          name="userName"
          value={this.state.loginCred.userName}
          onChange={this.loginHandleChange}
          placeholder="Email"
        /> */}
          {/* <br /> */}

          <TextField
            id="password"
            label="Password"
            // defaultValue="Default Value"
            helperText="*Required"
            variant="outlined"
            className="TextField"
            name="password"
            value={this.state.loginCred.password}
            onChange={this.loginHandleChange}
            type="password"
          />

          {/* <input
          type="password"
          name="password"
          value={this.state.loginCred.password}
          onChange={this.loginHandleChange}
          placeholder="Password"
        /> */}
          {/* <br /> */}
          <Button onClick={this.doLogin} variant="contained" color="primary">Login</Button>
          <button hidden></button>

          <p className="txt">Don't have a User Name? click on SIGN-UP HERE to sign-up</p>

        </form>

        <Button variant="contained"
          color="default"
          onClick={async () => {
            const user = await this.props.login({ userName: "Guest", password: "1" })
            eventBusService.emit('user-login', user._id)
            this.props.history.push(`/`)
          }}>
          Continue as Guest</Button>


        <Button variant="contained"
          color="primary"
          onClick={() => { this.setState({ showSignupSection: true, msg: 'Welcome! Sign-up Today' }, () => { }); }}>
          Sign-up Here</Button>


      </div>
    );

    const { loggedInUser } = this.props;

    if (!loggedInUser) return <div>Loading...</div>
    return (
      <div className="login-container">
        <h2>{this.state.msg}</h2>
        <div className="loginBox flex column">

          {(loggedInUser && loggedInUser.userName !== "Guest") &&
            <div>

              {this.props.loggedInUser.imgUrl && (<div><img className="profile-img square-ratio" alt="" src={this.props.loggedInUser.imgUrl} />
                <h1>{this.props.loggedInUser.fullName}</h1></div>)}

              <Button variant="contained"
                color="primary"
                onClick={() => { this.props.login({ userName: "Guest", password: "1" }) }}>
                Log-Out</Button>

            </div>}

          {(loggedInUser && loggedInUser.userName === "Guest") && !this.state.showSignupSection && loginSection}


          {this.state.showSignupSection && signupSection}
        </div>
      </div>
    );
  }

}

const mapStateToProps = state => {
  return {
    // users: state.user.users,
    loggedInUser: state.userStore.loggedInUser,
    // isLoading: state.system.isLoading
  };
};
const mapDispatchToProps = {
  login,
  signup,
  logout,
  //   removeUser,
  //   loadUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
