import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Modal from '../../shared/components/UIElements/Modal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Pagination from '../../shared/components/UIElements/Pagination';
import useStyles from '../../shared/styles/material-ui-syles';
import Follower from '../../user/components/Follower';

import './UserPlaces.css';
// import Card from '../../shared/components/UIElements/Card';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
} from '@material-ui/core';

const UserPlaces = () => {
  const classes = useStyles();

  const auth = useContext(AuthContext);
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [userInfo, setUserInfo] = useState();
  const [userDetail, setUserDetail] = useState({});
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [placesPerPage] = useState(3);

  const [followers, setFollowers] = useState();
  const [following, setFollowing] = useState();
  const [loginUserFollowing, setLoginUserFollowing] = useState();
  const [followStatus, setFollowStatus] = useState(false);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setUserDetail({ image: responseData.userWithPlaces.image });
        setLoadedPlaces(responseData.places);
        setUserInfo(responseData.userWithPlaces);
      } catch (err) {}
    };

    // const fetchFollowList = async () => {
    //   try {
    //     const responseData = await sendRequest(
    //       `${process.env.REACT_APP_BACKEND_URL}/follow/list/${userId}`
    //     );
    //     if (
    //       responseData.follow[0].followers.filter((x) => x._id === auth.userId)
    //     ) {
    //       setFollowStatus(true);
    //     }
    //     setFollowing(responseData.follow[0].following);
    //     setFollowers(responseData.follow[0].followers);

    //     const loginUserData = await sendRequest(
    //       `${process.env.REACT_APP_BACKEND_URL}/follow/list/${auth.userId}`
    //     );
    //     console.log('loginuser', loginUserData.follow[0].following);
    //     setLoginUserFollowing(loginUserData.follow[0].following);
    //   } catch (err) {}
    // };

    fetchPlaces();
    // fetchFollowList();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  // Get current places
  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces =
    loadedPlaces && loadedPlaces.slice(indexOfFirstPlace, indexOfLastPlace);

  // Change the places when the pagination pageNumber clicked
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // const followHandler = async (event) => {
  //   event.preventDefault();
  //   console.log('follow');
  //   try {
  //     const responseData = await sendRequest(
  //       `${process.env.REACT_APP_BACKEND_URL}/follow/${auth.userId}`,
  //       'POST',
  //       JSON.stringify({
  //         follow_id: userId,
  //       }),
  //       {
  //         'Content-Type': 'application/json',
  //       },
  //       500
  //     );
  //     setFollowStatus(true);
  //     setFollowers(responseData.followers);
  //     //setFollowingCount(responseData.followingCount);
  //     console.log(responseData);
  //   } catch (err) {}
  // };

  // const unfollowHandler = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const responseData = await sendRequest(
  //       `${process.env.REACT_APP_BACKEND_URL}/follow/unfollow/${auth.userId}`,
  //       'POST',
  //       JSON.stringify({
  //         follow_id: userId,
  //       }),
  //       {
  //         'Content-Type': 'application/json',
  //       },
  //       500
  //     );
  //     console.log('unfollow', responseData.followers);
  //     setFollowers(responseData.followers);
  //     setFollowStatus(false);
  //   } catch (err) {}
  // };

  const closeFollowers = () => {
    setShowFollowers(false);
  };



  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      {/* <Modal
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
                    className={classes.large}
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
      </Modal> */}
      {
        <div className='user-detail'>
          <Avatar
            alt='profile'
            src={`${process.env.REACT_APP_ASSET_URL}/${userDetail.image}`}
            // aria-controls={menuId}
            // onClick={handleProfileMenuOpen}
            className={classes.xxLarge}
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='h2'>
              Lizard
            </Typography>
            <Typography className={classes.pos} color='textSecondary'>
              adjective
            </Typography>
            <Follower />
            {/* <Typography className='follow-section'>
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
                {' '}
                {following && following.length} following
              </Typography>
            </Typography> */}
          </CardContent>
          {/* <Button
            variant='contained'
            color='secondary'
            onClick={followStatus ? unfollowHandler : followHandler}
          >
            {followStatus ? 'You are Following' : 'unFollow'}
          </Button> */}
        </div>
      }
      {loadedPlaces && userInfo && (
        <>
          <p className='user-header'>
            {auth.userId === userInfo.id ? 'My' : `${userInfo.name}'s`} Places
          </p>
          <PlaceList
            items={currentPlaces}
            onDeletePlace={placeDeletedHandler}
          />
        </>
      )}
      {loadedPlaces && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={placesPerPage}
          totalItems={loadedPlaces.length}
          paginate={paginate}
        />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
