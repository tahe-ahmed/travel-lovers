import React from "react";

import "./Search.css";

const Search = (props) => {
  return (
    <div className="search-bar-container">
      <input
        placeholder={props.placeHolder}
        value={props.value}
        type="text"
        className="search-bar"
        onChange={props.onChangehandler}
      />
    </div>
  );
};

export default Search;
