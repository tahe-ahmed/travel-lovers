import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import {
  Avatar,
  Typography,
  Button,
  List,
  ListItem,
  DialogTitle,
  Dialog,
} from '@material-ui/core';


const TravelBucketList = () => {
  const { sendRequest } = useHttpClient();
  const [isShowedBucketList, setIsShowedBucketList] = useState(false);
  const [placesInBucketList, setPlacesInBucketList] = useState();
  const auth = useContext(AuthContext);
  const userId = useParams().userId;

  useEffect(() => {
    const fetchUserBucketList = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/bucketlist/${userId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setPlacesInBucketList(responseData.userBucketList);
      } catch (err) {
        console.log("Could not get all user places!", err);
      }
    };
    fetchUserBucketList();
  }, [sendRequest, userId]);


  const closeShowBucketListHandler = () => setIsShowedBucketList(false); // close the list

  return (
    <>
      <Dialog
        open={isShowedBucketList}
        fullWidth={true}
        maxWidth='xs'
        keepMounted
        onClose={closeShowBucketListHandler}
        aria-labelledby='customized-dialog-title'
      >
        <DialogTitle id='customized-dialog-title' className="dialog-modal-title" >
          {placesInBucketList && placesInBucketList.length} Places in Bucket List
        </DialogTitle>

        <List>
          {placesInBucketList &&
            placesInBucketList.map((item, index) => {
              return (
                <ListItem key={index} autoFocus button className='list-item-modal'>
                  <div className='list-item-info'>
                    <Avatar alt='profile' src={`${item.image}`} />
                    <Typography className='follow-name'>{item.title}</Typography>
                  </div>
                  <div>
                    <Button variant='contained' color='secondary'>
                      <Link to={`/info/${item._id}`}>
                        Detail
                      </Link>
                    </Button>
                  </div>
                </ListItem>
              );
            })}
        </List>
      </Dialog>

      {/* Open And Close button bucket list dialog */}
      <div className='bucketlist-section'>
        {placesInBucketList && placesInBucketList.length > 0 && (
          <Typography>
            <Button onClick={() => setIsShowedBucketList((isShowedBucketList) => !isShowedBucketList)}>
              {placesInBucketList && placesInBucketList.length} Places in Bucket List
              </Button>
          </Typography>
        )}
      </div>
    </>
  );
};

export default TravelBucketList;