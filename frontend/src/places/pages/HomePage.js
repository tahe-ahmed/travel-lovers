import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './HomePage.css';

function HomePage() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places`
        );
        const aa = responseData.places.map((place) => ({
          original: `${process.env.REACT_APP_ASSET_URL}/${place.image}`,
          tumbnail: `${process.env.REACT_APP_ASSET_URL}/${place.image}`,
          description: place.address,
          originalAlt: place.title,
          originalTitle: place.title,
        }));
        setLoadedPlaces(aa);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest]);
  return (
    <>
      <div className="header">
        <div className="info">
          <h1 className="animated-text">EXPLORE. DREAM. DISCOVER.</h1>
        </div>
      </div>
      <section className="content">
        <div className="rainbow">
          <h1 className="rainbow-text">
            The world is a book and those <br /> who do not travel read only one
            page.
          </h1>
        </div>
      </section>
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
            go. All world is in here.{' '}
          </p>
        </Card>
      </div>
      {loadedPlaces && (
        <ImageGallery
          items={loadedPlaces}
          showThumbnails={false}
          autoPlay={true}
          slideInterval={2500}
          onErrorImageURL="https://i.postimg.cc/Hs32TQT5/amsterda.jpg"
        />
      )}

      <Card className="banner">
        {!auth.isLoggedIn ? (
          <>
            <h1 className="banner-header">JOIN OUR JOURNEY</h1>
            <p>
              &#x1F31F; Create an account and start your dream trip. &#x1F31F;
            </p>
            <Button inverse href="/auth">
              SIGN UP
            </Button>
          </>
        ) : (
          <>
            <h1 className="banner-header">WELCOME TRAVEL LOVER!</h1>
            <p>
              &#x1F31F; Let's explore new places or share your experience.
              &#x1F31F;
            </p>
            <Button inverse>
              <NavLink to="/places/new" className='add-places-link'>ADD PLACE</NavLink>
            </Button>
            <Button inverse href="/places">
              EXPLORE NEW PLACES
            </Button>
          </>
        )}
      </Card>

      <div className="banner-bottom">
        Made with <span className="heart">❤</span> in Amsterdam. 2020 /
        class27@HYF
      </div>
    </>
  );
}

export default HomePage;
