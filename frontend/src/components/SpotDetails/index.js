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
        setOwner(spot[0].Owner);
      })
      .then(() =>
        dispatch(reviewsActions.loadSpotReviews(spotId)).then(() => {
          setIsLoaded(true);
        })
      );
  }, [isLoaded, dispatch]);

  const loadPrevImage = (spotImgs) => {
    const prevImg = spotImgs.find((img) => img.preview);

    let display;
    if (prevImg.url[0] === "/") {
      display = (
        <img
          className="detailsImg"
          src={require(`.${prevImg.url}`)}
          alt="birdhouse"
          key={`image${prevImg.id}`}
        />
      );
    } else if (!prevImg || prevImg == "undefined") {
      display = (
        <img
          className="detailsImg"
          src={require(`./images/BirdHouseundefined.jpg`)}
          alt="birdhouse"
          key={`image${prevImg.id}`}
        />
      );
    } else {
      display = (
        <img
          className="detailsImg"
          src={prevImg.url}
          alt="birdhouse"
          key={prevImg.id}
        />
      );
    }

    return display;
  };

  const loadOtherImages = (spotImgs) => {
    const allOtherImgs = spotImgs.filter((img) => !img.preview);

    let count = 0;
    while (allOtherImgs.length < 4) {
      allOtherImgs.push({
        id: `default${count}`,
        url: `/images/BirdHouseundefined.jpg`,
      });
      count++;
    }

    const display = [];
    allOtherImgs.map((img) => {
      if (img.url[0] === "/") {
        display.push(
          <img
            className="detailsImg"
            src={require(`.${img.url}`)}
            alt="birdhouse"
            key={`image${img.id}`}
          />
        );
      } else {
        display.push(
          <img
            className="detailsImg"
            src={img.url}
            alt="birdhouse"
            key={`image${img.id}`}
          />
        );
      }
    });

    return display;
  };

  const displayFetchData = () => {
    return (
      <>
        <div className="spotNameNAddDiv">
          <h1 className="spotName">{spot[0].name}</h1>
          <p className="spotAddress" style={{ width: "100%" }}>
            {spot[0].city}, {spot[0].state}, {spot[0].country}
          </p>
        </div>
        <div className="spotDetailsImages">
          {isLoaded && loadPrevImage(spot[0].SpotImages)}
          <div className="detailsImgDiv">
            {isLoaded && loadOtherImages(spot[0].SpotImages)}
          </div>
        </div>

        <div className="spotDetails">
          <div className="descriptionDiv">
            {isLoaded && owner && (
              <h3 className="spotOwnerName">
                Hosted by {owner.firstName} {owner.lastName}
              </h3>
            )}
            <p id="description">description: {spot[0].description}</p>
          </div>

          <div className="reservationDiv">
            <div className="revBlurb">
              <p id="price">
                <strong>{spot[0].price}</strong> night
              </p>
              <p id="avgStarRating">
                <i
                  className="fa-solid fa-feather"
                  style={{ color: "rgb(32, 185, 32)" }}
                ></i>{" "}
                {spot[0].avgStarRating} / {spot[0].numReviews} reviews
              </p>
            </div>
            <button id="reservationButton">Make Reservation</button>
          </div>
        </div>
        {/* Dividing line */}

        <div>
          <h3 id="avgStarRating">
            <i className="fa-solid fa-feather" style={{ color: "#000000" }}></i>{" "}
            {spot[0].avgStarRating} - {spot[0].numReviews} reviews
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
