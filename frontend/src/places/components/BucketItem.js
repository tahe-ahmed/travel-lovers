import React, { useState, useContext } from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import RatingMaterialStar from '../../shared/components/UIElements/RatingMaterialStar';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import './BucketItem.css';



const BucketItem = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { token, userId } = useContext(AuthContext);

  const openDetailsHandler = () => setShowDetails(true);
  const closeDetailsHandler = () => setShowDetails(false);


  const deleteBucketItemHandler = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/${userId}/bucketlist/${props.placeData._id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + token,
        }
      );
      props.deleteOnClick(props.placeData._id);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <Modal
        show={showDetails}
        onCancel={closeDetailsHandler}
        header={`Details of ${props.placeData.title}`}
        footerClass='bucketList-detail__modal-actions'
        footer={
          <React.Fragment>
            <Button onClick={closeDetailsHandler} inverse>
              Cancel
            </Button>
          </React.Fragment>
        }
      >
        <Card className='bucketList-detail__content'>
          <div className='bucketList-detail__image'>
            <img src={props.placeData.image} alt={props.placeData.title} />
          </div>
          <div className='bucketList-detail__info'>
            <h2>{props.placeData.title}</h2>
            <h3>{props.placeData.address}</h3>
            <h3>{props.placeData.description}</h3>
          </div>
          <div className="bucketList-star-rating">                         {/*   for star rating */}
            <RatingMaterialStar
              placeId={props.placeData._id}
              raterIds={props.placeData.rate.raterIds}
              rateLength={props.placeData.rate.length}
              rateAvg={props.placeData.rateAvg}
              creatorId={props.placeData.creatorId}
            />
          </div>
        </Card>
      </Modal>


      <li className='bucketList-item'>
        <div className='bucketList-item__image'>
          <img src={props.placeData.image} alt={props.placeData.title} />
        </div>

        <div className='bucketList-item__info'>
          <h4>{props.placeData.title}</h4>
        </div>

        <div className='bucketList-item__actions'>
          <Button onClick={openDetailsHandler} inverse>detail</Button>
          <Button onClick={deleteBucketItemHandler} danger>delete</Button>
        </div>
      </li>
    </React.Fragment>
  );
};

export default BucketItem;
