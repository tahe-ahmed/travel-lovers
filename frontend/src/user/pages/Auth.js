import React, { useState, useContext } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  Link,
  Grid,
  Typography,
  Container,
  CircularProgress,
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Modal from '../../shared/components/UIElements/Modal';

import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login'; // Facebook login

import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  //const [isAutoLoad, setIsAutoLoad] = useState(false); // for facebook login
  const [resetPasswordMsg, setResetPasswordMsg] = useState('');
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      resetEmail: {
        value: '',
        isValid: true,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const closeForgotPassword = () => setForgotPassword(false);

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
            signType: 'normal',
          }),
          {
            'Content-Type': 'application/json',
          }
        );
        auth.login(responseData.userId, responseData.token, responseData.image);// here image is included to context!
      } catch (err) { }
    } else {
      try {
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          'POST',
          formData
        );

        auth.login(responseData.userId, responseData.token, responseData.image);// here image is included to context!
      } catch (err) { }
    }
  };
  // google handler

  const responseGoogleHandler = async (response) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/googlelogin`,
        'POST',
        JSON.stringify({
          email: response.profileObj.email,
          password: `${response.googleId}${response.profileObj.email}`,
          tokenId: response.tokenId,
          signType: 'google', // for bug
        }),
        {
          'Content-Type': 'application/json',
        },
        10000 // user should login in 10 sc
      );

      auth.login(responseData.userId, responseData.token, responseData.image);// here image is included to context!
    } catch (err) { }

  };

  // facebook login handler

  const responseFacebookHandler = async (response) => {
    //console.log('facebook');
    //setIsAutoLoad(true);

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/facebooklogin`,
        'POST',
        JSON.stringify({
          password: `${response.id}${response.email}`, // we cant get user's facebook account password so we create a new simple password for user
          accessToken: response.accessToken,
          userID: response.userID,
          signType: 'facebook', // for bug
        }),
        {
          'Content-Type': 'application/json',
        },
        10000 // user should login in 10 sc
      );
      auth.login(responseData.userId, responseData.token, responseData.image); // here image is included to context!
    } catch (err) { }
  }

  const resetPassword = async () => {
    //setIsAutoLoad(true);
    //console.log('resetemail', formState.inputs.resetEmail.value);
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/forgotPassword`,
        'POST',
        JSON.stringify({
          email: formState.inputs.resetEmail.value,
        }),
        {
          'Content-Type': 'application/json',
        }
      );
      //console.log('return', responseData.msg);
      setResetPasswordMsg(responseData.msg);
      // auth.login(responseData.userId, responseData.token);
    } catch (err) { }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={forgotPassword}
        onCancel={closeForgotPassword}
        header='Reset Password'
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={
          <div className="footer-button">
            <Button variant="contained" color="secondary" onClick={closeForgotPassword}>
              CANCEL
            </Button>
            {resetPasswordMsg === '' && (
              <Button color='primary' variant='contained' onClick={resetPassword}>
                Reset Password
              </Button>
            )}
          </div>

        }
      >
        <div className='map-container'>
          {resetPasswordMsg === '' && (
            <Input
              id='resetEmail'
              element='input'
              type='text'
              fullWidth
              label='Email'
              validators={[VALIDATOR_EMAIL()]}
              errorText='Please enter a valid email address.'
              onInput={inputHandler}
              placeholder='Enter your email address'
            />
          )}
          {resetPasswordMsg !== '' && <p>{resetPasswordMsg} </p>}
        </div>
      </Modal>
      <div className='login-background'>
        <Container component='main' maxWidth='xs'>
          <CssBaseline />
          <div className='paper'>
            <div className='header'>
              {isLoading && <CircularProgress color='secondary' />}
              <Avatar className='avatar-lock'>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component='h1' variant='h5'>
                {isLoginMode ? 'Sign in' : 'Sign up'}
              </Typography>
            </div>

            <form noValidate className='form' onSubmit={authSubmitHandler}>
              {!isLoginMode && (
                <Input
                  element='input'
                  required
                  fullWidth
                  id='name'
                  type='text'
                  label='Your Name'
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText='Please enter a name.'
                  onInput={inputHandler}
                />
              )}
              {!isLoginMode && (
                <ImageUpload
                  center
                  id='image'
                  onInput={inputHandler}
                  errorText='Please provide an image.'
                />
              )}
              <Input
                id='email'
                element='input'
                required
                fullWidth
                type='text'
                label='Email Address'
                validators={[VALIDATOR_EMAIL()]}
                errorText='Please enter a valid title.'
                onInput={inputHandler}
              />
              <Input
                id='password'
                element='password'
                required
                fullWidth
                type='password'
                label='Password'
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText='Please enter a valid title.'
                onInput={inputHandler}
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                disabled={!formState.isValid}
              >
                {isLoginMode ? 'Sign in' : 'Sign up'}
              </Button>
            </form>
            <br />
            <Grid container>
              {isLoginMode && (
                <Grid item xs>
                  <Link
                    href='#'
                    variant='body2'
                    onClick={() => setForgotPassword((prev) => !prev)}
                  >
                    Forgot password?
                  </Link>
                </Grid>
              )}

              <Grid item>
                <Link href='#' variant='body2' onClick={switchModeHandler}>
                  {isLoginMode
                    ? "Don't have an account? Sign Up"
                    : 'Already have an account? Sign in'}
                </Link>
              </Grid>
            </Grid>
            <br />

            <div className='signin-alternative'>
              {isLoginMode && <div className='hr-sect'>or</div>}
              {isLoginMode && (
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_LOGIN}
                  buttonText='Log in with Google'
                  onSuccess={responseGoogleHandler}
                  cookiePolicy={'single_host_origin'}
                  icon={true}
                />
              )}
              <br />
              {isLoginMode && (
                <FacebookLogin
                  appId={process.env.REACT_APP_FACEBOOK_LOGIN}
                  // autoLoad={isAutoLoad}
                  fields='name,email,picture'
                  callback={responseFacebookHandler}
                  icon='fa-facebook'
                  textButton=' Log in with Facebook'
                  size='medium'
                />
              )}
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Auth;
