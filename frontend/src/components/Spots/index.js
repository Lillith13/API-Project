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

  const spots = useSelector((state) => state.spots);

  const queryObj = {
    page: urlSearch.get("page") || 1,
    size: urlSearch.get("size") || 10,
  };

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(spotsActions.loadAllSpots(queryObj)).then((spots) => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  const loadSpots = () => {
    const display = [];
    let disp;
    const spotsArr = [];
    for (let spot in spots) {
      spotsArr.push(spots[spot]);
    }
    spotsArr.toReversed().map((spot) => {
      const prevImg = spot.previewImage;
      if (!prevImg || prevImg == "undefined") {
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
        disp = <img src={prevImg} alt="birdhouse" id="previewImage" />;
      }

      display.push(
        <Link
          to={`/${spot.id}`}
          className="spotPreview"
          key={spot.id}
          title={spot.name}
        >
          {disp}
          <div className="infoDiv">
            <p className="cityState">
              {spot.city}, {spot.state}
            </p>
            <p className="avgStarRating">
              <i
                className="fa-solid fa-feather"
                style={{ color: "rgb(32, 185, 32)" }}
              />{" "}
              {spot.avgRating > 0 ? spot.avgRating : "NEW"}
            </p>
          </div>
          <button className="priceButton">{spot.price} night</button>
        </Link>
      );
    });
    return <div className="spotPreviewDiv">{display}</div>;
  };

  return <div>{isLoaded && loadSpots()}</div>;
}
