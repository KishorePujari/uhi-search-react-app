import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";

import "./App.css";

const noDoctorsCard = (
  <Fade style={{ transformOrigin: "0 0 0" }} {...{ timeout: 500 }} in>
    <Card
      raised={true}
      sx={{ width: "80%", paddingBottom: "0.3em", borderRadius: "20px" }}
    >
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          No Doctors Present
        </Typography>
      </CardContent>
    </Card>
  </Fade>
);

function DoctorCard(props) {
  if (props.status === "No Doctors") return noDoctorsCard;

  const { name, image, rating, method } = props.docDetails;
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
              Rating: {rating}/5
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mode of Consultation: {method}
            </Typography>
          </CardContent>
        </Card>
      </Fade>
      <br />
    </>
  );
}

export default DoctorCard;
