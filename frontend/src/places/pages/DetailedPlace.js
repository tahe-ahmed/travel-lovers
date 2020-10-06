import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
// import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import PlaceItem from "../components/PlaceItem";
import CommentList from "../components/comments/CommentList.js";
import CommentForm from "../components/comments/CommentForm";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import "./DetailedPlace.css";

const DetailedPlace = (props) => {
  const auth = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loadedUsers, setLoadedUsers] = useState();
  const [place, setPlace] = useState();
  const [commentValueInput, setCommentValueInput] = useState("");
  const [mentions, setMentions] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const placeId = useParams().placeId;

  /////////// set up the mentions and notification data ////////////
  const usersToMention =
    loadedUsers &&
    loadedUsers.map((user) => ({ id: "#", display: user.name, _id: user.id }));
  ///////// get the users' id and display name when mentioned in the commnets
  const onAdd = (id, display) => {
    setMentions([...mentions, { id: id, display: display }]);
  };

  ///////////////// get all users ////////////////
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users`
        );

        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  ///////////////////////// get the detailed place by id ////////////////////
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setPlace(responseData.place);
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId]);

  ////////////////// Get all the commments by placeId ////////////////////////////
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/comments/${placeId}`
        );
        setComments(responseData.comment);
      } catch (err) {}
    };
    fetchComments();
  }, [sendRequest, placeId]);

  /////////////// when post new comments add them to the client state ////////////////
  const updateComment = (newComment) => {
    setCommentValueInput("");
    setComments((comments) => [...comments, newComment]);
  };

  ///////////////////  when typing in the comment input update the commnetValueInput ////
  const handleChange = (e) => {
    setCommentValueInput(e.target.value);
  };

  /////////// onSumiting the comments post them to the server and update the local state //////
  let newComment;
  const onSubmit = async (e) => {
    e.preventDefault();

    const variables = {
      writerId: auth.userId,
      placeId,
      content: commentValueInput,
    };

    try {
      const rawResponse = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/comments",
        {
          method: "POST",
          body: JSON.stringify(variables),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      newComment = await rawResponse.json();
      updateComment(newComment.comment);
      sendNotifiMentionsToBackend(newComment);
    } catch (err) {}

    ////////////////// create the notification data to be sent to server upon submiting the comment /////////////
  };

  const sendNotifiMentionsToBackend = async (newComment) => {
    newComment && console.log(newComment.comment);
    if (mentions.length >= 1) {
      if (usersToMention) {
        const notificationReceivers = mentions.map(
          (mention) =>
            usersToMention.filter((user) => user.display === mention.display)[0]
        );
        const notificationData = {
          receiver: notificationReceivers,
          sender: auth.userId,
          placeId: place.id,
          read: [{}],
          comment: newComment.comment._id,
        };
        // send to backend ==============>
        try {
          const response = await fetch(
            process.env.REACT_APP_BACKEND_URL + "/notifications",
            {
              method: "POST",
              body: JSON.stringify(notificationData),
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + auth.token,
              },
            }
          );

          const not = await response.json();
          setMentions([]);
        } catch (err) {}
      }
    }
  };

  ////////// send DELETE request to the server and update the local state ////////
  const ondelete = async (todeleteId) => {
    ////// delete the comment from backend/////
    try {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/comments/${todeleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + auth.token,
        },
      });
    } catch (err) {}
    //delete from the array
    const updatedcomments = comments.filter(
      (comment) => comment._id !== todeleteId
    );
    setComments(updatedcomments);
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <LoadingSpinner asOverlay />
      ) : (
        <div className="place-detail">
          {place && (
            <PlaceItem
              key={place.id}
              id={place.id}
              image={place.image}
              title={place.title}
              description={place.description}
              address={place.address}
              creatorId={place.creator}
              coordinates={place.location}
              onDelete={props.onDeletePlace}
            />
          )}
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Comments
              </Typography>
              {loadedUsers && (
                <CommentForm
                  handleTextChange={handleChange}
                  submitComment={onSubmit}
                  text={commentValueInput}
                  users={usersToMention}
                  onAdd={onAdd}
                />
              )}

              {comments.length >= 1 && (
                <CommentList
                  data={comments.sort(function (a, b) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                  })}
                  ondelete={ondelete}
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </React.Fragment>
  );
};

export default DetailedPlace;
