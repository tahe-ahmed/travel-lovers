import React, { useState, useEffect, useContext, useRef } from "react";
import { NavLink, useHistory } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
/* import Card from "../../../shared/components/UIElements/Card"; */
import { useHttpClient } from "../../../shared/hooks/http-hook";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { AuthContext } from "../../../shared/context/auth-context";

function SectionTwo() {
  const auth = useContext(AuthContext);
  const history = useHistory()
  const gallery = useRef()
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
        const mapPlaces = responseData.places.map((place) => ({
          original: place.image, // hosting image
          tumbnail: place.image,
          description: place.address,
          originalAlt: place.title,
          originalTitle: place.description,
          id: place._id
        }));
        if (responseData.places && responseData.places.length > 0) {
          setLoadedPlaces(mapPlaces);
        }
      } catch (err) { }
    };
    fetchPlaces();
  }, [sendRequest]);

  const imageGalleryClickHandler = () => {
    if (!auth.isLoggedIn) {
      alert('You should sign up first to explore the places!')

    }
    const currentIndex = gallery.current.getCurrentIndex();
    history.push(`/info/${loadedPlaces[currentIndex].id}`)
  }

  return (
    <div>
      <div className="card-hp">
        <Card className='card-items' variant="outlined">
          <CardContent>
            <Typography
              gutterBottom
            >
              <i className="fas fa-search"></i>
            </Typography>
            <Typography variant="h6" component="h2">
              FIND PASSIONATE TRAVELLERS
            </Typography>

            <Typography variant="body2" component="p" className='card-description'>
              You can find millions of travel lovers all over the world. They
              are here, they want to get connected.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" href="/users" color="secondary">
              See travel lovers
              </Button>
          </CardActions>
        </Card>
        <Card className='card-items' variant="outlined">
          <CardContent>
            <Typography
              gutterBottom
            >
              <i className="fas fa-share"></i>
            </Typography>
            <Typography variant="h5" component="h2">
              SHARE YOUR EXPERIENCE
            </Typography>

            <Typography variant="body2" component="p" className='card-description'>
              Let others light their candles. Spread your travel love all over
              the world. Comment and rate others' experience.
            </Typography>
          </CardContent>
          <CardActions>
            {auth.isLoggedIn ? (
              <Button
                size="small"
                to={{
                  pathname: `/places/new`,
                }}
                color="secondary"
                component={NavLink}
              >
                Share a place
              </Button>
            ) : (
                <Button size="small" href="/auth" color="secondary">
                  Start to share
                </Button>
              )}
          </CardActions>
        </Card>
        <Card className='card-items' variant="outlined">
          <CardContent>
            <Typography
              gutterBottom
            >
              <i className="fas fa-map-marked-alt"></i>
            </Typography>
            <Typography variant="h5" component="h2">
              PLAN YOUR FUTURE TRIPS
            </Typography>

            <Typography variant="body2" component="p" className='card-description'>
              Travel broadens the mind. Don't waste your time to think of where
              to go. All world is in here.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" href="/places" color="secondary">
              See others' places
              </Button>
          </CardActions>
        </Card>
      </div>
      <div className='image-gallery-container'>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && <LoadingSpinner asOverlay />}
        {loadedPlaces && (
          <ImageGallery
            ref={gallery}
            items={loadedPlaces}
            showThumbnails={false}
            autoPlay={true}
            showFullscreenButton={false}
            slideInterval={5000}
            onErrorImageURL="https://i.postimg.cc/Hs32TQT5/amsterda.jpg"
            onClick={imageGalleryClickHandler}
          />
        )}
      </div>
    </div>
  );
}

export default SectionTwo;

/*  <Card className="card-items">
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
                  </Card> */