import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../shared/components/UIElements/Card';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import UserInfo from '../../user/components/UserInfo';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import RatingMaterialStar from '../../shared/components/UIElements/RatingMaterialStar'; // star-rating material 
import { Button } from '@material-ui/core';

import './PlaceItem.css';

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isInBucketList, setIsInBucketList] = useState();   // check place is in My Buckets 

  useEffect(() => {                                         // to check if the place in users bucket list
    if (props.bucketAdderList && props.bucketAdderList.includes(auth.userId)) {
      setIsInBucketList(true);
    } else {
      setIsInBucketList(false);
    }
  }, [])

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  const showDeleteWarningHandler = () => setShowConfirmModal(true);
  const cancelDeleteHandler = () => setShowConfirmModal(false);


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
    } catch (err) { }
  };
  const addPlaceToBucketListHandler = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/bucketlist/${props.id}`,
        "PATCH",
        JSON.stringify({
          bucketerId: auth.userId
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`
        }
      );
      setIsInBucketList(true);
    } catch (err) { }
  }
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={<Button variant="contained" color="secondary" onClick={closeMapHandler}>CLOSE</Button>}
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
            <Button variant="contained" color="primary" onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button variant="contained" color="secondary" onClick={confirmDeleteHandler}>
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
        <Card className='place-item__content'>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className='place-item__image'>
            <img
              src={props.image}                   // hosting image
              alt={props.title}
            />
            <div className="star-rating">                         {/*   for star rating */}
              <RatingMaterialStar
                placeId={props.id}
                raterIds={props.rate.raterIds}
                rateLength={props.rate.length}
                rateAvg={props.rateAvg}
                creatorId={props.creatorId}
              />
            </div>
            <UserInfo creatorId={props.creatorId} />
          </div>
          <Link to={`/info/${props.id}`}>
            <div className="place-item__info">
              <h2>{props.title}</h2>
              <h3>{props.address}</h3>
              <p>{props.description}</p>
              <div className="bucker-count">
                <span>Listed by</span>{props.bucketAdderList ? props.bucketAdderList.length : "0"}</div>{/* Es length error solved */}
            </div>
          </Link>
          <div className="place-item__actions">
            <Button variant="outlined" color="primary" onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && (
              <Button variant="contained" color="primary" to={`/places/${props.id}`}>EDIT</Button>
            )}

            {auth.userId === props.creatorId && (
              <Button variant="contained" color="secondary" onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
            {auth.isLoggedIn && auth.userId !== props.creatorId &&
              (isInBucketList ?
                <Button variant="contained" color="secondary" disabled={isInBucketList}>
                  IN MY BUCKETS
                </Button>
                :
                <Button variant="contained" color="primary" onClick={addPlaceToBucketListHandler}>
                  ADD BUCKET LIST
                </Button>
              )}
          </div>
        </Card>
      </li>
    </React.Fragment >
  );
};

export default PlaceItem;