import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Modal from '../../shared/components/UIElements/Modal';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';

import './UserAccount.css';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';

const UserAccount = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  const history = useHistory();
  const [successModal, setSuccessModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loadedEmail, setLoadedEmail] = useState('');

  const closeModal = () => {
    setSuccessModal(false);
    history.push('/user');
  };

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      newEmail: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
      currentPassword: {
        value: '',
        isValid: false,
      },
      newPassword: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`
        );
        setLoadedEmail(responseData.user.email);
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, userId, setFormData]);

  const emailSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/account/${userId}`,
        'PATCH',
        JSON.stringify({
          newEmail: formState.inputs.newEmail.value,
          password: formState.inputs.password.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
      setMessage('Email succesfully changed!');
      setSuccessModal(true);
      auth.login(responseData.userId, responseData.token, responseData.image);
    } catch (err) {}
  };
  const passwordSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/account/${userId}`,
        'PATCH',
        JSON.stringify({
          password: formState.inputs.currentPassword.value,
          newPassword: formState.inputs.newPassword.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
      setMessage('Password succesfully changed!');
      setSuccessModal(true);

      auth.login(responseData.userId, responseData.token, responseData.image);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={successModal}
        onCancel={closeModal}
        header='Success'
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={<Button onClick={closeModal}>CLOSE</Button>}
      >
        <div className='map-container'>
          <p>{message}</p>
        </div>
      </Modal>
      {
        <div>
          <div className='container'>
            <hr />
            <form onSubmit={emailSubmitHandler}>
              <Input
                element='input'
                id='newEmail'
                type='email'
                placeholder={loadedEmail}
                label='New E-Mail'
                validators={[VALIDATOR_EMAIL()]}
                errorText='Please enter a valid email address.'
                onInput={inputHandler}
              />
              <Input
                element='password'
                id='password'
                type='password'
                label='Current Password'
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText='Please enter a valid password, at least 6 characters.'
                onInput={inputHandler}
              />
              <Button
                type='submit'
                disabled={
                  !(
                    formState.inputs.newEmail.isValid &&
                    formState.inputs.password.isValid
                  )
                }
              >
                Update email
              </Button>
            </form>
          </div>

          <div className='container'>
            <hr />
            <form onSubmit={passwordSubmitHandler}>
              <Input
                element='password'
                id='currentPassword'
                type='password'
                label='Current Password'
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText='Please enter your current password.'
                onInput={inputHandler}
              />
              <Input
                element='password'
                id='newPassword'
                type='password'
                label='New Password'
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText='Please enter a valid password, at least 6 characters.'
                onInput={inputHandler}
              />
              <Button
                type='submit'
                disabled={
                  !(
                    formState.inputs.currentPassword.isValid &&
                    formState.inputs.newPassword.isValid
                  )
                }
              >
                Change password
              </Button>
            </form>
          </div>
        </div>
      }
    </React.Fragment>
  );
};

export default UserAccount;
