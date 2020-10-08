import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import UserInfo from '../../user/components/UserInfo';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import RatingMaterialStar from '../../shared/components/UIElements/RatingMaterialStar'; // star-rating material
import { makeStyles } from '@material-ui/core/styles';
import {Card,Button,CardHeader,CardMedia,CardContent,CardActions,Avatar,IconButton,Typography} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './PlaceItem.css';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 350,
  },
  media: {
    height: 400,
    paddingTop: '56.25%', // 16:9
  },
  // expand: {
  //   transform: 'rotate(0deg)',
  //   marginLeft: 'auto',
  //   transition: theme.transitions.create('transform', {
  //     duration: theme.transitions.duration.shortest,
  //   }),
  // },
  avatar: {
    backgroundColor: red[500],
  },
}));

const PlaceItem = (props) => {
  const classes = useStyles();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
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
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
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
      {/* <li className='place-item'>
        <Card className='place-item__content'>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className='place-item__image'>
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.title}
            />
            <div className="star-rating">                         {/*   for star rating */}
      {/* <RatingMaterialStar
                placeId={props.id}
                raterIds={props.rate.raterIds}
                rateLength={props.rate.length}
                rateAvg={props.rateAvg}
                creatorId={props.creatorId}
              />
            </div>
            <UserInfo creatorId={props.creatorId} />
          </div> */}
      {/* <Link to={`/info/${props.id}`}>
            <div className="place-item__info">
              <h2>{props.title}</h2>
              <h3>{props.address}</h3>
              <p>{props.description}</p>
            </div>
          </Link>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}

            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card> */}
      {/* </li> */}
      <li className='place-item'>
        <Card className={`${classes.root} place-item-container`}>
          <CardMedia
            className={classes.media}
            image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
            title='Paella dish'
          >

<div className="item-info-part">
          <CardHeader
            avatar={
              <Avatar
                aria-label='recipe'
                className={classes.avatar}
                alt={props.title}
                src={`${process.env.REACT_APP_ASSET_URL}/${auth.userImage}`}
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
          <CardActions >
         
            <Button  variant="outlined" color="primary" onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && (
              <Button  variant="contained" color="primary" to={`/places/${props.id}`}>EDIT</Button>
            )}

            {auth.userId === props.creatorId && (
              <Button variant="contained" color="secondary" onClick={showDeleteWarningHandler}>
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

export default PlaceItem;
