import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../../context/auth-context';
import Avatar from '../UIElements/Avatar';
import DropDownCard from '../UIElements/DropDownCard';

import './UserProfile.css'

const UserProfile = (props) => {
  const auth = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const drop = useRef(null);

  function handleClick(e) {
    if (!e.target.closest(`.${drop.current.className}`) && open) {
      setOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });

  return (
    <React.Fragment>

      <div className='user-profile' ref={drop}>
        <Avatar
          image={`${process.env.REACT_APP_ASSET_URL}/${auth.userImage}`}
          alt={auth.userImage}
          onClick={() => setOpen((open) => !open)}
        />
        {open && <DropDownCard  />}
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
