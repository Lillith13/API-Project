/* BoilerPlate */
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

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

  //   ! Add styling in spots.css

  useEffect(() => {
    spots.spots ? setSpotsArr(spots.spots) : setSpotsArr(null);
    if (spots.errors) console.log(spots.errors);
  }, [isLoaded]);

  return (
    <div>
      {spotsArr && spotsArr.length > 0 ? (
        <div className="spotPreviewDiv">
          {spotsArr.map((spot) => (
            <div className="spotPreview" key={spot.id}>
              <h3>
                {spot.name} - ImageUrl: {spot.previewImage}
                <img
                  src={require(`../SpotDetails/images/BirdHouse${spot.previewImage}.jpg`)}
                  alt="birdhouse"
                />
              </h3>

              <div className="infoDiv">
                <p>
                  {spot.city}, {spot.state}
                </p>
                {/* {// ! get star icon from Font Awesome } */}
                <p>avgRating: {spot.avgRating}</p>
              </div>

              <button className="priceButton">{spot.price}/night</button>
            </div>
          ))}
        </div>
      ) : (
        <p>error loading spots</p>
      )}
    </div>
  );
}
