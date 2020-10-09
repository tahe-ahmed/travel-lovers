import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import UserPlaceItem from './UserPlaceItem';
import Button from '../../shared/components/FormElements/Button';
import './UserPlaceList.css';

const PlaceList = props => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="user-place-list">
      {props.items.map(place => (
        <UserPlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
          rate={place.rate}   // for star rating
          rateAvg={place.rateAvg}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
