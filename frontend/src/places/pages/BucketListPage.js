import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import BucketItem from "../components/BucketItem";
import BucketMap from "../components/BucketMap";
import { usePosition } from "../../shared/hooks/position-hook";
import "./BucketListPage.css";

const BucketListPage = () => {
  const [places, setPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { token, userId } = useContext(AuthContext);

  const {
    latitude,
    longitude,
    timestamp,
    accuracy,
  } = usePosition(); // for getting users location

  useEffect(() => {
    const fetchBucketListPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/bucketlist/${userId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + token,
          }
        );
        setPlaces(responseData.userBucketList);
      } catch (err) {
        console.log("Could not get all user places!", err);
      }
    };
    fetchBucketListPlaces();
  }, [sendRequest, userId, token]);

  const deleteBucketItem = (deletedPlaceId) => {
    setPlaces((prevPlace) =>
      prevPlace.filter((place) => place._id !== deletedPlaceId)
    );
  };

  return (
    <div className="bucket-page-container">
      {isLoading && <LoadingSpinner asOverlay />}
      {error && <ErrorModal error={error} onClear={clearError} />}
      <div className="bucket-list">
        <h2>My Travel Bucket List</h2>
        {(!places || places.length === 0) && !isLoading && (
          <Card>
            <h3>
              Your travel bucket list is empty.
              <br />
              Would you like to add any places to your travel bucket list?
            </h3>
            <Button to="/places" inverse>Back to All Places</Button>{/* Es back to places for adding list */}
          </Card>
        )}
        <ul>
          {!isLoading &&
            places &&
            places.map((place) => (
              <BucketItem
                key={place._id}
                placeData={place}
                deleteOnClick={deleteBucketItem}
              />
            ))}
        </ul>
      </div>
      { !isLoading &&
        places &&
        <div className='bucketmap-container'>
          <BucketMap placesData={places} latitude={latitude} longitude={longitude} />
        </div>
      }
    </div>
  );
};

export default BucketListPage;
