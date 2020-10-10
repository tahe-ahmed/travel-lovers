import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

// import Users from './user/pages/Users';
// import NewPlace from './places/pages/NewPlace';
// import UserPlaces from './places/pages/UserPlaces';
// import UpdatePlace from './places/pages/UpdatePlace';
// import Auth from './user/pages/Auth';
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
//import HomePage from "./places/pages/homepage/HomePage";

const Users = React.lazy(() => import("./user/pages/Users"));
const UpdateUser = React.lazy(() => import("./user/pages/UpdateUser"));
const UserAccount = React.lazy(() => import("./user/pages/UserAccount"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const AllPlaces = React.lazy(() => import("./places/pages/AllPlaces"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const DetailedPlace = React.lazy(() => import("./places/pages/DetailedPlace"));
const BucketListPage = React.lazy(() => import('./places/pages/BucketListPage'));
const HomePage = React.lazy(() => import("./places/pages/homepage/HomePage"));
const ResetPassword = React.lazy(() => import("./user/pages/ResetPassword"));
const Auth = React.lazy(() => import("./user/pages/Auth"));

const App = () => {
  const { token, login, logout, userId, userImage } = useAuth();

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/users" exact>
          <Users />
        </Route>
        <Route path="/user/:userId" exact>
          <UpdateUser />
        </Route>
        <Route path="/account/:userId" exact>
          <UserAccount />
        </Route>
        <Route path="/places" exact>
          <AllPlaces />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/:userId/bucketList" exact>
          <BucketListPage />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Route path="/info/:placeId" exact>
          <DetailedPlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/users" exact>
          <Users />
        </Route>
        <Route path="/reset/:resetToken" exact>
          <ResetPassword />
        </Route>
        <Route path="/places" exact>
          <AllPlaces />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        userImage: userImage,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
