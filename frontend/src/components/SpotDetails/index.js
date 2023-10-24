/* BoilerPlate */
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/* Import Necessities */
import * as spotsActions from "../../store/spots";
import * as reviewsActions from "../../store/reviews";

/* Import Related CSS && Images */
import "./SpotDetails.css";

/* Build & Export Component */
export default function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots);
  const reviews = useSelector((state) => state.reviews);

  const [isLoaded, setIsLoaded] = useState(false);
  const [owner, setOwner] = useState("");

  useEffect(() => {
    dispatch(spotsActions.getASpot(spotId))
      .then(() => {
        setOwner(spot.Owner);
      })
      .then(() =>
        dispatch(reviewsActions.loadSpotReviews(spotId)).then(() => {
          setIsLoaded(true);
        })
      );
  }, [isLoaded, dispatch]);

  const displayFetchData = () => {
    return (
      <>
        <div className="spotNameNAddDiv">
          <h1 className="spotName">{spot.name}</h1>
          <p className="spotAddress" style={{ width: "100%" }}>
            {spot.city}, {spot.state}, {spot.country}
          </p>
        </div>
        <div className="spotDetailsImages">
          {isLoaded &&
            spot.SpotImages.map((sdImg) => (
              <div className="previewImgDiv">
                {sdImg.preview ? (
                  <img
                    className="previewImg"
                    src={require(`./images/BirdHouse${sdImg.url}.jpg`)}
                    alt="prevbirdhouse"
                    key={`image${sdImg.id}`}
                  />
                ) : (
                  ""
                )}
              </div>
            ))}
          <div className="detailsImgDiv">
            {isLoaded &&
              spot.SpotImages.map((sdImg) => (
                <>
                  {!sdImg.preview && (
                    <img
                      className="detailsImg"
                      src={require(`./images/BirdHouse${sdImg.url}.jpg`)}
                      alt="birdhouse"
                      key={`image${sdImg.id}`}
                    />
                  )}
                </>
              ))}
          </div>
        </div>

        <div className="spotDetails">
          <div className="descriptionDiv">
            {isLoaded && owner && (
              <h3 className="spotOwnerName">
                Hosted by {owner.firstName} {owner.lastName}
              </h3>
            )}
            <p id="description">description: {spot.description}</p>
          </div>

          <div className="reservationDiv">
            <div className="revBlurb">
              <p id="price">
                <strong>{spot.price}</strong> night
              </p>
              <p id="avgStarRating">
                <i
                  className="fa-solid fa-feather"
                  style={{ color: "rgb(32, 185, 32)" }}
                ></i>{" "}
                {spot.avgStarRating} / {spot.numReviews} reviews
              </p>
            </div>
            <button id="reservationButton">Make Reservation</button>
          </div>
        </div>
        {/* Dividing line */}

        <div>
          <h3 id="avgStarRating">
            <i className="fa-solid fa-feather" style={{ color: "#000000" }}></i>{" "}
            {spot.avgStarRating} - {spot.numReviews} reviews
          </h3>
          <div className="reviewsForSpot">
            {reviews.map((rev) => (
              <div key={`review${rev.id}`}>
                <p>
                  date reviewed:{" "}
                  {rev.createdAt > rev.updatedAt
                    ? rev.createdAt.split("T")[0]
                    : rev.updatedAt.split("T")[0]}
                </p>
                <h4>
                  Reviewer Name: {rev.User.firstName} {rev.User.lastName}
                </h4>
                <p>review: {rev.review}</p>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="spotDetailHead">
      {/* <p className="latNlng">
        lat: {spot.lat} lng: {spot.lng}
      </p> */}

      <div>{isLoaded && displayFetchData()}</div>
    </div>
  );
}
