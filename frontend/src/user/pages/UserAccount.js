import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import Modal from '../../shared/components/UIElements/Modal';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import './UserAccount.css';

const UserAccount = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  const history = useHistory();
  const [successModal, setSuccessModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loadedEmail, setLoadedEmail] = useState('');
  const [signType, setSignType] = useState(); // Es - for checking users sign up type

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
        console.log(responseData.user.signType);
        //Es- We dont let google and facebook user to change their email address or password
        if (responseData.user.signType !== "normal") {
          setSignType(responseData.user.signType);
          setMessage(`If you want to change your password or e-mail address, you should do this from your ${responseData.user.signType} account.`);
        }
        setLoadedEmail(responseData.user.email);
      } catch (err) { }
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
    } catch (err) { }
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
    } catch (err) { }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {/*Es Allert google facebook user to make chancing on their account */}
      {signType !== "normal" && <Modal
        show={true}
        onCancel={closeModal}
        header='Alert !!!'
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={<Button onClick={closeModal}>CLOSE</Button>}
      >
        <div className='map-container'>
          <p>{message}</p>
        </div>
      </Modal>}

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
                fullWidth
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
                fullWidth
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
                fullWidth
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText='Please enter your current password.'
                onInput={inputHandler}
              />
              <Input
                element='password'
                id='newPassword'
                type='password'
                label='New Password'
                fullWidth
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
