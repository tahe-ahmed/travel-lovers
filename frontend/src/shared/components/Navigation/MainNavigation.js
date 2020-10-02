import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  MenuItem,
  Menu,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { AuthContext } from '../../context/auth-context';
import Avatar from '@material-ui/core/Avatar';

import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';

import useStyles from '../../styles/material-ui-syles';

import './MainNavigation.css';
import SideDrawer from './SideDrawer';

const MainNavigation = (props) => {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [isLogin, setIsLogin] = useState(true);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
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

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const logout = () => {
    setIsLogin(false);
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
          <SideDrawer />
          <Button
            color='inherit'
            component={NavLink}
            to={{
              pathname: `/`,
            }}
          >
            <Typography className={classes.title} variant='h6' noWrap>
              TRAVEL LOVERS{' '}
            </Typography>
          </Button>

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
                    alt='profile'
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
      {isLogin && renderMenu}
    </div>
  );
};

export default MainNavigation;
