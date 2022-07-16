/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { alpha, styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Autocomplete from "@mui/material/Autocomplete";
import { Paper } from "@mui/material";
import { IconButton, CircularProgress } from "@mui/material";
// import CircularProgress from "@mui/material/CircularProgress";
import { InputAdornment } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import debounce from "lodash.debounce";
import { format } from "date-fns";
import { makeStyles } from "@material-ui/core/styles";

import SearchIcon from "@mui/icons-material/Search";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import Fade from "@mui/material/Fade";
import LocCard from "./LocCard";
import DocCard from "./DoctorCard";
import Map from "./Map";

// import {MuiThemeProvider} from "@material-ui/core/styles";
import { useState, useCallback, useRef, useEffect } from "react";

import "./App.css";

const theme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#ffffff",
    },
    secondary: {
      main: "#11cb5f",
    },
    text: {
      primary: "#ffffff",
      secondary: "#ffffff",
    },
  },
});

const useStyles = makeStyles({
  option: {
    color: "black",
  },
});

const notSearchedPlaceholder = (
  <div className="search-icon">
    <div className="search-column">
      <div>
        <TravelExploreIcon className="svg_icons" color="action" size={70} />
      </div>
      <div className="no-search-text-class">
        Please search using the field above
      </div>
    </div>
  </div>
);

const fadeNotSearchedPH = (
  <Fade style={{ transformOrigin: "0 0 0" }} {...{ timeout: 1500 }} in>
    {notSearchedPlaceholder}
  </Fade>
);

const progressLoader = (
  <div className="search-icon">
    <CircularProgress color="inherit" size={60} />
  </div>
);

const autoSuggestAxios = async (value) => {
  const result = await axios({
    url: "https://intelli-search-csh.herokuapp.com/autopredict",
    method: "post",
    data: { text_type: "search", text: value },
    headers: {
      "X-Api-Key": "intelli-search-csh",
    },
  });
  return result;
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     if (value === "cardiologist")
  //       resolve({
  //         data: {
  //           Status: "Success",
  //           result_array: ["Cardiologist Near Me", "Cardiologist"],
  //         },
  //       });
  //     else
  //       resolve({
  //         data: { Status: "Success", result_array: [] },
  //       });
  //   }, 1000);
  // });
};

const apiCall = async (value) => {
  try {
    const result = await autoSuggestAxios(value);
    if (result?.data?.predicted_words && result.data.Status === "Success")
      return result.data.predicted_words;
  } catch (error) {
    return [];
  }
};

const autoCorrectAxios = async (value) => {
  const result = await axios({
    url: "https://intelli-search-csh.herokuapp.com/autocorrect",
    method: "post",
    data: { search_text: value },
    headers: {
      "X-Api-Key": "intelli-search-csh",
    },
  });
  return result;
};

const autoCorrectApi = async (value, setCorrectText) => {
  try {
    const result = await autoCorrectAxios(value);
    if (
      result?.data?.corrected_search_text &&
      result.data.Status === "Success" &&
      result.data.corrected_search_text !== value
    ) {
      const text = result.data.corrected_search_text;
      setCorrectText(text);
      setEvent(text);
    } else {
      setCorrectText("");
    }
  } catch (error) {
    console.log(error);
  }
};

const getCoordinates = () => {
  return new Promise((resolve, reject) => {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        resolve([-1, -1]);
      }
    );
  });
};

const getEntities = async (value) => {
  try {
    const result = await axios({
      url: "https://intelli-search-csh.herokuapp.com/extractEntities",
      method: "post",
      data: { query: value },
      headers: {
        "X-Api-Key": "intelli-search-csh",
      },
    });
    return result.data;
  } catch (error) {
    console.log(error);
    return { Status: "Failure" };
  }
};

const searchApiBody = {
  lat: "13.114472695217751",
  long: "77.61845205365857",
  locationFlag: "1",
  priceFlag: 1,
  ratingFlag: "1",
  speciality: "cardiologist",
  method: "1",
};

const getApiBody = (entityResp, coordinates) => {
  const apiBody = { ...searchApiBody };
  if (
    entityResp.Status === "Success" &&
    Object.keys(entityResp.entities).length > 0 &&
    entityResp.entities.specialty
  ) {
    apiBody.specialty = entityResp.entities.specialty;
    apiBody.specialty = apiBody.specialty.toLowerCase();
  }
  apiBody.lat = coordinates[0];
  apiBody.long = coordinates[1];
  return apiBody;
};

const getLocationList = async (apiBody) => {
  const result = await axios({
    url: "https://uhi-hrp.herokuapp.com/search",
    method: "post",
    data: apiBody,
    // {
    //   lat: "13.114472695217751",
    //   long: "77.61845205365857",
    //   locationFlag: "1",
    //   priceFlag: 1,
    //   ratingFlag: "1",
    //   speciality: "cardiologist",
    //   method: "1",
    // },
  });
  return result.data;
};

const searchApi = async (value, setCurrentLoc) => {
  try {
    const entityResp = await getEntities(value);
    console.log(entityResp);
    const coordinates = await getCoordinates();
    setCurrentLoc(coordinates);
    const apiBody = getApiBody(entityResp, coordinates);
    console.log(apiBody);
    const locationList = await getLocationList(apiBody);
    // console.log(locationList);
    console.log(locationList);
    return locationList;
  } catch (error) {
    return [];
  }
};

const setEvent = (value) => {
  const input = document.querySelector("#search-input");
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  ).set;
  nativeInputValueSetter.call(input, value);
  const ev = new window.Event("input", {
    bubbles: true,
  });
  input.dispatchEvent(ev);
  document.querySelector("#search-input").focus();
};

