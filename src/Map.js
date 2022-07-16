import * as React from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import { CircularProgress } from "@mui/material";

const LoadingContainer = (props) => (
  <div className="search-icon">
    {" "}
    <CircularProgress color="inherit" size={60} />
  </div>
);

export class MapContainer extends React.Component {
  render() {
    return (
      <Map
        style={this.props.style}
        google={this.props.google}
        initialCenter={{ lat: this.props.pointB[0], lng: this.props.pointB[1] }}
        zoom={14}
      >
        {this.props.pointA.length === 2 ? (
          <Marker
            onClick={this.onMarkerClick}
            title={"The marker`s title will appear as a tooltip."}
            name={"SOMA"}
            position={{ lat: this.props.pointA[0], lng: this.props.pointA[1] }}
            icon={{
              url: "https://cdn-icons-png.flaticon.com/512/147/147140.png",
              anchor: new window.google.maps.Point(32, 32),
              scaledSize: new window.google.maps.Size(34, 34),
            }}
          />
        ) : null}

        <Marker
          onClick={this.onMarkerClick}
          title={"some other stuff."}
          name={"anothername"}
          position={{ lat: this.props.pointB[0], lng: this.props.pointB[1] }}
        />

        <InfoWindow onClose={this.onInfoWindowClose}>
          <div>
            <h1>{"test"}</h1>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBPiRHFseVnuxByYN4I6LjYGXm0J0af8PE",
  LoadingContainer: LoadingContainer,
})(MapContainer);
