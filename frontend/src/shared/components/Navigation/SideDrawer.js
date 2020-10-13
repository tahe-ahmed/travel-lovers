import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  Divider,
  useTheme,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { AuthContext } from "../../context/auth-context";

import useStyles from "../../styles/material-ui-syles";
import Backdrop from "../UIElements/Backdrop";

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
        {open && <Backdrop onClick={handleDrawerClose} />}
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
        >
          <MenuIcon />
        </IconButton>
      </div>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />

        <List>
          <ListItem key="Homepage">
            <Button
              color="inherit"
              component={NavLink}
              to={{
                pathname: `/`,
              }}
              onClick={handleDrawerClose}
              title="HOMEPAGE"
            >
              <span class="material-icons">home</span>
            </Button>
          </ListItem>
          <ListItem key="All Users">
            <Button
              color="inherit"
              component={NavLink}
              to={{
                pathname: `/users`,
              }}
              onClick={handleDrawerClose}
              title="ALL USERS"
            >
              <span class="material-icons">group</span>
            </Button>
          </ListItem>
          <ListItem key="All Places">
            <Button
              color="inherit"
              component={NavLink}
              to={{
                pathname: `/places`,
              }}
              onClick={handleDrawerClose}
              title="ALL PLACES"
            >
              <span class="material-icons">collections</span>
            </Button>
          </ListItem>

          {auth.isLoggedIn && (
            <ListItem key="My Places">
              <Button
                color="inherit"
                component={NavLink}
                to={{
                  pathname: `/${auth.userId}/places`,
                }}
                onClick={handleDrawerClose}
                title="MY PLACES"
              >
                <span class="material-icons">person_pin</span>
              </Button>
            </ListItem>
          )}
          {auth.isLoggedIn && (
            <ListItem>
              <Button
                color="inherit"
                component={NavLink}
                to={{
                  pathname: `/places/new`,
                }}
                onClick={handleDrawerClose}
                title="ADD NEW PLACE"
              >
                <span class="material-icons">add_location_alt</span>
              </Button>
            </ListItem>
          )}
          {auth.isLoggedIn && (
            <ListItem>
              <Button
                color="inherit"
                component={NavLink}
                to={{
                  pathname: `/${auth.userId}/bucketList`,
                }}
                onClick={handleDrawerClose}
                title="BUCKET LIST"
              >
                <span class="material-icons">map</span>
              </Button>
            </ListItem>
          )}
          {!auth.isLoggedIn && (
            <ListItem>
              <Button
                color="inherit"
                component={NavLink}
                to={{
                  pathname: `/auth`,
                }}
                title="LOGIN"
                onClick={handleDrawerClose}
              >
                <span class="material-icons">login</span>
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
