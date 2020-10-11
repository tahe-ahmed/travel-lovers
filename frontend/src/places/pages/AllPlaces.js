import React, { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import PlaceList from "../components/PlaceList";
import Search from "../../shared/components/FormElements/Search";
import Pagination from "../../shared/components/UIElements/Pagination";


const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [placesPerPage] = useState(4);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places`
        );
        setLoadedPlaces(responseData.places);
        setFilteredPlaces(responseData.places);
      } catch (err) { }
    };
    fetchPlaces();
  }, [sendRequest]);

  const handleOnChange = (e) => {
    let searchQuery = e.target.value.toLowerCase();
    setSearchInputValue(searchQuery);
    if (searchQuery.length >= 2) {
      let filterPlaces = loadedPlaces.filter((place) => {
        let searchValuePlace = place.address.toLowerCase();

        return searchValuePlace.indexOf(searchQuery) !== -1;
      });
      setFilteredPlaces(filterPlaces);
    } else {
      setFilteredPlaces(loadedPlaces);
    }
  };

  // function accepts obj of places and sort it alphabetically
  const getSortByName = (obj) => {
    obj.sort((first, second) => {
      if (first.title.toLowerCase() < second.title.toLowerCase()) return -1;
      if (first.title.toLowerCase() > second.title.toLowerCase()) return 1;
      return 0;
    });
  };
  // sort the the loaded
  useEffect(() => {
    if (loadedPlaces) getSortByName(loadedPlaces);
  }, [loadedPlaces]);

  // Get current places
  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces =
    loadedPlaces &&
    filteredPlaces &&
    filteredPlaces.slice(indexOfFirstPlace, indexOfLastPlace);

  // Change the places when the pagination pageNumber clicked
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Search
        placeHolder="Search for places"
        value={searchInputValue}
        onChangehandler={handleOnChange}
      />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {loadedPlaces && filteredPlaces && <PlaceList items={currentPlaces} />}
      {loadedPlaces && filteredPlaces && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={placesPerPage}
          totalItems={filteredPlaces.length}
          paginate={paginate}
        />
      )}
    </React.Fragment>
  );
};

export default Users;
