import React from "react";

import "./HomePage.css";

function HomePage() {
  return (
    <div className="homepage">
      <div>
        <img src="https://i.postimg.cc/q78y7JjC/sadad.png" alt="logo" />
      </div>

      <h1>welcome to TravelLovers</h1>
      <h2>
        A place where you can share and connect with other passionate travellers
      </h2>

      <div className="points">
        <div className="point">
          <i class="fas fa-search-location"></i>
          <p>Find people and communicate with each other</p>
        </div>
        <div className="point">
          <i class="fas fa-comments"></i>
          <p>Share your experience with your friends</p>
        </div>

        <div className="point">
          <i class="fas fa-map-marked"></i>
          <p>Plan your future trips</p>
        </div>
      </div>

      <div className="signup">
        <h3>You can sign up here</h3>
        <a href="/auth">Sign up page</a>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />

      <div>SLIDES / PLACES WITH USERS</div>
      <div>OTHER STAFF</div>
    </div>
  );
}

export default HomePage;
