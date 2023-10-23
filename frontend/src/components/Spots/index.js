/* BoilerPlate */
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* Import Necessities */
import * as spotsActions from "../../store/spots";

/* Import Related CSS */
import "./Spots.css";

/* Build & Export Component */
export default function Spots() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots);
  const [isLoaded, setIsLoad] = useState(false);
  const [spotsArr, setSpotsArr] = useState(spots.spots || null);

  useEffect(() => {
    dispatch(spotsActions.loadAllSpots()).then(() => setIsLoad(true));
  }, [dispatch]);

  useEffect(() => {
    spots.spots ? setSpotsArr(spots.spots) : setSpotsArr(null);
    // if (spots.errors) console.log(spots.errors);
  }, [isLoaded]);

  return (
    <div>
      {spotsArr && spotsArr.length > 0 ? (
        <div className="spotPreviewDiv">
          {spotsArr.map((spot) => (
            <Link to={`/${spot.id}`} className="spotPreview" key={spot.id}>
              <div>
                <h3>
                  {spot.name}
                  <img
                    src={require(`../SpotDetails/images/BirdHouse${spot.previewImage}.jpg`)}
                    alt="birdhouse"
                    id="previewImage"
                  />
                </h3>

                <div className="infoDiv">
                  <p>
                    {spot.city}, {spot.state}
                  </p>
                  <p>
                    <i
                      className="fa-solid fa-feather"
                      style={{ color: "#000000" }}
                    ></i>{" "}
                    {spot.avgRating}
                  </p>
                </div>

                <button className="priceButton">{spot.price}/night</button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>error loading spots</p>
      )}
    </div>
  );
}
