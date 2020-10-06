import React, { useContext } from 'react';
import {  NavLink } from 'react-router-dom';
import {
  Button,
  IconButton,Drawer,List,ListItem,Divider,useTheme
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { AuthContext } from '../../context/auth-context';


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

          {auth.isLoggedIn && (
            <ListItem key='My Places'>
              <Button
                color='inherit'
                component={NavLink}
                to={{
                  pathname: `/${auth.userId}/places`,
                }}
              >
                MY PLACES
              </Button>
            </ListItem>
          )}
          {auth.isLoggedIn && (
            <ListItem>
              <Button
                color='inherit'
                component={NavLink}
                to={{
                  pathname: `/places/new`,
                }}
              >
                ADD PLACE
              </Button>
            </ListItem>
          )}
        </List>
        <Divider />
      </Drawer>
    </React.Fragment>
  );
};

export default SideDrawer;
