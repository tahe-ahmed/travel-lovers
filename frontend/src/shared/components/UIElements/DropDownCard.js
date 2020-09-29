import React, { useContext } from 'react';
import { AuthContext } from '../../context/auth-context';
import { Link } from 'react-router-dom';
import './DropDownCard.css';

const DropDownCard = () => {

  const auth = useContext(AuthContext);

  return (
    <React.Fragment>
      <div className='dropdown'>
        <ul className='dd-menu'>
          <li onClick={auth.logout}>Sign out</li>
          <li>
            <Link className="dd-link" to={`/user/${auth.userId}`}>Edit your profile</Link>{' '}
          </li>
          <li>
            <Link className="dd-link" to={`/account/${auth.userId}`}>Account Settings</Link>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
};

export default DropDownCard;
