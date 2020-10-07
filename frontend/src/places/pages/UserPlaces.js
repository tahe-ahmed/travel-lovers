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
  const [userInfo, setUserInfo] = useState({});
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [placesPerPage] = useState(3);

  const userId = useParams().userId;

  useEffect(() => {
    console.log('efffffff');
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
        console.log('fetch info',responseData.user);
        console.log('fetch info',responseData.user.image);

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
  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces =
    loadedPlaces && loadedPlaces.slice(indexOfFirstPlace, indexOfLastPlace);

  // Change the places when the pagination pageNumber clicked
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <React.Fragment>
      {/* <ErrorModal error={error} onClear={clearError} /> */}

      {
        <div className='user-detail'>
          <Avatar
            alt='profile'
            src={`${process.env.REACT_APP_ASSET_URL}/${userInfo.image}`}
            // aria-controls={menuId}
            // onClick={handleProfileMenuOpen}
            className={classes.xxLarge}
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='h2'>
              {userInfo.name}
            </Typography>
            <Typography className={classes.pos} color='textSecondary'>
              {userInfo.age}
            </Typography>
            <Follower />
       
          </CardContent>
    
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
