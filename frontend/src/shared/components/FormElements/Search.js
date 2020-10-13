import React from "react";
import {InputBase}  from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import useStyles from '../../../shared/styles/material-ui-syles';
import "./Search.css";


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
    <div className="search-bar-container">
    <div className={`${classes.search} search-cnt`} >
    <div className= {`${classes.searchIcon} searchicon`}>
      <SearchIcon />
    </div>
    <InputBase
      className ="input-searchbar-cnt"
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