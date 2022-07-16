import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";

import "./App.css";

function LocCard(props) {
  const { name, distance, fee, lat, long, doctors } = props.locDetails;
  const latNum = Number(lat);
  const longNum = Number(long);
  let distanceKm = distance / 1000;
  distanceKm = distanceKm.toFixed(2);
  return (
    <>
      <Fade style={{ transformOrigin: "0 0 0" }} {...{ timeout: 500 }} in>
        <Card
          raised={true}
          sx={{ width: "80%", paddingBottom: "0.3em", borderRadius: "20px" }}
        >
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {distanceKm}km ₹{fee}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              onClick={() => {
                props.setMapDisplay([latNum, longNum]);
              }}
              size="small"
            >
              Location
            </Button>
            <Button
              onClick={() => {
                props.setDocDisplay(doctors ? doctors : []);
              }}
              size="small"
            >
              View Doctors
            </Button>
          </CardActions>
        </Card>
      </Fade>
      <br />
    </>
  );
}

export default LocCard;
