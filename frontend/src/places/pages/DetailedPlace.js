import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
// import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import PlaceItem from '../components/PlaceItem';
import CommentList from '../components/comments/CommentList.js';
import CommentForm from '../components/comments/CommentForm';

import { Card, Avatar, Button } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import './DetailedPlace.css';
import { CardMedia } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '64vw',
    height: '40vw',
  },

  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 2 auto',
  },
  cover: {
    width: 270,
  },
}));

const DetailedPlace = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const auth = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loadedUsers, setLoadedUsers] = useState();
  const [place, setPlace] = useState();
  const [commentValueInput, setCommentValueInput] = useState('');
  const [mentions, setMentions] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const placeId = useParams().placeId;

  /////////// set up the mentions and notification data ////////////
  const usersToMention =
    loadedUsers &&
    loadedUsers.map((user) => ({ id: '#', display: user.name, _id: user.id }));
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
    setCommentValueInput('');
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
        process.env.REACT_APP_BACKEND_URL + '/comments',
        {
          method: 'POST',
          body: JSON.stringify(variables),
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token,
          },
        }
      );
      newComment = await rawResponse.json();
      updateComment(newComment.comment);
    } catch (err) {}

    ////////////////// create the notification data to be sent to server upon submiting the comment /////////////
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
          read: false,
        };
        // send to backend ==============>
        console.log(notificationData);
      }
    }
  };

  ////////// send DELETE request to the server and update the local state ////////
  const ondelete = async (todeleteId) => {
    try {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/comments/${todeleteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + auth.token,
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
        <div className='place-detail'>
          {place && (
            <Card className={`${classes.root} place-item`}>
              <CardMedia
                className={classes.cover}
                image={`${process.env.REACT_APP_ASSET_URL}/${place.image}`}
                title={place.title}
                component={Link}
                to={{
                  pathname: `/${auth.userId}/places`,
                }}
              />

              <CardContent className={`${classes.content} info-container`}>
                <div>
                  <Link
                    to={`/${auth.userId}/places`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Typography component='h5' variant='h5'>
                      {place.title}
                    </Typography>
                    <Typography variant='subtitle1' color='textSecondary'>
                      {place.address}
                    </Typography>
                    <Typography variant='subtitle1' color='textSecondary'>
                      {place.description}
                    </Typography>
                  </Link>
                </div>
                <div className='info-detail-container'>
                  <div className='detail-info'>
                    <Avatar
                      alt='Remy Sharp'
                      src={`${process.env.REACT_APP_ASSET_URL}/${auth.userImage}`}
                      component={Link}
                      to={{
                        pathname: `/${auth.userId}/places`,
                      }}
                    />
                    <div className="name-followersCount">
                      {loadedUsers && (
                        <Typography
                          variant='subtitle1'
                          color='textSecondary'
                          component={Link}
                          to={{
                            pathname: `/${auth.userId}/places`,
                          }}
                        >
                          {
                            loadedUsers.find((user) => user.id === auth.userId)
                              .name
                          }
                        </Typography>
                      )}
                      <Typography variant='subtitle1' color='textSecondary'>
                        35 followers
                      </Typography>
                    </div>
                  </div>
                  <div className='follow-button'>
                    <Button variant='contained' color='secondary'>
                      Follow
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <Card className='place-item'>
            <CardContent>
              <Typography color='textSecondary' gutterBottom>
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
