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
import RatingMaterialStar from '../../shared/components/UIElements/RatingMaterialStar'; // star-rating material

import './UserPlaces.css';
import {
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Typography,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles({
//   root: {
//     maxWidth: 340,
//   },
//   media: {
//     width:240,
//     height: 240,
//   },
// });

const UserPlaces = () => {
  const classes = useStyles();

  const auth = useContext(AuthContext);
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [userInfo, setUserInfo] = useState({});
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [placesPerPage] = useState(3);

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
  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces =
    loadedPlaces && loadedPlaces.slice(indexOfFirstPlace, indexOfLastPlace);

  // Change the places when the pagination pageNumber clicked
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const closeInfo = () => {
    setShowInfo(false);
  };

  return (
    <React.Fragment>
      {/* <ErrorModal error={error} onClear={clearError} /> */}

      <Modal
        header={`More about ${userInfo.name}`}
        className="modal-user-info"
        show={showInfo}
        onCancel={closeInfo}
      >
        <Typography
          className="user-info"
          gutterBottom
          variant="h5"
          component="h2"
        >
          Name: {userInfo.name ? userInfo.name : 'Not added yet'}
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          className="user-info"
          // color="textSecondary"
        >
          Age: {userInfo.age ? userInfo.age : 'Not added yet'}
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          className="user-info"
          // color="textSecondary"
        >
          interests: {userInfo.interests ? userInfo.interests : 'Not added yet'}
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          className="user-info"
          // color="textSecondary"
        >
          Bio: {userInfo.biography ? userInfo.biography : 'Not added yet'}
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          className="user-info"
          // color="textSecondary"
        >
          Gender: {userInfo.gender ? userInfo.gender : 'Not added yet'}
        </Typography>
      </Modal>

      <div className="user-detail">
        <Avatar
          alt="profile"
          src={`${process.env.REACT_APP_ASSET_URL}/${userInfo.image}`}
          // aria-controls={menuId}
          // onClick={handleProfileMenuOpen}
          className={classes.xxLarge}
        />
        <CardContent>
          <Typography
            className="user-info"
            gutterBottom
            variant="h5"
            component="h2"
          >
            {userInfo.name}
          </Typography>
          {/* <Typography className='user-info' color='textSecondary'>
              {userInfo.age}
            </Typography> */}
          <Typography>
            <Button inverse onClick={() => setShowInfo(true)}>
              more
            </Button>
          </Typography>
          <Follower />
        </CardContent>
      </div>

      {loadedPlaces && userInfo && (
        <>
          {/* <p className='user-header'>
            {auth.userId === userInfo.id ? 'My' : `${userInfo.name}'s`} Places
          </p> */}
          <div className="user-places-container">
            {loadedPlaces.map((place) => {
              return (
                <Card className="user-place-item">
                  <CardMedia
                    className={`${classes.media} parent`}
                    image={`${process.env.REACT_APP_ASSET_URL}/${place.image}`}
                    title="Contemplative Reptile"
                  >
                    {/* <div className='hover-content'>
                      <h2>{place.title}</h2>
                      <h3>{place.address}</h3>
                      <p>{place.description}</p>
                    </div> */}
                  </CardMedia>
                </Card>
              );
            })}{' '}
            <PlaceList
              items={loadedPlaces}
              onDeletePlace={placeDeletedHandler}
            />
          </div>
        </>
      )}

      {/* {loadedPlaces && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={placesPerPage}
          totalItems={loadedPlaces.length}
          paginate={paginate}
        />
      )} */}
    </React.Fragment>
  );
};

export default UserPlaces;