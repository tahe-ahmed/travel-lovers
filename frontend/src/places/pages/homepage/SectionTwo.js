import React, { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import Card from "../../../shared/components/UIElements/Card";
import { useHttpClient } from "../../../shared/hooks/http-hook";

function SectionTwo() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState([
    // initial image if there is no places in app db
    {
      original: "https://i.postimg.cc/Hs32TQT5/amsterda.jpg",
      tumbnail: "https://i.postimg.cc/Hs32TQT5/amsterda.jpg",
      description: "Amsterdam",
      originalAlt: "Amsterdam",
      originalTitle: "Amsterdam",
    },
  ]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places`
        );
        console.log(responseData);

        const mapPlaces = responseData.places.map((place) => ({
          original: `${process.env.REACT_APP_ASSET_URL}/${place.image}`,
          tumbnail: `${process.env.REACT_APP_ASSET_URL}/${place.image}`,
          description: place.address,
          originalAlt: place.title,
          originalTitle: place.description,
        }));
        if (responseData.places && responseData.places.length > 0) {
    
          setLoadedPlaces(mapPlaces);
        }
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest]);

  return (
    <>
      <div className="card-hp">
        <Card className="card-items">
          <i className="fas fa-search"></i>
          <h3 className="card-text">FIND PASSIONATE TRAVELLERS</h3>
          <p className="card-description">
            You can find millions of travel lovers all over the world. They are
            here, they want to get connected.
          </p>
        </Card>
        <Card className="card-items">
          <i className="fas fa-share"></i>
          <h3 className="card-text">SHARE YOUR EXPERIENCE</h3>
          <p className="card-description">
            Let others light their candles. Spread your travel love all over the
            world. Comment and rate others' experience.
          </p>
        </Card>
        <Card className="card-items">
          <i className="fas fa-map-marked-alt"></i>
          <h3 className="card-text">PLAN YOUR FUTURE TRIPS</h3>
          <p className="card-description">
            Travel broadens the mind. Don't waste your time to think of where to
            go. All world is in here.{" "}
          </p>
        </Card>
      </div>
      <div>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && <LoadingSpinner asOverlay />}
        {loadedPlaces && (
          <ImageGallery
            items={loadedPlaces}
            showThumbnails={false}
            autoPlay={true}
            slideInterval={2500}
            onErrorImageURL="https://i.postimg.cc/Hs32TQT5/amsterda.jpg"
          />
        )}
      </div>
    </>
  );
}

export default SectionTwo;
