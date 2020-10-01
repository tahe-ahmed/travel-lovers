import React, { useState, useContext } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  CircularProgress,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Modal from '../../shared/components/UIElements/Modal';

import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
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
  const [isAutoLoad, setIsAutoLoad] = useState(false); // for facebook login
  const [resetPasswordMsg,setResetPasswordMsg] = useState('');
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
        auth.login(responseData.userId, responseData.token, responseData.image);
      } catch (err) {}
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

        auth.login(responseData.userId, responseData.token, responseData.image);
      } catch (err) {}
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
        500
      );
      auth.login(responseData.userId, responseData.token);
    } catch (err) {}
  };

  // facebook login handler

  const responseFacebookHandler = async (response) => {
    console.log('facebook');
    setIsAutoLoad(true);

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
        },500
      );
      auth.login(responseData.userId, responseData.token);
    } catch (err) {}
  };

  const resetPassword = async () => {
    setIsAutoLoad(true);
    console.log('resetemail', formState.inputs.resetEmail.value);
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/forgotPassword`,
        'POST',
        JSON.stringify({
          email:formState.inputs.resetEmail.value,
        }),
        {
          'Content-Type': 'application/json',
        }
      );
      console.log("return",responseData.msg);
      setResetPasswordMsg(responseData.msg);
      // auth.login(responseData.userId, responseData.token);
    } catch (err) {}
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
          <React.Fragment>
            <Button inverse onClick={closeForgotPassword}>
              CANCEL
            </Button>
            {resetPasswordMsg ==='' && <Button danger onClick={resetPassword}>
              Reset Password
            </Button>}
          </React.Fragment>
        }
      >
        <div className='map-container'>
          {resetPasswordMsg  === '' &&  <Input
            id='resetEmail'
            element='input'
            type='text'
            label='Email'
            validators={[VALIDATOR_EMAIL()]}
            errorText='Please enter a valid email address.'
            onInput={inputHandler}
            placeholder='Enter your email address'
          /> 
          }
          {resetPasswordMsg !=='' && <p>{resetPasswordMsg} </p>}
      
        </div>
      </Modal>
      <div className='container'>
        <Card className='authentication'>
          {isLoading && <LoadingSpinner asOverlay />}
          <h2>{isLoginMode ? 'Login' : 'Signup'} Required</h2>
          <hr />
          <form onSubmit={authSubmitHandler}>
            {!isLoginMode && (
              <Input
                element='input'
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
              element='input'
              id='email'
              type='email'
              label='E-Mail'
              validators={[VALIDATOR_EMAIL()]}
              errorText='Please enter a valid email address.'
              onInput={inputHandler}
            />
            <Input
              element='input'
              id='password'
              type='password'
              label='Password'
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText='Please enter a valid password, at least 6 characters.'
              onInput={inputHandler}
            />
            <Button type='submit' disabled={!formState.isValid}>
              {isLoginMode ? 'LOGIN' : 'SIGNUP'}
            </Button>
          </form>
          <Button inverse onClick={switchModeHandler}>
            SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
          </Button>
          <br />
          <br />
          {isLoginMode && (
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_LOGIN}
              buttonText='Log in with Google'
              onSuccess={responseGoogleHandler}
              cookiePolicy={'single_host_origin'}
              icon={true}
              theme='white'
            />
          )}
          <br />
          {isLoginMode && (
            <FacebookLogin
              appId={process.env.REACT_APP_FACEBOOK_LOGIN}
              // autoLoad={isAutoLoad}
              fields="name,email,picture"
              callback={responseFacebookHandler}
              icon='fa-facebook'
              textButton=' Log in with Facebook'
              size="small"
         
            />
         
          )}
          <br />
          <br />
        </Card>

        <div>
          {isLoginMode && (
            <p onClick={() => setForgotPassword((prev) => !prev)}>
              ForgotPassword
            </p>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Auth;

