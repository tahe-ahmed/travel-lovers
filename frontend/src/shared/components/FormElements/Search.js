import React from "react";
import {Button,AppBar,Toolbar,IconButton,Typography,InputBase,Badge,MenuItem,Menu}  from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import "./Search.css";
import useStyles from '../Navigation/MainNavigationStyle';

const Search = (props) => {

  const classes = useStyles();

  return (
    // <div className="search-bar-container">
    //   <input
    //     placeholder={props.placeHolder}
    //     value={props.value}
    //     type="text"
    //     className="search-bar"
    //     onChange={props.onChangehandler}
    //     autoFocus
    //   />
    // </div>
    <div className="search-bar">
    <div className={classes.search}>
    <div className={classes.searchIcon}>
      <SearchIcon />
    </div>
    <InputBase
      placeholder={props.placeHolder}
      value={props.value}
      onChange={props.onChangehandler}
      classes={{
        root: classes.inputRoot,
        input: classes.inputInput,
      }}
      inputProps={{ 'aria-label': 'search' }}
    />
  </div></div>
  );
};

export default Search;
