import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useForm } from '../../shared/hooks/form-hook';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import {
  VALIDATOR_EMAIL,
    VALIDATOR_EQUAL,
    VALIDATOR_MIN,
  VALIDATOR_MINLENGTH,
  VALIDATOR_TYPE_EQUAL
} from '../../shared/util/validators';

import './ResetPassword.css';

const ResetPassword = () => {
  const token = useParams().resetToken;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  console.log('token', token);

  const [formState, inputHandler, setFormData] = useForm(
    {
      newPassword: {
        value: '',
        isValid: false,
      },
      confirmPassword: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/reset/reset/${token}`
        );

        if (responseData);
        console.log('ress');
        // setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  const passwordSubmitHandler = async (event) => {
    event.preventDefault();
    try {
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <div className='container'>
        <div className='user-container'>
          <form
            noValidate
            autoComplete='off'
            className='place-form'
            onSubmit={passwordSubmitHandler}
          >
            <Input
              element='password'
              id='newPassword'
              type='password'
              label='New Password'
              fullWidth
              validators={[VALIDATOR_MIN(6)]}
              errorText='can not be sameeee'
              onInput={inputHandler}
            />
             <Input
              element='password'
              id='confirmPassword'
              type='password'
              label='Confirm Password'
              fullWidth
              validators={[VALIDATOR_EQUAL(formState.inputs.newPassword.value)]}
              errorText='can not be sameeee'
              onInput={inputHandler}
            />
            <Button
              type='submit'
            //   disabled={
            //     !(
            //       formState.inputs.currentPassword.isValid &&
            //       formState.inputs.newPassword.isValid
            //     )
            //   }
            >
              Change password
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
