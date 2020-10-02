import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './SideDrawer.css';

import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';

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
import { AuthContext } from '../../context/auth-context';

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
import useStyles from '../../styles/material-ui-syles';

const SideDrawer = (props) => {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  // const content = (
  //   <CSSTransition
  //     in={props.show}
  //     timeout={200}
  //     classNames="slide-in-left"
  //     mountOnEnter
  //     unmountOnExit
  //   >
  //     <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>
  //   </CSSTransition>
  // );

  // return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
  return (
    <React.Fragment>
      <div className={classes.sectionMobile}>
        <IconButton
          edge='start'
          className={classes.menuButton}
          color='inherit'
          aria-label='open drawer'
          onClick={handleDrawerOpen}
        >
          <MenuIcon />
        </IconButton>
      </div>
      <Drawer
        className={classes.drawer}
        variant='persistent'
        anchor='left'
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        {!auth.isLoggedIn && (
          <List>
            <ListItem key='All Users'>
              <Button
                color='inherit'
                component={NavLink}
                to={{
                  pathname: `/`,
                }}
              >
                All Users
              </Button>
            </ListItem>

            <ListItem key='All Places'>
              <Button
                color='inherit'
                component={NavLink}
                to={{
                  pathname: `/places`,
                }}
              >
                All Places
              </Button>
            </ListItem>
          </List>
        )}

        <Divider />
      </Drawer>
    </React.Fragment>
  );
};

export default SideDrawer;
