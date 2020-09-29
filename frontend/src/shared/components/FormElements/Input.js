import React, { useReducer, useEffect } from 'react';

import IconButton from '@material-ui/core/IconButton';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { validate } from '../../util/validators';
import './Input.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH',
    });
  };

  let element = '';
  if (props.element === 'input') {
    element = (
      <TextField
        error={!inputState.isValid && inputState.isTouched ? true : false}
        required={props.required ? true: false}
        fullWidth={props.fullWidth ? true : false}
        id='outlined-basic'
        label={props.label}
        variant='outlined'
        defaultValue={props.initialValue}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        helperText={
          !inputState.isValid && inputState.isTouched ? props.errorText : ''
        }
      />
    );
  } else if (props.element === 'password') {
    element = (
      <TextField
      variant='outlined'
      margin='normal'
      element='password'
      required
      fullWidth
      name='password'
      label='Password'
      type='password'
      id='password'
      autoComplete='current-password'
      onChange={changeHandler}
      onBlur={touchHandler}
    />
    );
  } else {
    element = (
      <TextField
        error={props.error}
        id='outlined-multiline-flexible'
        label={props.label}
        required={props.required ? true: false}
        fullWidth={props.fullWidth ? true : false}
        multiline
        rowsMax={4}
        onChange={changeHandler}
        defaultValue={props.initialValue}
        variant='outlined'
        onBlur={touchHandler}
        helperText={
          !inputState.isValid && inputState.isTouched ? props.errorText : ''
        }
      />
    );
  }

  return <div className='form-control'>{element}</div>;

};

export default Input;
