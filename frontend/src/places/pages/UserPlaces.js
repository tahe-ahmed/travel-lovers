import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Pagination from '../../shared/components/UIElements/Pagination';

import './UserPlaces.css';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';

const UserPlaces = () => {
  const auth = useContext(AuthContext);
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [userInfo, setUserInfo] = useState();
  const [userDetail, setUserDetail] = useState({});
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [placesPerPage] = useState(3);

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
        setUserInfo(responseData.userWithPlaces);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  useEffect(() => {
    const fetchUserInfoDetails = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`
        );
        console.log(responseData);
        setUserDetail({
          name: responseData.user.name,
          age: responseData.user.age,
          bio: responseData.user.biography,
          gender: responseData.user.gender,
          interests: responseData.user.interests,
          image: responseData.user.image,
        });
      } catch (err) {}
    };
    fetchUserInfoDetails();
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

  const followHandler = () => {};

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <Card className="card user-detail">
          <div className="image-user">
            <img src={userDetail.image} alt={userDetail.name} />
            <Button
              color="primary"
              variant="contained"
              className="button button--default follow"
              onClick={followHandler}
            >
              Follow
            </Button>
          </div>
          <div className="user-info">
            <strong>Name: </strong>
            {userDetail.name}
            <br />
            <strong>Age: </strong>
            {userDetail.age ? userDetail.age : 'not added yet'}
            <br />
            <strong>Gender: </strong>
            {userDetail.gender ? userDetail.gender : 'not added yet'}
            <br />
            <strong>Biography: </strong>
            {userDetail.bio ? userDetail.bio : 'not added yet'}
            <br />
            <strong>interests: </strong>
            {userDetail.interests ? userDetail.interests : 'not added yet'}
          </div>
        </Card>
      )}
      {!isLoading && loadedPlaces && userInfo && (
        <>
          <p className="user-header">
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
