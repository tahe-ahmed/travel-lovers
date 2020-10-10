import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserPlaceList from '../components/UserPlaceList';
import { useHttpClient } from '../../shared/hooks/http-hook';
import useStyles from '../../shared/styles/material-ui-syles';
import Follower from '../../user/components/Follower';
import Dialog from '@material-ui/core/Dialog';
import {
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Typography,
  Button,
} from '@material-ui/core';
import './UserPlaces.css';

const UserPlaces = () => {
  const classes = useStyles();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [userInfo, setUserInfo] = useState({});
  const { sendRequest } = useHttpClient();
  // const [currentPage, setCurrentPage] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  // const [placesPerPage] = useState(3);
  
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };

    const fetchUserInfo = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`
        );
        setUserInfo(responseData.user);
      } catch (err) {}
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
        fullWidth='xs'
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
            <Button inverse onClick={() => setShowInfo(true)}>
              More Info
              {/* <MoreHorizIcon /> */}
            </Button>
          </Typography>
          <Follower />
        </CardContent>
      </div>

      {loadedPlaces && userInfo && (
        <>
          <div className='user-places-container'>
            {loadedPlaces.map((place) => {
              return (
                <Card className='user-place-item'>
                  <CardMedia
                    className={`${classes.media} parent`}
                    image={`${place.image}`}
                    title='Contemplative Reptile'
                  ></CardMedia>
                </Card>
              );
            })}{' '}
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
