/* 

// !!!!!!! Please look at MainNavigation.js

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          HOMEPAGE
        </NavLink>
      </li>
      <li>
        <NavLink to="/users" exact>
          ALL USERS
        </NavLink>
      </li>
      <li>
        <NavLink to="/places" exact>
          ALL PLACES
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li >
          <UserProfile/>
        </li>
      )}
    </ul>
  );
};





// import React, { useContext } from 'react';
// import { NavLink } from 'react-router-dom';

// import { AuthContext } from '../../context/auth-context';
// import './NavLinks.css';
// import UserProfile from '../Navigation/UserProfile';

// const NavLinks = props => {
//   const auth = useContext(AuthContext);

//   return (
//     <ul className="nav-links">
//       <li>
//         <NavLink to="/" exact>
//           ALL USERS
//         </NavLink>
//       </li>
//       <li>
//         <NavLink to="/places" exact>
//           ALL PLACES
//         </NavLink>
//       </li>
//       {auth.isLoggedIn && (
//         <li>
//           <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
//         </li>
//       )}
//       {auth.isLoggedIn && (
//         <li>
//           <NavLink to="/places/new">ADD PLACE</NavLink>
//         </li>
//       )}
//       {!auth.isLoggedIn && (
//         <li>
//           <NavLink to="/auth">AUTHENTICATE</NavLink>
//         </li>
//       )}
//       {auth.isLoggedIn && (
//         <li >
//           <UserProfile/>
//         </li>
//       )}
//     </ul>
//   );
// };

// export default NavLinks;
 */