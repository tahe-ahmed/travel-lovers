import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {Button,AppBar,Toolbar,IconButton,Typography,InputBase,Badge,MenuItem,Menu}  from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { AuthContext } from '../../context/auth-context';
import useStyles from './MainNavigationStyle';
import Avatar from '@material-ui/core/Avatar';

import './MainNavigation.css';

const MainNavigation = (props) => {
  const auth = useContext(AuthContext);

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

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

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const logout = () => {
    auth.logout();
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={handleMenuClose}
        color='inherit'
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
        color='inherit'
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

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label='show 4 new mails' color='inherit'>
          <Badge badgeContent={4} color='secondary'>
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label='show 11 new notifications' color='inherit'>
          <Badge badgeContent={11} color='secondary'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position='static'>
        <Toolbar>
          <div className={classes.sectionMobile}>
            <IconButton
              edge='start'
              className={classes.menuButton}
              color='inherit'
              aria-label='open drawer'
            >
              <MenuIcon />
            </IconButton>
          </div>
          <Typography className={classes.title} variant='h6' noWrap>
            TRAVEL LOVERS
          </Typography>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Button
              color='inherit'
              component={NavLink}
              to={{
                pathname: `/`,
              }}
            >
              ALL USERS
            </Button>

            <Button
              color='inherit'
              component={NavLink}
              to={{
                pathname: `/places`,
              }}
            >
              ALL PLACES
            </Button>

            {auth.isLoggedIn && (
              <Button
                color='inherit'
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
                color='inherit'
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
                color='inherit'
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
                <IconButton aria-label='show 4 new mails' color='inherit'>
                  <Badge badgeContent={4} color='secondary'>
                    <MailIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  aria-label='show 17 new notifications'
                  color='inherit'
                >
                  <Badge badgeContent={17} color='secondary'>
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <div className={classes.root}>
                  <Avatar
                    alt='Remy Sharp'
                    src={`${process.env.REACT_APP_ASSET_URL}/${auth.userImage}`}
                    aria-controls={menuId}
                    onClick={handleProfileMenuOpen}
                  />
                </div>
              </React.Fragment>
            )}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};

export default MainNavigation;
