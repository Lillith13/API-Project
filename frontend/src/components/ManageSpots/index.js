/* BoilerPlate */
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

/* Import Necessities */
import * as spotsActions from "../../store/spots";
import OpenVerifyDeleteModal from "../DeleteModal/OpenDeleteModal";
import VerifyDeleteModal from "../DeleteModal/DeleteModal.js";

/* Import Related CSS */
import "./CurrUserSpots.css";

export default function CurrUserSpots() {
  const history = useHistory();
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(spotsActions.loadUserSpots()).then((data) => {
      if (!data.message) {
        setIsLoaded(true);
      }
    });
  }, [dispatch]);

  const userSpots = [...Object.values(spots)];

  const loadSpots = () => {
    const display = [];
    let disp;
    userSpots.map((spot) => {
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
        <div className="spotPreview">
          <Link to={`/${spot.id}`} key={spot.id}>
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
                {spot.avgRating > 0 ? spot.avgRating : "NEW"}
              </p>
            </div>
            <p className="price">{spot.price} night</p>
          </Link>
          <div className="buttonsDiv">
            <button
              value={spot.id}
              onClick={(e) => {
                history.push(`/${e.target.value}/update`);
              }}
            >
              Update
            </button>
            <OpenVerifyDeleteModal
              itemText="Delete"
              modalComponent={<VerifyDeleteModal spotId={spot.id} />}
            />
          </div>
        </div>
      );
    });
    return <div className="spotPreviewDiv">{display}</div>;
  };

  return (
    <div className="manageSpotsTitleDiv">
      <h1 className="manageSpotsHeader">Manage Your Spots</h1>
      <Link to="/mySpots/new">
        <button className="createSpotButton">Create a New Spot</button>
      </Link>
      {isLoaded && userSpots.length > 0 ? loadSpots() : ""}
    </div>
  );
}
