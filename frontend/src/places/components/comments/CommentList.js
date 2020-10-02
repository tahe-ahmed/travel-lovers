import React from "react";

import Comment from "./Comment";

const CommentList = (props) => {
  const commentData = props.data;

  return (
    <React.Fragment>
      {commentData &&
        commentData.map((comment) => (
          <Comment
            key={comment._id}
            content={comment.content}
            writer={comment.writerId}
            ondelete={props.ondelete}
            commentId={comment._id}
          />
        ))}
    </React.Fragment>
  );
};

export default CommentList;
