import React, { useState, useEffect, useContext, useRef } from "react";
import { NavLink, useHistory } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { AuthContext } from "../../../shared/context/auth-context";

const useStyles = makeStyles({
  label_for_card_icon: {
    position: "absolute",
    top: "10px",
    left: "10px",
  },
  label_for_card_header: {
    position: "absolute",
    top: "10px",
    right: "10px",
    color: "white",
    size: ".4rem",
    fontWeight: "500",
    padding: "6px 10px",
    backgroundColor: "#3F51B5",
    borderRadius: "10px"
  },
});

function SectionTwo() {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const classes = useStyles();
  const gallery = useRef();
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
          id: place._id,
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
      alert("You should sign up first to explore the places!");
    }
    const currentIndex = gallery.current.getCurrentIndex();
    history.push(`/info/${loadedPlaces[currentIndex].id}`);
  };

  return (
    <div>
      <div className="card-hp">
        <Card
          className={classes.root_for_secttionTwo_card}
          className="card-items"
        >
          <CardActionArea
            to={{
              pathname: auth.isLoggedIn ? `/users` : "/auth",
            }}
            component={NavLink}
          >
            <CardMedia
              component="img"
              alt="FIND PASSIONATE TRAVELLERS"
              height="250"
              image="https://i.postimg.cc/x8cV1RPg/111.jpg"
              title="FIND OTHER TRAVELLERS"
            />
            <CardContent>
              <Typography className={`${classes.label_for_card_icon} title-card`}>
                <i className="fas fa-search"></i>
              </Typography>
              <Typography className={`${classes.label_for_card_header} title-card`}>
                FIND OTHER TRAVELLERS
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                You can find millions of travel lovers all over the world. They
                are here, they want to get connected.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        {/* TWO CARD */}
        <Card
          className={classes.root_for_secttionTwo_card}
          className="card-items"
        >
          <CardActionArea
            to={{
              pathname: auth.isLoggedIn ? `/places/new` : "/auth",
            }}
            component={NavLink}
          >
            <CardMedia
              component="img"
              alt="SHARE YOUR EXPERIENCE"
              height="250"
              image="https://i.postimg.cc/KzpCwTyT/333.jpg"
              title="SHARE YOUR EXPERIENCE"
            />
            <CardContent>
              <Typography className={`${classes.label_for_card_icon} title-card`}>
                <i className="fas fa-share"></i>
              </Typography>
              <Typography className={`${classes.label_for_card_header} title-card`}>
                SHARE EXPERIENCE
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Spread your travel love all over the world. Comment and rate
                others' experience.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        {/* TREE CARD */}
        <Card
          className={classes.root_for_secttionTwo_card}
          className="card-items"
        >
          <CardActionArea
            to={{
              pathname: auth.isLoggedIn ? `users` : "/auth",
            }}
            component={NavLink}
          >
            <CardMedia
              component="img"
              alt="PLAN YOUR FUTURE TRIPS"
              height="250"
              image="https://i.postimg.cc/brKWNjrN/pexels-element-digital-1051075.jpg"
              title="PLAN YOUR FUTURE TRIPS"
            />
            <CardContent>
              <Typography className={`${classes.label_for_card_icon} title-card`}>
                <i className="fas fa-map-marked-alt"></i>
              </Typography>
              <Typography className={`${classes.label_for_card_header} title-card`}>
                PLAN YOUR FUTURE TRIPS
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Travel broadens the mind. Don't waste your time to think of
                where to go. All world is in here.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
      <div className="image-gallery-container">
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
