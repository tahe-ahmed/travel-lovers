import React from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import './CommentForm.css';
import { Button } from '@material-ui/core';

const CommentForm = (props) => {
  return (
    <div>
      <MentionsInput
        className='comments-textarea'
        markup='@[__display__](__type__:__id__)'
        placeholder={"Mention people using '@'"}
        value={props.text}
        onChange={props.handleTextChange}
        appendspaceonadd={'true'}
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
    </div>
  );
};

export default CommentForm;
