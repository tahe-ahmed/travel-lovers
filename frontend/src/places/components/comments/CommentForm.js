import React from "react";
import { MentionsInput, Mention } from "react-mentions";

const CommentForm = (props) => {
  return (
    <form onSubmit={props.submitComment}>
      <MentionsInput
        className="mentions-input"
        markup="@[__display__](__type__:__id__)"
        placeholder={"Mention people using '@'"}
        value={props.text}
        onChange={props.handleTextChange}
        appendSpaceOnAdd={true}
      >
        <Mention trigger="@" data={props.users} href="#" onAdd={props.onAdd} />
      </MentionsInput>
      <button type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;
