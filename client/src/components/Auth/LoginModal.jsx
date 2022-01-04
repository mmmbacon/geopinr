import React, { useContext, useState } from "react";
import { GraphQLClient } from 'graphql-request';
import { GoogleLogin } from 'react-google-login';
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Box, Link } from "@material-ui/core";
import GitHubIcon from '@material-ui/icons/GitHub';

import { TextField, Button } from "@material-ui/core";

import Context from '../../context';
import { ME_QUERY } from '../../graphql/queries';
import { CREATE_NEW_USER_MUTATION, LOGIN_MUTATION } from '../../graphql/mutations';
import { BASE_URL } from '../../client';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = vars => makeStyles( theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  },
  button: {
    margin: 5
  },
  loginButton: {
    margin: 5,
    marginTop: 10
  },
  googleLogin: {
    marginTop: 20,
  },
  social: {
    position: 'absolute',
    top: '15px',
    left: '15px'
  },
  socialText: {
    fontSize: '1.5em'
  },
  title: {
    fontSize: '3em',
    marginBottom: '0px',
    lineHeight: '1.2em',
    padding: 20
  },
  mobileTitle: {
    fontSize: '2em',
    marginBottom: '0px',
    lineHeight: '1.2em'
  },
  icon: {
    height: "40px",
    animation: `$oscillate 500ms ease-in-out ${vars.delay}s infinite`,
  },
  input: {
    marginBottom: '1em',
  },
  mobileIcon: {
    height: "50px",
    animation: `$oscillate 500ms ease-in-out ${vars.delay}s infinite`,
  },
  "@keyframes oscillate": {
    "0%": {
      transform: "translateY(-3%)"
    },
    "50%": {
      transform: "translateY(3%)"
    },
    "100%": {
      transform: "translateY(-3%)"
    },
  }
}));

const LoginModal = (props) => {

  const classes = useStyles({ delay: 1 })();
  const logo1classes = useStyles({ delay: 0 })();
  const logo2classes = useStyles({ delay: 0.1 })();
  const logo3classes = useStyles({ delay: 0.2 })();
  const logo4classes = useStyles({ delay: 0.3 })();

  const [ register, setRegister ] = useState(false);

  const [ usernameField, setUsernameField ] = useState("");
  const [ emailField, setEmailField ] = useState("");
  const [ passwordField , setPasswordField ] = useState("");

  const {dispatch} = useContext(Context);
  const mobileSize = useMediaQuery('(max-width:650px)');

  const handleGoogleLoginSuccess = async googleUser => {
    try{
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(BASE_URL, {
        headers: { authorization: idToken }
      });
      const { me } = await client.request(ME_QUERY);
      dispatch({ type: "LOGIN_USER", payload: me });
      dispatch({ type: "IS_LOGGED_IN", payload: googleUser.isSignedIn }); 
      props.onSuccess();
    }catch(err){
      handleLoginFailure(err);
    }
  };

  const handleBasicLogin = async (email, password) => {
    try{
      const client = new GraphQLClient(BASE_URL);
      const { loginUser } = await client.request(LOGIN_MUTATION, {email: emailField, password: passwordField});
      const { email, username } = loginUser;
      dispatch({ type: "LOGIN_USER", payload: loginUser });
      dispatch({ type: "IS_LOGGED_IN", payload: true }); 
      props.onSuccess();
    }catch(err){
      handleLoginFailure(err);
    }
  }

  const handleRegister = async () => {
    try{
      const client = new GraphQLClient(BASE_URL);
      const { createNewUser } = await client.request(CREATE_NEW_USER_MUTATION, { email: emailField, password: passwordField, username: usernameField});
      const { email, username } = createNewUser;
      dispatch({ type: "LOGIN_USER", payload: createNewUser });
      dispatch({ type: "IS_LOGGED_IN", payload: true }); 
      props.onSuccess();
    }catch(err){
      handleLoginFailure(err);
    }
  }

  const handleLoginFailure = err =>{
    console.error("Error Logging in ", err);
    dispatch({ type: "IS_LOGGED_IN", payload: false });
  }


  const handleRegisterToggle = () => {
    setRegister(true);
  }

  return <div className={classes.root}>
    <Box display="flex" flexDirection="row" mb={3}>
      <Box p={1} >
        <img className={ mobileSize ? logo1classes.mobileIcon : logo1classes.icon} src="https://res.cloudinary.com/mmmbacon/image/upload/v1626840695/cdn/icons8-roller-skates-100_p7oamy.png" alt="preview"/>
      </Box>
      <Box p={1} >
        <img className={ mobileSize ? logo2classes.mobileIcon : logo2classes.icon} src="https://res.cloudinary.com/mmmbacon/image/upload/v1626840695/cdn/icons8-skateboard-100_ts7wrr.png" alt="preview"/>
      </Box>
      <Box p={1} >
        <img className={ mobileSize ? logo3classes.mobileIcon : logo3classes.icon} src="https://res.cloudinary.com/mmmbacon/image/upload/v1626840695/cdn/icons8-rollerblade-100_xtiixl.png" alt="preview"/>
      </Box>
      <Box p={1} >
        <img className={ mobileSize ? logo4classes.mobileIcon : logo4classes.icon} src="https://res.cloudinary.com/mmmbacon/image/upload/v1626840695/cdn/icons8-heart-96_ihytgp.png" alt="preview"/>
      </Box>
    </Box>

    <Typography
    className={mobileSize ? classes.mobileTitle : classes.title}
    component="h1"
    variant="h5"
    gutterBottom
    noWrap
    color="primary">
      {`${register ? 'Register' : 'Login'}`}
    </Typography>
    { register && (
      <TextField 
        className={classes.input} 
        label="username" 
        variant="outlined"
        value={usernameField}
        onChange={ event => setUsernameField(event.target.value)}></TextField>
    )}
    <TextField 
      className={classes.input} 
      label="email" 
      variant="outlined"
      value={emailField}
      onChange={ event => setEmailField(event.target.value)}></TextField>
    <TextField 
      className={classes.input} 
      label="password" 
      variant="outlined"
      type="password"
      value={passwordField}
      onChange={ event => setPasswordField(event.target.value)}></TextField>
    { register ? (
        <Button className={classes.loginButton} color="primary" variant="contained" onClick={handleRegister}>Register</Button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Button className={classes.loginButton} color="primary" variant="contained">Log In</Button>  
          <Button className={classes.button} color="primary" onClick={handleRegisterToggle}>Register</Button>
        </div>
      )}
    <GoogleLogin 
      className={classes.googleLogin}
      buttonText="Login with Google"
      clientId="643653378187-86ac0rdsdlkso7mf9g0mfdeun94dsv0k.apps.googleusercontent.com" 
      onSuccess={handleGoogleLoginSuccess}
      onFailure={handleLoginFailure}
      theme="dark">
    </GoogleLogin>
      </div>
};

export default LoginModal;
