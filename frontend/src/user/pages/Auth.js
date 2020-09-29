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
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

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

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className='login-background'>
        <Container component='main' maxWidth='xs' className='login-form'>
          <CssBaseline />
          <div className='paper'>
            <div className='header'>
              {isLoading && <CircularProgress color='secondary' />}
              <Avatar className='avatar'>
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
                Sign In
              </Button>
              <Grid container>
                {isLoginMode && (
                  <Grid item xs>
                    <Link href='#' variant='body2'>
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
            </form>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Auth;
