import React, { useContext } from "react";
import ReactMarkdown from "react-markdown";
import { AuthContext } from "../../../shared/context/auth-context";

const Comment = (props) => {
  ////// check if the current user is the one who authorizated to delete the comment /////
  const auth = useContext(AuthContext);
  let showRemove = true;
  if (props.writer._id !== undefined) {
    if (props.writer._id !== auth.userId) showRemove = false;
  }

  return (
    <React.Fragment>
      {props.writer && (
        <div className="singleComment">
          <img
            alt="user_image"
            className="userImage"
            src={`${props.writer.image}`}
          />
          <div className="textContent">
            <div className="singleCommentContent">
              <h3>{props.writer.name}</h3>
              <ReactMarkdown source={props.content} />
            </div>
            {showRemove && (
              <button
                type="button"
                onClick={() => props.ondelete(props.commentId)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Comment;
