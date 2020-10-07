import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import Modal from '../../shared/components/UIElements/Modal';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
} from '@material-ui/core';

const Follower = (props) => {
  const [followers, setFollowers] = useState();
  const [following, setFollowing] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [loginUserFollowing, setLoginUserFollowing] = useState();
  const [followStatus, setFollowStatus] = useState(false);
  
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const auth = useContext(AuthContext);

  const userId = useParams().userId;

  useEffect(() => {
    const fetchFollowList = async () => {
      try {
        console.log('userID', props.userId);
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/follow/list/${userId}`
        );
        if (
          responseData.follow[0].followers.filter((x) => x._id === auth.userId)
        ) {
          setFollowStatus(true);
        }

        console.log('follower', responseData);

        setFollowing(responseData.follow[0].following);
        setFollowers(responseData.follow[0].followers);

        const loginUserData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/follow/list/${auth.userId}`
        );
        console.log('loginuser', loginUserData.follow[0].following);
        setLoginUserFollowing(loginUserData.follow[0].following);
      } catch (err) {}
    };

    fetchFollowList();
  }, [sendRequest, userId]);

  const followHandler = async (event) => {
    event.preventDefault();
    console.log('follow');
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
      //setFollowingCount(responseData.followingCount);
      console.log(responseData);
    } catch (err) {}
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
      console.log('unfollow', responseData.followers);
      setFollowers(responseData.followers);
      setFollowStatus(false);
    } catch (err) {}
  };

  const closeFollowers = () => {
    setShowFollowers(false);
  };

  return (
    <>
      <Modal
        className='modal-follow-content'
        show={showFollowers}
        onCancel={closeFollowers}
      >
        {followers &&
          followers.map((item) => {
            return (
              <div className='modal-follow'>
                <div className='modal-info'>
                  <Avatar
                    alt='profile'
                    src={`${process.env.REACT_APP_ASSET_URL}/${item.image}`}
                    // aria-controls={menuId}
                    // onClick={handleProfileMenuOpen}
                    // className={classes.large}
                  />
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
              </div>
            );
          })}
      </Modal>

      <>
        <Typography className='follow-section'>
          <Typography>
            <Button
            onClick={() =>
              setShowFollowers((showFollowers) => !showFollowers)
            }
            >
              {followers && followers.length} followers
            </Button>
          </Typography>
          <Typography> . </Typography>
          <Typography>
            
          <Button
            onClick={() =>
              setShowFollowers((showFollowers) => !showFollowers)
            }
            >
              {following && following.length} following
            </Button>
            
           </Typography>
        </Typography>
        <Button
          variant='contained'
          color='secondary'
          onClick={followStatus ? unfollowHandler : followHandler}
        >
          {followStatus ? 'You are Following' : 'unFollow'}
        </Button>
      </>
    </>
  );
};

export default Follower;
