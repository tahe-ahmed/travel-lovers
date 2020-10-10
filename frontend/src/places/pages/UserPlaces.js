import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import UserPlaceList from '../components/UserPlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Modal from '../../shared/components/UIElements/Modal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Pagination from '../../shared/components/UIElements/Pagination';
import useStyles from '../../shared/styles/material-ui-syles';
import Follower from '../../user/components/Follower';
import RatingMaterialStar from '../../shared/components/UIElements/RatingMaterialStar'; // star-rating material
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { useTheme } from '@material-ui/core/styles';

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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
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
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
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

      {/* <Modal
        header={`More about ${userInfo.name}`}
        className="modal-user-info"
        show={showInfo}
        onCancel={closeInfo}
      >
        <Typography>
          {userInfo.name && `Name: ${userInfo.name}` }
        </Typography>
        <Typography>
           {userInfo.age  && `Age:${userInfo.age}` }
        </Typography>
        <Typography>
          {userInfo.interests && `Interests ${userInfo.interests}` }
        </Typography>
        <Typography>

         {userInfo.biography && `Bio: ${userInfo.biography}` }
        </Typography>
        <Typography>
          {userInfo.gender && `Gender: ${userInfo.gender}`}
        </Typography>
      </Modal> */}
      <Dialog
        open={showInfo}
        fullWidth='xs'
        maxWidth='xs'
        keepMounted
        onClose={closeInfo}
        aria-labelledby='customized-dialog-title'
      >
        {/* <DialogTitle id='customized-dialog-title'>
            Info
          </DialogTitle> */}
  <div className="modal-info-content">
            <Typography variant="h6" gutterBottom >{userInfo.name && userInfo.name}</Typography>{' '}
         
            <Typography color="textSecondary" gutterBottom>{userInfo.age && userInfo.age} {userInfo.gender && `- ${userInfo.gender}`}</Typography>
       
            <Typography variant="body1" gutterBottom>
              {userInfo.interests && userInfo.interests}
            </Typography>
    
            <Typography variant="body2" gutterBottom>
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
              <MoreHorizIcon />
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
