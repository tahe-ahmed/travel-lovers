import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../shared/components/UIElements/Avatar";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./UserInfo.css";

function UserInfo(props) {

  const [loadedUser, setLoadedUser] = useState({});
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${props.creatorId}`
        );
        setLoadedUser(responseData.user);
      } catch (err) { }
    };
    fetchUser();
  }, [sendRequest, props.creatorId]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <Link to={`/${props.creatorId}/places`}>
        <div className="user-avatar">
          <Avatar
            image={loadedUser.image}            // hosting image
            alt={props.name}
            className="user-avatar-img"
          />
          <p className="user-name">{loadedUser.name}</p>
        </div>
      </Link>
    </>
  );
}

export default UserInfo;
