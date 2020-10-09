import React, { useEffect, useContext } from "react";

import Button from "@material-ui/core/Button";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth-context";

function SectionTree() {
  const auth = useContext(AuthContext);
  //when scrolled down, animation iterates on the text
  useEffect(() => {
    const callback = function (entries) {
      entries.forEach((entry) => {
        entry.target.classList.toggle("animated-text");
      });
    };

    const observer = new IntersectionObserver(callback);

    const targets = document.querySelectorAll(".explore");
    targets.forEach(function (target) {
      observer.observe(target);
    });
  }, []);
  return (
    <div>
      <div className="section-tree">
        <div className="info">
          <h1 className="animated-text explore">EXPLORE. DREAM. DISCOVER.</h1>
        </div>
        {!auth.isLoggedIn ? (
          <div>
            <Button
              variant="contained"
              color="secondary"
              href="/auth"
              size="large"
            >
              SIGN UP
                </Button>
          </div>
        ) : (
            <div>

              <Button
                variant="contained"
                color="secondary"
                href="/places"
                size="large"
                className="button-section-one"
              >
                EXPLORE NEW PLACES
                </Button>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                component={NavLink}
                to={{
                  pathname: `/places/new`,
                }}
              >
                ADD PLACE
                </Button>
            </div>
          )}
      </div>
      <div className="section-tree-bottom">
        Made with <span className="heart">❤</span> in Amsterdam. 2020
        /class27@HYF
      </div>
    </div>
  );
}

export default SectionTree;
