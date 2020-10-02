import React, { useState, useContext, useEffect } from "react";
import ReactStars from "react-rating-stars-component"; // Third party library A simple star rating component for your React projects
import uuid from "uuid/dist/v4"; // for rate components key
import LoadingSpinner from "./LoadingSpinner";
import ErrorModal from "./ErrorModal";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";


function RatingPlaces(props) {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [ratingAverage, setRatingAverage] = useState(props.rateAvg); // for value of ReactStars component
  const [ratingLength, setRatingLength] = useState(props.rateLength); // for total ratings

  useEffect(() => {                                         // when user rate,rate average will update
    setRatingAverage(ratingAverage);
  }, [ratingAverage]);

  const ratingChangedHandler = async rating => {                // onChange handler of ReactStars component
    if (auth.isLoggedIn) {                                      // only auth user can edit rate
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/rate/${props.placeId}`,
          "PATCH",
          JSON.stringify({
            raterId: auth.userId,
            raterRating: rating,
          }),
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`
          }
        );
        setRatingAverage(response.rateAvg); // refresh rate average for new rate
        setRatingLength(response.rateLength); // refresh ratings for new rate
      } catch (err) { }
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      <p className="rating-total">
        <span>{ratingLength} </span>{ratingLength > 1 ? ` Ratings` : ` Rating`}
      </p>
      <ReactStars
        edit={auth.isLoggedIn}
        key={uuid()}
        a11y={true}
        value={ratingAverage}
        count={5}
        onChange={ratingChangedHandler}
        size={15}
        isHalf={false}
        emptyIcon={<i className='far fa-star'></i>}
        halfIcon={<i className='fa fa-star-half-alt'></i>}
        filledIcon={<i className='fa fa-star'></i>}
        color={"#7d7f83"}
        activeColor={"#ffc107"}
      />
    </>
  );
}

export default RatingPlaces;
