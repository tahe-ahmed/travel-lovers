import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import UserPlaceList from '../components/UserPlaceList';
import { useHttpClient } from '../../shared/hooks/http-hook';
import useStyles from '../../shared/styles/material-ui-syles';
import Follower from '../../user/components/Follower';
import TravelBucketList from '../components/TravelBucketList';
import Dialog from '@material-ui/core/Dialog';
import {
  CardContent,
  Avatar,
  Typography,
  Button,
} from '@material-ui/core';
import './UserPlaces.css';
import { AuthContext } from '../../shared/context/auth-context';

const UserPlaces = () => {
  const classes = useStyles();
  const history = useHistory();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [userInfo, setUserInfo] = useState({});
  const { sendRequest } = useHttpClient();
  // const [currentPage, setCurrentPage] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  // const [placesPerPage] = useState(3);
  const auth = useContext(AuthContext);

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) { }
    };

    const fetchUserInfo = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`
        );
        setUserInfo(responseData.user);
      } catch (err) { }
    };

    fetchUserInfo();
    fetchPlaces();
    // fetchFollowList();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  if (!auth.isLoggedIn) {
    history.push(`/auth`);
  }

  // Get current places
  // const indexOfLastPlace = currentPage * placesPerPage;
  // const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  // const currentPlaces =
  //   loadedPlaces && loadedPlaces.slice(indexOfFirstPlace, indexOfLastPlace);

  // Change the places when the pagination pageNumber clicked
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const closeInfo = () => {
    setShowInfo(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={showInfo}
        fullWidth={true}
        maxWidth='xs'
        keepMounted
        onClose={closeInfo}
        aria-labelledby='customized-dialog-title'
      >
        <div className='modal-info-content'>
          <Typography variant='h6' gutterBottom>
            {userInfo.name && userInfo.name}
          </Typography>{' '}
          <Typography color='textSecondary' gutterBottom>
            {userInfo.age && userInfo.age}{' '}
            {userInfo.gender && `- ${userInfo.gender}`}
          </Typography>
          <Typography variant='body1' gutterBottom>
            {userInfo.interests && userInfo.interests}
          </Typography>
          <Typography variant='body2' gutterBottom>
            {userInfo.biography && userInfo.biography}
          </Typography>
        </div>
      </Dialog>

      <div className='user-detail'>
        <Avatar
          alt='profile'
          src={`${userInfo.image}`}
          className={classes.xxLarge}
        />
        <CardContent className='user-info-content'>
          <Typography
            className='user-info'
            gutterBottom
            variant='h5'
            component='h2'
          >
            {userInfo.name}
          </Typography>
          <Typography>
            <Button onClick={() => setShowInfo(true)}>
              More Info
            </Button>
          </Typography>
          <TravelBucketList />
          <Follower />
        </CardContent>
      </div>

      {loadedPlaces && userInfo && (
        <>
          <div className='user-places-container'>

            <UserPlaceList
              items={loadedPlaces}
              onDeletePlace={placeDeletedHandler}
            />
          </div>
        </>
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
