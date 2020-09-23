import React from "react";

import "./Pagination.css";

const Pagination = (props) => {
  // get the number of pages
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(props.totalItems / props.itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination-nav">
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${
              number === props.currentPage ? "active" : "nonactive"
            }`}
          >
            <a
              onClick={() => props.paginate(number)}
              href={`#${number}`}
              className="page-link"
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
