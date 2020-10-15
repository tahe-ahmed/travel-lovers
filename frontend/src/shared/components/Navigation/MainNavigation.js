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
//import MailIcon from "@material-ui/icons/Mail";
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [isLogin, setIsLogin] = useState(true);
  const [notifiAnchorEl, setNotifiAnchorEl] = useState(null);
  //const { isLoading, error, sendRequest, clearError } = useHttpClient(); //  Line 37:11:  'isLoading' is assigned a value but never used
  const { sendRequest } = useHttpClient();
  const [notifications, setNotifications] = useState();
  const history = useHistory();


  //////// when login fetch the notifications
  useEffect(() => {
    if (auth.isLoggedIn && auth.userId !== false && auth.userId !== null) {
      // fetch notification for auth.userIn
      const fetchNotifications = async () => {
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/notifications/${auth.userId}`
          );
          setNotifications(responseData.notifications);
        } catch (err) { }
      };
      fetchNotifications();
    }
  }, [auth.isLoggedIn, auth.userId]);

  const handleClick = (event) => {
    setNotifiAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setNotifiAnchorEl(null);
  };
  /////// when notification clicked close the list and delete the notification
  const handleNotificationClick = async (pid, notifiID, sender, follow) => {
    setNotifiAnchorEl(null);
    console.log(sender._id, pid, notifiID, follow)
    ////// delete the notification from database and from the local state
    const notifiToUpdate = {
      notifiID: notifiID,
      receiverID: auth.userId,
    };
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/notifications`,
        "PATCH",
        JSON.stringify(notifiToUpdate),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) { }

    /// update the local state
    const filterednotifications = notifications.filter(
      (notifi) => notifi._id !== notifiID
    );
    setNotifications(filterednotifications);
      
    
    if(follow) history.push(`${sender._id}/places`)
    else history.push(`/info/${pid}`);
  };

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

  //////// when login fetch the notifications
  useEffect(() => {
    if (auth.isLoggedIn && auth.userId !== null) {
      // fetch notification for auth.userIn
      const fetchNotifications = async () => {
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/notifications/${auth.userId}`
          );
          setNotifications(responseData.notifications);
        } catch (err) { }
      };
      fetchNotifications();
    }
  }, [auth.isLoggedIn, auth.userId]);

  ////// count the notifications
  const notificationsNumber =
    auth.isLoggedIn && notifications && notifications.length;
    console.log(notifications)

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const logout = () => {
    setIsLogin(false);
    auth.logout();
    history.push("/");
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
        title="PROFILE"
      >
        <span className="material-icons">assignment_ind</span> &ensp; Profile
      </MenuItem>
      <MenuItem
        onClick={handleMenuClose}
        color="inherit"
        component={NavLink}
        to={{
          pathname: `/account/${auth.userId}`,
        }}
        title="MY ACCOUNT"
      >
        <span className="material-icons">vpn_key</span> &ensp; My Account
      </MenuItem>
      <MenuItem title="LOG OUT" onClick={logout}>
        <span className="material-icons">exit_to_app</span> &ensp; Log Out
      </MenuItem>
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
        <div>
          {/* <MenuItem>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <p>Messages</p>
          </MenuItem> */}
          <MenuItem>
            <IconButton aria-label="show 11 new notifications" color="inherit">
              <Badge badgeContent={notificationsNumber} color="secondary">
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
        </div>
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
              <img
                src="https://i.postimg.cc/SQM3CGxw/croped-image-wh.png"
                alt="logo"
              />
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
              title="HOMEPAGE"
            >
              <span className="material-icons">home</span>
            </Button>
            <Button
              color="inherit"
              component={NavLink}
              to={{
                pathname: `/users`,
              }}
              title="ALL USERS"
            >
              <span className="material-icons">group</span>
            </Button>

            <Button
              color="inherit"
              component={NavLink}
              to={{
                pathname: `/places`,
              }}
              title="ALL PLACES"
            >
              <span className="material-icons">collections</span>
            </Button>

            {auth.isLoggedIn && (
              <Button
                color="inherit"
                component={NavLink}
                to={{
                  pathname: `/${auth.userId}/places`,
                }}
                title="MY PLACES"
              >
                <span className="material-icons">person_pin</span>
              </Button>
            )}
            {auth.isLoggedIn && (
              <Button
                color="inherit"
                component={NavLink}
                to={{
                  pathname: `/${auth.userId}/bucketList`,
                }}
                title="BUCKET LIST"
              >
                <span className="material-icons">map</span>
              </Button>
            )}
            {auth.isLoggedIn && (
              <Button
                color="inherit"
                component={NavLink}
                to={{
                  pathname: `/places/new`,
                }}
                title="ADD NEW PLACE"
              >
                <span className="material-icons">add_location_alt</span>
              </Button>
            )}

            {!auth.isLoggedIn && (
              <Button
                color="inherit"
                component={NavLink}
                to={{
                  pathname: `/auth`,
                }}
                title="LOGIN"
              >
                <span className="material-icons">login</span>
              </Button>
            )}
            {auth.isLoggedIn && (
              <React.Fragment>
                {/*  <IconButton aria-label="show 4 new mails" color="inherit">
                  <Badge badgeContent={4} color="secondary">
                    <MailIcon />
                  </Badge>
                </IconButton> */}
                <IconButton
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <Badge badgeContent={notificationsNumber} color="secondary">
                    <NotificationsIcon onClick={handleClick} />
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
                        <div>
                          {notifi.follow ? (
                            <MenuItem
                              onClick={() =>
                                handleNotificationClick(
                                  notifi.place,
                                  notifi._id,
                                  notifi.sender,
                                  notifi.follow
                                )
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
                            started following you
                            </MenuItem>
                          ) : (
                              <MenuItem
                                onClick={() =>
                                  handleNotificationClick(notifi.place, notifi._id, notifi.sender, notifi.follow)
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
                            )}

                          <Divider />
                        </div>
                      ))
                    )}
                </Menu>

                <div className={classes.root}>
                  <Avatar
                    alt="profile"
                    src={auth.userImage} // hosting images
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
                <span className="material-icons">login</span>
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
