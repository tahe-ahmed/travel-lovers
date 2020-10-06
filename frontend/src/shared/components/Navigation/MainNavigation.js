import React, { useState, useEffect, useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import {
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Badge,
  MenuItem,
  Menu,
} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { AccountCircle } from "@material-ui/icons";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import { AuthContext } from "../../context/auth-context";

import { useHttpClient } from "../../hooks/http-hook";

import useStyles from "../../styles/material-ui-syles";

import SideDrawer from "./SideDrawer";

import "./MainNavigation.css";

const MainNavigation = (props) => {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [isLogin, setIsLogin] = useState(true);

  const [notifiAnchorEl, setNotifiAnchorEl] = React.useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [notifications, setNotifications] = useState();
  const history = useHistory();

  const handleClick = (event) => {
    setNotifiAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setNotifiAnchorEl(null);
  };
  const handleNotificationClick = async (pid, notifiID) => {
    setNotifiAnchorEl(null);
    ////// delete the notification from database and from the local state

    const notifiToUpdate = {
      notifiID: notifiID,
      receiverID: auth.userId,
    };

    console.log(notifications);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/notifications`,
        {
          method: "PATCH",
          body: JSON.stringify(notifiToUpdate),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      const not = await response.json();
      console.log(not);
    } catch (err) {}

    /// update the local state
    const filterednotifications = notifications.filter(
      (notifi) => notifi._id !== notifiID
    );
    setNotifications(filterednotifications);

    history.push(`/info/${pid}`);
  };

  // const [notificationsNumber , setNotificationsNumber] = useState(0);

  // console.log(auth.userId);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  useEffect(() => {
    if (auth.isLoggedIn && auth.userId !== null) {
      // fetch notification for auth.userIn
      const fetchNotifications = async () => {
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/notifications/${auth.userId}`
          );
          console.log(responseData.notifications);
          setNotifications(responseData.notifications);
        } catch (err) {}
      };
      fetchNotifications();
    }
  }, [auth.isLoggedIn, auth.userId]);

  ////// count the notifications
  const notificationsNumber =
    auth.isLoggedIn && notifications && notifications.length;

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const logout = () => {
    setIsLogin(false);
    auth.logout();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={handleMenuClose}
        color="inherit"
        component={NavLink}
        to={{
          pathname: `/user/${auth.userId}`,
        }}
      >
        Profile
      </MenuItem>
      <MenuItem
        onClick={handleMenuClose}
        onClick={handleMenuClose}
        color="inherit"
        component={NavLink}
        to={{
          pathname: `/account/${auth.userId}`,
        }}
      >
        My Account
      </MenuItem>
      <MenuItem onClick={logout}>Sign out</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {auth.isLoggedIn && (
        <>
          <MenuItem>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <p>Messages</p>
          </MenuItem>
          <MenuItem>
            <IconButton aria-label="show 11 new notifications" color="inherit">
              <Badge badgeContent={11} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <p>Profile</p>
          </MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <SideDrawer />
          <Button
            color="inherit"
            component={NavLink}
            to={{
              pathname: `/`,
            }}
          >
            <Typography className={classes.title} variant="h6" noWrap>
              TRAVEL LOVERS{" "}
            </Typography>
          </Button>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Button
              color="inherit"
              component={NavLink}
              to={{
                pathname: `/`,
              }}
            >
              ALL USERS
            </Button>

            <Button
              color="inherit"
              component={NavLink}
              to={{
                pathname: `/places`,
              }}
            >
              ALL PLACES
            </Button>

            {auth.isLoggedIn && (
              <Button
                color="inherit"
                component={NavLink}
                to={{
                  pathname: `/${auth.userId}/places`,
                }}
              >
                MY PLACES
              </Button>
            )}

            {auth.isLoggedIn && (
              <Button
                color="inherit"
                component={NavLink}
                to={{
                  pathname: `/places/new`,
                }}
              >
                ADD PLACE
              </Button>
            )}

            {!auth.isLoggedIn && (
              <Button
                color="inherit"
                component={NavLink}
                to={{
                  pathname: `/auth`,
                }}
              >
                LOGIN
              </Button>
            )}
            {auth.isLoggedIn && (
              <React.Fragment>
                <IconButton aria-label="show 4 new mails" color="inherit">
                  <Badge badgeContent={4} color="secondary">
                    <MailIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <Badge
                    onClick={handleClick}
                    badgeContent={notificationsNumber}
                    color="secondary"
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Menu
                  id="simple-menu"
                  anchorEl={notifiAnchorEl}
                  keepMounted
                  open={Boolean(notifiAnchorEl)}
                  onClose={handleClose}
                >
                  {notificationsNumber === 0 ? (
                    <MenuItem>
                      <span className="notifications-name">
                        no notifications
                      </span>
                    </MenuItem>
                  ) : (
                    notifications &&
                    notifications.map((notifi) => (
                      <>
                        <MenuItem
                          onClick={() =>
                            handleNotificationClick(notifi.place, notifi._id)
                          }
                        >
                          <ListItemAvatar>
                            <Avatar
                              alt="profile"
                              src={notifi.sender.image}
                              aria-controls={menuId}
                              className="notification-image"
                            />
                          </ListItemAvatar>
                          <span className="notifications-name">
                            {notifi.sender.name}
                          </span>
                          has mentioned you in a place
                        </MenuItem>
                        <Divider />
                      </>
                    ))
                  )}
                </Menu>

                <div className={classes.root}>
                  <Avatar
                    alt="profile"
                    src={`${process.env.REACT_APP_ASSET_URL}/${auth.userImage}`}
                    aria-controls={menuId}
                    onClick={handleProfileMenuOpen}
                    className={classes.large}
                  />
                </div>
              </React.Fragment>
            )}
          </div>
          <div className={classes.sectionMobile}>
            {auth.isLoggedIn && (
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            )}

            {!auth.isLoggedIn && (
              <Button
                color="inherit"
                component={NavLink}
                to={{
                  pathname: `/auth`,
                }}
              >
                LOGIN
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>

      {renderMobileMenu}
      {isLogin && renderMenu}
    </div>
  );
};

export default MainNavigation;
