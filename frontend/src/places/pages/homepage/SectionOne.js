import React, { useContext } from 'react';

import Button from '../../../shared/components/FormElements/Button';
import { AuthContext } from '../../../shared/context/auth-context';
import video1 from './video.mp4';
import video2 from './video2.mp4';
import classes from './BackgroundVideo.module.css';
import './SectionOne.css';


const currentUsers = [
  {
    key: "1",
    id: "11",
    image: "https://ca-times.brightspotcdn.com/dims4/default/d9ce15f/2147483647/strip/true/crop/4500x3002+0+0/resize/840x560!/quality/90/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F19%2Ffc%2F6950640940628bc775fff5add3de%2F472828-la-en-charles-randolph-jay-roach-364.JPG",
    name: "Ersin",
    comment: " This is the best app ever, I've planned my trips based on other users experience, and already love it"
  },
  {
    key: "2",
    id: "22",
    image: "https://www.vdhrecruitment.nl/wp-content/uploads/2018/06/BBC.jpg",
    name: "Carin",
    comment: "What makes me so happy is sharing my places with other users and friends, and give them an overview of my favorite places."
  }
];



function SectionOne() {
  const auth = useContext(AuthContext);
  return (
    <>
      <div className={classes.Container} >
        <video autoPlay="autoplay" loop="loop" muted className={classes.Video} >
          <source src={auth.isLoggedIn ? video2 : video1} type="video/mp4" /> Your browser does not support the video tag.
        </video>

        <div className={classes.Content}>
          <div className={classes.SubContent} >
            {!auth.isLoggedIn ? (
              <>
                <h1 className="banner-header">JOIN OUR JOURNEY</h1>
                <p> <span role="img" aria-label="star">🌟 </span> Create an account and start your dream trip. <span role="img" aria-label="star">🌟 </span></p>
                <Button href="/auth">SIGN UP</Button>
              </>
            ) : (
                <>
                  <h1 className="banner-header">WELCOME TRAVEL LOVER!</h1>
                  <p><span role="img" aria-label="star">🌟 </span> Let's explore new places or share your experience.<span role="img" aria-label="star">🌟 </span></p>
                  <Button href="/places/new">ADD A NEW PLACE</Button>
                  <Button href="/places">EXPLORE NEW PLACES</Button>
                </>
              )}
          </div>
        </div>
      </div>
      {!auth.isLoggedIn ? (
        <div className="section-one-list">
          {currentUsers.map(user => (
            <div className="section-one-user-item" >
              <div className="section-one-user-item__image">
                <img src={user.image} alt={user.name} />
              </div>
              <div className="section-one-user-item__info">
                <h2>{user.name}</h2>
                <p>❝ {user.comment} ❞</p>
              </div>
            </div>
          ))}
        </div>) : (
          <div className="section-one-content">
            <div className="section-one-rainbow">
              <h3 className="section-one-rainbow-text">
                ❝ The world is a book and those who do not travel read only one page. ❞
            </h3>
            </div>
          </div>
        )}
    </>
  );
}

export default SectionOne;