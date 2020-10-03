import React from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import './CommentForm.css';
import {Card,Button}  from '@material-ui/core';

const CommentForm = (props) => {
  return (
    <>
      <MentionsInput
        className='comments-textarea'
        markup='@[__display__](__type__:__id__)'
        placeholder={"Mention people using '@'"}
        value={props.text}
        onChange={props.handleTextChange}
        appendSpaceOnAdd={true}
      >
        <Mention
          trigger='@'
          data={props.users}
          href='#'
          onAdd={props.onAdd}
          style={{
            backgroundColor: '#daf4fa',
          }}
        />
      </MentionsInput>
      <div className="comment-button">
      <Button variant='contained' color='primary' onClick={props.submitComment}>
        Submit
      </Button>
      </div>
    </>
  );
};

export default CommentForm;
