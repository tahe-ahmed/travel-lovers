import React, { useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Search from "../../shared/components/FormElements/Search";
import Pagination from "../../shared/components/UIElements/Pagination";

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const [filteredUsers, setFilteredUsers] = useState();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(4);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users`
        );

        setLoadedUsers(responseData.users);
        setFilteredUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  const handleOnChange = (e) => {
    let searchQuery = e.target.value.toLowerCase();
    setSearchInputValue(searchQuery);
    let filterUsers = loadedUsers.filter((user) => {
      let searchValueName = user.name.toLowerCase();
      let searchValueEmail = user.email.toLowerCase();
      return (
        searchValueName.indexOf(searchQuery) !== -1 ||
        searchValueEmail.indexOf(searchQuery) !== -1
      );
    });
    setFilteredUsers(filterUsers);
  };

  // function accepts obj of users and sort it based on the users' count of places
  const getSortByPlacesNumber = (obj) => {
    obj.sort((first, second) => {
      if (first.places.length < second.places.length) return 1;
      if (first.places.length > second.places.length) return -1;
      return 0;
    });
  };
  // sort the the loaded
  useEffect(() => {
    if (loadedUsers) getSortByPlacesNumber(loadedUsers);
  }, [loadedUsers]);

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers =
    filteredUsers && filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && (
        <Search
          placeHolder="Search for users by names or emails"
          value={searchInputValue}
          onChangehandler={handleOnChange}
        />
      )}
      {!isLoading && loadedUsers && filteredUsers && (
        <UsersList items={currentUsers} />
      )}
      {loadedUsers && filteredUsers && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={usersPerPage}
          totalItems={filteredUsers.length}
          paginate={paginate}
        />
      )}
    </React.Fragment>
  );
};

export default Users;
