import React, { useEffect, useContext, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useForm } from '../../shared/hooks/form-hook';
import Input from '../../shared/components/FormElements/Input';
import Modal from '../../shared/components/UIElements/Modal';
import { AuthContext } from '../../shared/context/auth-context';

import { Button, Typography } from '@material-ui/core';

import { VALIDATOR_EQUAL, VALIDATOR_MIN } from '../../shared/util/validators';

import './ResetPassword.css';

const ResetPassword = () => {
  const history = useHistory();
  const token = useParams().resetToken;
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loaded, setLoaded] = useState(false);
  const [show, setShow] = useState(false);
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

  const close = () => {
    setShow(false);
    history.push(`/auth`);
  };

  useEffect(() => {
    const reset = async () => {
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/reset/${token}`
        );
        setLoaded(true);
      } catch (err) {}
    };
    reset();
  }, [token]);

  const passwordSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/reset/updatePasswordViaEmail/${token}`,
        'PATCH',
        JSON.stringify({
          newPassword: formState.inputs.newPassword.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
      setShow(true);
    } catch (err) {}
  };

  return (
    <>
      <Modal
        show={show}
        onCancel={close}
        header={'Success'}
        footerClass='bucketList-detail__modal-actions'
        footer={
          <React.Fragment>
            <Button variant='contained' color='primary' onClick={close} inverse>
              OK
            </Button>
          </React.Fragment>
        }
      >
        <p>Your password was reset!</p>
      </Modal>
      {error && error !== 'SamePasswordError' ? (
        <div className='container'>
          <div className='user-container'>{error}</div>
        </div>
      ) : (
        <>
          {error && error === 'SamePasswordError' && (
            <div className='container'>
              <div className='user-container'>
                {' '}
                Your new password can not be the same as your current password!
              </div>
            </div>
          )}
          {loaded && (
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
                    validators={[
                      VALIDATOR_EQUAL(formState.inputs.newPassword.value),
                    ]}
                    errorText='can not be sameeee'
                    onInput={inputHandler}
                  />
                  <Button
                    variant='contained'
                    color='primary'
                    type='submit'
                    disabled={
                      !(
                        formState.inputs.confirmPassword.isValid &&
                        formState.inputs.newPassword.isValid
                      )
                    }
                  >
                    Reset Password
                  </Button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
      )
    </>
  );
};

export default ResetPassword;
