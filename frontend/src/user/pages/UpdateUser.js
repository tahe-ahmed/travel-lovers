import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Modal from '../../shared/components/UIElements/Modal';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import './UpdateUser.css';

const UpdateUser = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState();
  const userId = useParams().userId;
  const [successModal, setSuccessModal] = useState(false);
  const [genderOption, setGenderOption] = useState('');

  const closeModal = () => {
    setSuccessModal(false);
  };

  const radioChange = (e) => {
    setGenderOption(e.currentTarget.value);
  };

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: '',
        isValid: false,
      },
      age: {
        value: '',
        isValid: false,
      },
      image: {
        value: '',
        isValid: false,
      },
      biography: {
        value: '',
        isValid: true,
      },
      interests: {
        value: '',
        isValid: true,
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
        console.log(responseData.user.biography);
        setLoadedUser(responseData.user);
        setFormData(
          {
            name: {
              value: responseData.user.name,
              isValid: true,
            },
            age: {
              value: responseData.user.age,
              isValid: true,
            },
            image: {
              value: responseData.user.image,
              isValid: true,
            },
            biography: {
              value: responseData.user.biography,
              isValid: true,
            },
            interests: {
              value: responseData.user.interests,
              isValid: true,
            },
          },
          true
        );
        console.log(responseData.user.gender);
        setGenderOption(responseData.user.gender);
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, userId, setFormData]);

  const userUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
        'PATCH',
        JSON.stringify({
          name: formState.inputs.name.value,
          gender: genderOption,
          age: formState.inputs.age.value,
          image: formState.inputs.image.value,
          biography: formState.inputs.biography.value,
          interests: formState.inputs.interests.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
      setSuccessModal(true);
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
        <div>
          <p>Your profile is updated</p>
        </div>
      </Modal>
      {!isLoading && loadedUser && (
        <div className='container'>
          <div className='user-container'>
            <form className='user-form' onSubmit={userUpdateSubmitHandler}>
              <ImageUpload
                center
                id='image'
                onInput={inputHandler}
                errorText='Please provide an image.'
                initialValue={`${process.env.REACT_APP_ASSET_URL}/${loadedUser.image}`}
                text='Upload an Image'
              />

              <Input
                id='name'
                element='input'
                type='text'
                label='Name'
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a valid title.'
                onInput={inputHandler}
                initialValue={loadedUser.name}
                initialValid={true}
              />

              <label>Gender</label>
              <div className='radio'>
                <input
                  type='radio'
                  value='Female'
                  checked={genderOption === 'Female'}
                  onChange={radioChange}
                />
                Female
                <input
                  type='radio'
                  value='Male'
                  checked={genderOption === 'Male'}
                  onChange={radioChange}
                />
                Male
              </div>
              <Input
                id='age'
                element='input'
                type='text'
                label='Age'
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a valid age.'
                onInput={inputHandler}
                initialValue={loadedUser.age}
                initialValid={true}
              />
              <Input
                id='interests'
                element='textarea'
                label='My interests'
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a valid age.'
                onInput={inputHandler}
                initialValue={loadedUser.interests}
                initialValid={true}
              />
              <Input
                id='biography'
                element='textarea'
                label='My biography'
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a valid age.'
                onInput={inputHandler}
                initialValue={loadedUser.biography}
                initialValid={true}
              />
              <div className='user-button'>
                <Button type='submit' disabled={!formState.isValid}>
                  SAVE CHANGES
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default UpdateUser;
