import React, { useContext } from "react";
import ReactMarkdown from "react-markdown";
import { AuthContext } from "../../../shared/context/auth-context";
import Card from "@material-ui/core/CardContent";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";

import Avatar from "@material-ui/core/Avatar";

import "./Comment.css";

const Comment = (props) => {
  ////// check if the current user is the one who authorizated to delete the comment /////
  const auth = useContext(AuthContext);
  let showRemove = true;
  if (props.writer !== undefined) {
    if (props.writer._id !== undefined) {
      if (props.writer._id !== auth.userId) showRemove = false;
    }
  }

  return (
    <React.Fragment>
      {props.writer && (
        <Card>
          <CardContent className="card">
            <div className="comment-card">
              <div className="comment-profile">
                <Avatar
                  alt="user_image"
                  className="userImage"
                  src={props.writer.image} // hosting image
                />
                <Typography color="textSecondary">
                  {props.writer._id === auth.userId ? "You" : props.writer.name}
                </Typography>
              </div>
              <Typography variant="body2" component="div">
                <ReactMarkdown source={props.content} />
              </Typography>
            </div>
          </CardContent>
          {showRemove && (
            <div className="comment-button">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => props.ondelete(props.commentId)}
              >
                Delete
              </Button>
            </div>
          )}
        </Card>
      )}
    </React.Fragment>
  );
};

export default Comment;
