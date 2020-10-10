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
                src={props.image}    // hosting image
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


export default UserItem;
