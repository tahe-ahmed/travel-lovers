import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import {
  Avatar,
  Typography,
  Button,
  List,
  ListItem,
  DialogTitle,
  Dialog,
} from '@material-ui/core';

import './Follower.css';

const Follower = (props) => {
  const [followers, setFollowers] = useState();
  const [following, setFollowing] = useState();
  const {sendRequest } = useHttpClient();
  const [loginUserFollowing, setLoginUserFollowing] = useState([]);
  const [followStatus, setFollowStatus] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const auth = useContext(AuthContext);
  const userId = useParams().userId;

  useEffect(() => {
    const fetchFollowList = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/follow/list/${userId}`
        );
        // Does the login user follow the user concerned?
        //we are checking this here
        if (
          responseData.follow[0].followers.filter((x) => x._id === auth.userId).length > 0
        ) {
          setFollowStatus(true);
        }
        setFollowing(responseData.follow[0].following);
        setFollowers(responseData.follow[0].followers);
      } catch (err) { }
    };

    /* We get users that the logged-in user follows, in this part. */
    const fetchLogginUserFollowingList = async () => {
      try {
        const loginUserData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/follow/list/${auth.userId}`
        );
        setLoginUserFollowing(loginUserData.follow[0].following);
      } catch (err) { }
    };
    fetchLogginUserFollowingList();
    fetchFollowList();
  }, [sendRequest, userId, loginUserFollowing.length]);

  const followHandler = async (event) => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/follow/${auth.userId}`,
        'POST',
        JSON.stringify({
          follow_id: userId,
        }),
        {
          'Content-Type': 'application/json',
        },
        500
      );
      setFollowStatus(true);
      setFollowers(responseData.followers);
      sendNotifiMentionsToBackend(userId);
    } catch (err) { }
  };
  const unfollowHandler = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/follow/unfollow/${auth.userId}`,
        'POST',
        JSON.stringify({
          follow_id: userId,
        }),
        {
          'Content-Type': 'application/json',
        },
        500
      );
      setFollowers(responseData.followers);
      setFollowStatus(false);
    } catch (err) { }
  };

  // this part related to loggin user followers
  // if loggin user follow the this user's followers or following , this method works.
  const followHandlerByLogginUser = async (event, followId) => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/follow/${auth.userId}`,
        'POST',
        JSON.stringify({
          follow_id: followId,
          logginUser: true,
        }),
        {
          'Content-Type': 'application/json',
        },
        500
      );

      setLoginUserFollowing(responseData.following);
    } catch (err) { }
  };

  const unfollowHandlerByLogginUser = async (event, unfollowId) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/follow/unfollow/${auth.userId}`,
        'POST',
        JSON.stringify({
          follow_id: unfollowId,
          logginUser: true,
        }),
        {
          'Content-Type': 'application/json',
        },
        500
      );
      setLoginUserFollowing(responseData.following);
    } catch (err) { }
  };

  /* create the notification data to be sent to server upon submiting the comment */
  const sendNotifiMentionsToBackend = async (followedID) => {
    const notificationData = {
      receiver: [{ _id: followedID }],
      sender: auth.userId,
      read: [{}],
      follow: true,
    };
    // send to backend ==============>
    try {
       await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/notifications`,
        'POST',
        JSON.stringify(notificationData),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
    } catch (err) { }
  };

  const closeFollowers = () => {
    setShowFollowers(false);
  };
  const closeFollowings = () => {
    setShowFollowing(false);
  };

  return (
    <>
      <Dialog
        open={showFollowers}
        fullWidth='xs'
        maxWidth='xs'
        keepMounted
        onClose={closeFollowers}
        aria-labelledby='customized-dialog-title'
      >
        <DialogTitle id='customized-dialog-title' className="dialog-modal-title">{followers && followers.length} Followers</DialogTitle>
        <List>
          {followers &&
            followers.map((item) => {
              return (
                <ListItem autoFocus button className='list-item-modal'>
                  <div className='list-item-info'>
                    <Avatar alt='profile' src={`${item.image}`} />
                    <Typography className='follow-name'>{item.name}</Typography>
                  </div>
                  <div>
                    {item._id !== auth.userId &&
                      (loginUserFollowing &&
                        loginUserFollowing.filter((x) => x._id === item._id)
                          .length > 0 ? (
                          <Button
                            variant='contained'
                            color='primary'
                            onClick={(e) =>
                              unfollowHandlerByLogginUser(e, item._id)
                            }
                          >
                            Following
                          </Button>
                        ) : (
                          <Button
                            variant='contained'
                            color='secondary'
                            onClick={(e) =>
                              followHandlerByLogginUser(e, item._id)
                            }
                          >
                            Follow
                          </Button>
                        ))}
                  </div>
                </ListItem>
              );
            })}
        </List>
      </Dialog>
      <Dialog
        open={showFollowing}
        fullWidth='xs'
        maxWidth='xs'
        keepMounted
        onClose={closeFollowings}
        aria-labelledby='customized-dialog-title'
      >
        <DialogTitle id='customized-dialog-title' className="dialog-modal-title" >{following && following.length} Following</DialogTitle>
        <List>
          {following &&
            following.map((item) => {
              return (
                <ListItem autoFocus button className='list-item-modal'>
                  <div className='list-item-info'>
                    <Avatar alt='profile' src={`${item.image}`} />
                    <Typography className='follow-name'>{item.name}</Typography>
                  </div>
                  <div>
                    {item._id !== auth.userId &&
                      (loginUserFollowing &&
                        loginUserFollowing.filter((x) => x._id === item._id) ? (
                          <Button variant='contained' color='primary'>
                            Following
                          </Button>
                        ) : (
                          <Button variant='contained' color='secondary'>
                            Follow
                          </Button>
                        ))}
                  </div>
                </ListItem>
              );
            })}
        </List>
      </Dialog>

      <>
        <Typography className='follow-section'>
          {followers && followers.length > 0 && (
            <Typography>
              <Button
                onClick={() =>
                  setShowFollowers((showFollowers) => !showFollowers)
                }
              >
                {followers && followers.length} followers
              </Button>
            </Typography>
          )}
          {followers &&
            followers.length > 0 &&
            following &&
            following.length > 0 && <Typography> . </Typography>}
          {following && following.length > 0 && (
            <Typography>
              <Button
                onClick={() =>
                  setShowFollowing((showFollowing) => !showFollowing)
                }
              >
                {following && following.length} following
              </Button>
            </Typography>
          )}
        </Typography>
        <div className='follow-button'>
          {auth.userId !== userId && 
          <Button
          variant='contained'
          color={followStatus ? 'primary' : 'secondary'}
          onClick={followStatus ? unfollowHandler : followHandler}
        >
          {followStatus ? 'Following' : 'Follow'}
        </Button>
          }
       
        </div>
      </>
    </>
  );
};

export default Follower;