const CustomPaper = (props) => {
  return (
    <Paper
      elevation={8}
      style={{
        width: "90%",
        margin: "auto",
        borderRadius: "10px",
      }}
      {...props}
    />
  );
};

const autoCorrectText = (correctText) =>
  correctText !== "" ? (
    <Fade in>
      <span>
        Text has been Autocorrected
        {/* Autocorrected to
        <button
          // style={{ background: "none", border: "none", color: "blue" }}
          className="suggestion-button"
        >
          {correctText}
        </button> */}
      </span>
    </Fade>
  ) : null;

const displayAllDoctors = (docDisplay) => {
  if (docDisplay.length === 0)
    return (
      <div className="locationCards">
        <DocCard status="No Doctors" />
      </div>
    );

  return (
    <div className="locationCards">
      {docDisplay.map((doc) => (
        <DocCard docDetails={doc} />
      ))}
    </div>
  );
};

function App() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [apiResult, setApiResult] = useState([]);
  const [correctText, setCorrectText] = useState("");
  const [mapDisplay, setMapDisplay] = useState(false);
  const [docDisplay, setDocDisplay] = useState(false);
  const [currentLoc, setCurrentLoc] = useState([]);

  const inputRef = useRef(null);

  const locationCards = (locArray) => {
    return (
      <div className="locationCards">
        {locArray.map((loc) => (
          <LocCard
            locDetails={loc}
            setMapDisplay={setMapDisplay}
            setDocDisplay={setDocDisplay}
          />
        ))}
      </div>
    );
  };

  // React.useEffect(() => {
  //   async function makeAPIcall() {
  //     try {
  //       const result = await axios({
  //         url: "https://intelli-search-csh.herokuapp.com/autocorrect",
  //         method: "post",
  //         data: { search_text: "cardilogist" },
  // headers: {
  //   "X-Api-Key": "intelli-search-csh",
  // },
  //       });
  //       console.log(result.data);
  //       console.log("here");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   makeAPIcall();
  // });

  const debouncedSave = useCallback(
    debounce(async (e) => {
      setLoading(true);
      if (e?.nativeEvent?.isTrusted) {
        const isChanged = await autoCorrectApi(e.target.value, setCorrectText);
        if (isChanged) return;
      }
      const list = await apiCall(e.target.value);
      setOptions(list);
      setLoading(false);
    }, 1000),
    [] // will be created only once initially
  );

  const inputChanged = (e) => {
    setOptions([]);
    if (!e.target.value) {
      setCorrectText("");
      setLoading(false);
    } else debouncedSave(e);
  };

  const searchClicked = async () => {
    setApiResult([]);
    if (!document.querySelector("#search-input")?.value) {
      setApiResult([]);
      setSearched(false);
      return;
    }
    setSearched(true);
    setSearchLoading(true);
    let result = null;
    if (document.querySelector("#search-input")?.value)
      result = await searchApi(
        document.querySelector("#search-input")?.value,
        setCurrentLoc
      );
    console.log(result);
    setSearchLoading(false);
    setApiResult(result);
  };
  const styles = useStyles();

  return (
    <div className="background-div">
      {!mapDisplay && !docDisplay ? (
        <div>
          <div className="text-div">
            <Fade in>
              <span className="date">
                {format(new Date(), "EEEE, dd MMMM")}
              </span>
            </Fade>

            <Fade
              style={{ transformOrigin: "0 0 0" }}
              {...{ timeout: 1000 }}
              in
            >
              <h2 style={{ marginTop: "-0.1em", color: "white" }}>
                Hi, Sheldon
              </h2>
            </Fade>
          </div>
          <div className="textInputStyle">
            <div className="suggestion-div">{autoCorrectText(correctText)}</div>
            <ThemeProvider theme={theme}>
              <Fade
                style={{ transformOrigin: "0 0 0" }}
                {...{ timeout: 1500 }}
                in
              >
                <Autocomplete
                  id="search-input"
                  disableClearable
                  freeSolo
                  options={options}
                  filterOptions={(x) => x}
                  classes={{
                    option: styles.option,
                  }}
                  PaperComponent={CustomPaper}
                  onChange={(e) => {
                    setCorrectText("");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search"
                      onChange={inputChanged}
                      className="inputRounded"
                      ref={inputRef}
                      color="primary"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <InputAdornment position="end">
                            {loading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            <IconButton onClick={searchClicked}>
                              <SearchIcon color="primary" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Fade>
            </ThemeProvider>
          </div>
        </div>
      ) : null}

      {!mapDisplay && !docDisplay ? (
        <div
          className="search-contents-div"
          // hidden
        >
          {searchLoading ? progressLoader : null}
          {apiResult.length > 0 ? (
            <div className="">{locationCards(apiResult)}</div>
          ) : null}
          {!searched ? fadeNotSearchedPH : null}
        </div>
      ) : null}

      {mapDisplay && !docDisplay ? (
        <div>
          <div style={{ padding: "2%" }}>
            <a
              href="#"
              onClick={() => {
                setMapDisplay(false);
                setCorrectText("");
              }}
              className="previous round"
            >
              &#8249;
            </a>
          </div>
          <div>
            <Map
              style={{ borderRadius: "25px", height: "90%" }}
              pointA={currentLoc}
              pointB={mapDisplay}
            />
          </div>
        </div>
      ) : null}

      {!mapDisplay && docDisplay ? (
        <div>
          <div style={{ padding: "2%" }}>
            <a
              href="#"
              onClick={() => {
                setDocDisplay(false);
                setCorrectText("");
              }}
              className="previous round"
            >
              &#8249;
            </a>
          </div>
          <div>{displayAllDoctors(docDisplay)}</div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
