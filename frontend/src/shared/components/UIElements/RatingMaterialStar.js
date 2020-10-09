import React, { useState, useContext, useEffect } from "react";
import uuid from "uuid/dist/v4"; // for rate components key-name
import LoadingSpinner from "./LoadingSpinner";
import ErrorModal from "./ErrorModal";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";

import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Box from '@material-ui/core/Box';


export default function RatingMaterialStar(props) {

  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [ratingAverage, setRatingAverage] = useState(props.rateAvg); // for value of ReactStars component
  const [ratingLength, setRatingLength] = useState(props.rateLength); // for total ratings

  useEffect(() => {                                         // when user rate,rate average will update
    setRatingAverage(ratingAverage);
  }, [ratingAverage]);

  const ratingChangedHandler = async rating => {                // onChange handler of ReactStars component
    console.log(rating);
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

      <Rating
        name={uuid()}
        size={"small"}
        readOnly={!auth.isLoggedIn}
        value={ratingAverage}
        precision={0.5}
        emptyIcon={<StarBorderIcon fontSize="inherit" color='action' />}
        onChange={(event, newValue) => {
          ratingChangedHandler(newValue);
        }}
        
      />
         <Box ml={2} className="rating-total"> {ratingLength > 1 ? `(${ratingLength} Ratings)` : `(${ratingLength} Rating)`}</Box>
        
    </>
  );
}
