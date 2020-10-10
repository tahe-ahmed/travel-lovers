import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import RatingMaterialStar from '../../shared/components/UIElements/RatingMaterialStar'; // star-rating material
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import {
  Card,
  Button,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import DeleteIcon from '@material-ui/icons/Delete';
import './UserPlaceItem.css';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 350,
  },
  media: {
    height: 420,
    paddingTop: '56.25%', // 16:9
  },
  avatar: {
    backgroundColor: red[500],
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const UserPlaceItem = (props) => {
  const classes = useStyles();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [loadedUser, setLoadedUser] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${props.creatorId}`
        );
        setLoadedUser(responseData.user);
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, props.creatorId]);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={
          <Button variant='contained' color='primary' onClick={closeMapHandler}>
            CLOSE
          </Button>
        }
      >
        <div className='map-container'>
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header='Are you sure?'
        footerClass='place-item__modal-actions'
        footer={
          <React.Fragment>
            <Button
              variant='contained'
              color='primary'
              onClick={cancelDeleteHandler}
            >
              CANCEL
            </Button>
            <Button
              variant='contained'
              color='secondary'
              className={classes.button}
              startIcon={<DeleteIcon />}
              onClick={confirmDeleteHandler}
            >
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>

      <li className='place-item'>
        <Card className={`${classes.root} place-item-container`}>
          <CardMedia
            className={classes.media}
            image={`${props.image}`}
            title='Paella dish'
          >
            <div className='item-info-part'>
            <Link to={`/info/${props.id}`}>
              <CardHeader
                className={classes.root}
                avatar={
                  <Avatar
                    aria-label='recipe'
                    className={classes.avatar}
                    alt={props.title}
                    src={`${loadedUser.image}`}
                  />
                }
                action={
                  <IconButton aria-label='add to favorites'>
                    <FavoriteIcon />
                  </IconButton>
                }
                title={props.title}
                subheader={props.address}
              />
              </Link>
              <div className='item-rating'>
                <RatingMaterialStar
                  placeId={props.id}
                  raterIds={props.rate.raterIds}
                  rateLength={props.rate.length}
                  rateAvg={props.rateAvg}
                  creatorId={props.creatorId}
                />
              </div>
              <CardContent>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {props.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={openMapHandler}
                >
                  VIEW ON MAP
                </Button>
                {auth.userId === props.creatorId && (
                  <Button
                    variant='contained'
                    color='primary'
                    to={`/places/${props.id}`}
                  >
                    EDIT
                  </Button>
                )}

                {auth.userId === props.creatorId && (
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={showDeleteWarningHandler}
                    className={classes.button}
                    startIcon={<DeleteIcon />}
                  >
                    DELETE
                  </Button>
                )}
              </CardActions>
            </div>
          </CardMedia>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default UserPlaceItem;
