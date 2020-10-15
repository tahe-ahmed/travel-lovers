import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 440,
    position: "relative",
    borderRadius: "20px"
  },
  label: {
    position: "absolute",
    top: "10px",
    left: "100px",
  },
});

export default function ImgMediaCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height="240"
          image="https://trekroute.com/wp-content/uploads/2015/08/How-to-Travel.jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            You can find millions of travel lovers all over the world. They
            are here, they want to get connected.
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.label}>
        <Button size="small" href="/users" color="secondary">
          <Typography>
            <i className="fas fa-search"></i>
          </Typography>
        </Button>
      </CardActions>
    </Card>
  );
}
