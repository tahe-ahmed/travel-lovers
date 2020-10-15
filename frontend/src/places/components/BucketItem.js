import React, { useContext } from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Button from '../../shared/components/FormElements/Button';
import './BucketItem.css';



const BucketItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { token, userId } = useContext(AuthContext);

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
      <li className='bucketList-item'>
        <div className='bucketList-item__image'>
          <img src={props.placeData.image} alt={props.placeData.title} />
        </div>

        <div className='bucketList-item__info'>
          <h4>{props.placeData.title}</h4>
        </div>
        <div className='bucketList-item__actions'>
          {/* Es changed detail buttons event according to feedback */}
          <Button inverse to={`/info/${props.placeData._id}`}> Detail</Button>
          <Button onClick={deleteBucketItemHandler} danger>delete</Button>
        </div>
      </li>
    </React.Fragment >
  );
};

export default BucketItem;
