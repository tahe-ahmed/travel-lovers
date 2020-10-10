import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Modal from '../../shared/components/UIElements/Modal';
import Button from '@material-ui/core/Button';
// import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import './UpdateUser.css';

const UpdateUser = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState();
  const userId = useParams().userId;
  const [successModal, setSuccessModal] = useState(false);
  const [genderOption, setGenderOption] = useState('');

  const closeModal = () => {
    setSuccessModal(false);
  };

  const radioChange = (e) => {
    setGenderOption(e.target.value);
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
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`
        );
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
        //console.log(responseData.user.gender);
        setGenderOption(responseData.user.gender);
      } catch (err) { }
    };
    fetchUser();
  }, [sendRequest, userId, setLoadedUser, setFormData]);

  const userUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', formState.inputs.name.value);
      formData.append('gender', genderOption);
      formData.append('age', formState.inputs.age.value);
      formData.append('image', formState.inputs.image.value);
      formData.append('biography', formState.inputs.biography.value ? formState.inputs.biography.value : '');
      formData.append('interests', formState.inputs.interests.value ? formState.inputs.interests.value : '');

      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
        'PATCH',
        formData,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );

      setSuccessModal(true);

      auth.userImage = responseData.user.image;
      history.push('/');
    } catch (err) { }
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
            <form
              noValidate
              autoComplete='off'
              className='place-form'
              onSubmit={userUpdateSubmitHandler}
            >
              <ImageUpload
                center
                id='image'
                onInput={inputHandler}
                errorText='Please provide an image.'
                initialValue={loadedUser.image}
                text='Upload an Image'
              />

              <Input
                id='name'
                element='input'
                type='text'
                label='Name'
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a valid title.'
                fullWidth
                onInput={inputHandler}
                initialValue={loadedUser.name}
                initialValid={true}
              />

              <FormControl component='fieldset'>
                <FormLabel component='legend'>Gender</FormLabel>
                <RadioGroup
                  aria-label='gender'
                  name='gender'
                  value={genderOption}
                  onChange={radioChange}
                >
                  <FormControlLabel
                    value='Female'
                    control={<Radio />}
                    label='Female'

                  />
                  <FormControlLabel
                    value='Male'
                    control={<Radio />}
                    label='Male'
                  />
                  <FormControlLabel
                    value='Other'
                    control={<Radio />}
                    label='Other'
                  />
                </RadioGroup>
              </FormControl>

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
                fullWidth
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
                fullWidth
              />
              <Input
                id='biography'
                element='textarea'
                label='My biography'
                fullWidth
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a valid age.'
                onInput={inputHandler}
                initialValue={loadedUser.biography}
                initialValid={true}
              />
              <div className='user-button'>
                <Button
                  type='submit'
                  variant='contained'
                  color='secondary'
                  disabled={!formState.isValid}
                >
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
