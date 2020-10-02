import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import './UserItem.css';

import useStyles from '../../shared/styles/material-ui-syles';
 

const UserItem = (props) => {
  const classes = useStyles();

  return (
    <li className='user-item'>
      <Card>
        <CardActionArea>
          <CardContent>
            <Link to={`/${props.id}/places`}>
              <Avatar
                className={classes.large}
                src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
                alt={props.name}
              />

              <div className='card-content'>
                <Typography
                  gutterBottom
                  variant='h5'
                  component='h2'
                  color='primary'
                >
                  {props.name}
                </Typography>
                <Typography variant='subtitle1' color='textSecondary'>
                  {props.placeCount}{' '}
                  {props.placeCount === 1 ? 'Place' : 'Places'}
                </Typography>
              </div>
            </Link>
          </CardContent>
        </CardActionArea>
      </Card>
    </li>
  );
};
{
  /* =======
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import "./UserItem.css";

const UserItem = (props) => {
  const [imageURL, setImageURL] = useState(props.image);
  // check image url props if its data come from google/facebook API or uploads/images
  useEffect(() => {
    if (imageURL.startsWith("https://") || imageURL.startsWith("http://")) {
      //if (props.signType !== 'normal') { // for bug
      setImageURL(imageURL);
    } else {
      setImageURL(`${process.env.REACT_APP_ASSET_URL}/${props.image}`);
    }
  }, [imageURL]);

  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            <Avatar image={imageURL} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? "Place" : "Places"}
            </h3>
          </div>
        </Link>
>>>>>>> forgot-password-option
      </Card>
    </li>
  );
}; */
}

export default UserItem;
