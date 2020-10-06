import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Pagination from "../../shared/components/UIElements/Pagination";

import "./UserPlaces.css";

const UserPlaces = () => {
  const auth = useContext(AuthContext);
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [userInfo, setUserInfo] = useState();
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
      } catch (err) { }
    };
    fetchPlaces();
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
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && userInfo && (
        <div>
          <p className="user-header">
            {auth.userId === userInfo.id ? "My" : `${userInfo.name}'s`} Places
          </p>
          <PlaceList
            items={currentPlaces}
            onDeletePlace={placeDeletedHandler}
          />
        </div>
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
