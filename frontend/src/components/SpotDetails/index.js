/* BoilerPlate */
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/* Import Necessities */
import * as spotsActions from "../../store/spots";

/* Import Related CSS && Images */
import "./SpotDetails.css";

/* Build & Export Component */
export default function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(spotsActions.getASpot(spotId)).then(() => setIsLoaded(true));
  }, [dispatch]);

  const loadPreviewImgs = () => {
    const { firstName, lastName } = spot.Owner;
    return (
      <>
        <div className="spotDetailsImages">
          {spot.SpotImages.map((sdImg) => (
            <div>
              <div className="previewImg">
                {sdImg.preview && (
                  <img
                    // className="previewImg"
                    src={require(`./images/BirdHouse${sdImg.url}.jpg`)}
                  />
                )}
              </div>
              <div className="detailsImg">
                {!sdImg.preview && (
                  <img
                    // className="detailsImg"
                    src={require(`./images/BirdHouse${sdImg.url}.jpg`)}
                    alt="birdhouse"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="spotOwnerName">
          {spot.Owner && (
            <h3>
              Hosted by {firstName} {lastName}
            </h3>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="spotDetailHead">
      <div>
        <h1 className="spotName">{spot.name}</h1>
        <div className="spotAddress">
          <p>
            {spot.city}, {spot.state}, {spot.country}
          </p>
          <p className="latNlng">
            lat: {spot.lat} lng: {spot.lng}
          </p>
        </div>
      </div>

      <div>{isLoaded && loadPreviewImgs()}</div>

      {/* <h3>id: {spot.id}</h3>
      <h3>ownerId: {spot.ownerId}</h3> */}

      <div className="descriptionDiv">
        <p id="description">description: {spot.description}</p>
      </div>

      <div className="reservationDiv">
        <h3 id="price">price: {spot.price}</h3>

        <div className="revBlurb">
          <h3 id="avgStarRating">
            avgStarRating: {spot.avgStarRating} - numReviews: {spot.numReviews}
          </h3>
        </div>

        <button id="reservationButton">Make Reservation</button>
      </div>

      {/* Dividing line */}

      <div className="revBlurb">star icon, avgStarRating, #reviews </div>
      <br />
      <div className="reviewsForSpot">
        reviews on spot being viewed <br /> Reviewer Name <br />
        date reviewed <br /> review
      </div>
    </div>
  );
}
