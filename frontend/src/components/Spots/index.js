/* BoilerPlate */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

/* Import Necessities */
import * as spotsActions from "../../store/spots";

/* Import Related CSS */
import "./Spots.css";

/* Build & Export Component */
export default function Spots() {
  const dispatch = useDispatch();
  const urlSearch = new URLSearchParams(window.location.search);

  const queryObj = {
    page: urlSearch.get("page") || 1,
    size: urlSearch.get("size") || 10,
  };

  const spots = useSelector((state) => state.spots);
  const [isLoaded, setIsLoaded] = useState(false);
  // const [spotsArr, setSpotsArr] = useState(spots || null);

  useEffect(() => {
    dispatch(spotsActions.loadAllSpots(queryObj)).then(() => setIsLoaded(true));
  }, [dispatch]);

  // ! Change img urls for spotImages before continueing here
  const loadSpots = () => {
    const display = [];
    let disp;
    spots.forEach((spot) => {
      const prevImg = spot.previewImage;
      // const endTag = prevImg.subString();
      // console.log(prevImg[0]);
      if (!prevImg || prevImg == undefined) {
        disp = (
          <img
            src={`../SpotDetails/images/BirdHouseundefined.jpg`}
            alt="birdhouse"
            id="previewImage"
          />
        );
      }
      if (typeof prevImg === "string" && [...prevImg][0] === "/") {
        disp = (
          <img
            src={require(`../SpotDetails${prevImg}`)}
            alt="birdhouse"
            id="previewImage"
          />
        );
      } else {
        // console.log([...prevImg][0]);
        disp = <img src={prevImg} alt="birdhouse" id="previewImage" />;
      }

      display.push(
        <Link to={`/${spot.id}`} className="spotPreview" key={spot.id}>
          {disp}
          <div className="infoDiv">
            <p>
              {spot.city}, {spot.state}
            </p>
            <p>
              <i
                className="fa-solid fa-feather"
                style={{ color: "rgb(32, 185, 32)" }}
              />{" "}
              {spot.avgRating}
            </p>
          </div>
          <button className="priceButton">{spot.price}/night</button>
        </Link>
      );
    });
    return <div className="spotPreviewDiv">{display}</div>;
  };

  return <div>{isLoaded && loadSpots()}</div>;
}
