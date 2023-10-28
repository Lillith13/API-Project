/* BoilerPlate */
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

/* Import Necessities */
import * as spotsActions from "../../store/spots";
import * as reviewsActions from "../../store/reviews";
import OpenReviewModal from "./OpenReviewModal";
import ReviewModal from "./ReviewModal/ReviewModal.js";
import OpenVerifyDeleteModal from "../DeleteModal/OpenDeleteModal";
import VerifyDeleteModal from "../DeleteModal/DeleteModal";

/* Import Related CSS && Images */
import "./SpotDetails.css";
import {} from "react-router-dom/cjs/react-router-dom.min";

/* Build & Export Component */
export default function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const session = useSelector((state) => state.session);
  const reviews = useSelector((state) => state.reviews);
  const spot = useSelector((state) => state.spots);

  const [isLoaded, setIsLoaded] = useState(false);
  const [owner, setOwner] = useState("");

  useEffect(() => {
    dispatch(spotsActions.getASpot(spotId))
      .then((currSpot) => {
        setOwner(currSpot.Owner);
      })
      .then(() =>
        dispatch(reviewsActions.loadSpotReviews(spotId)).then(() => {
          setIsLoaded(true);
        })
      )
      .catch((e) => {
        if (e.status == 404) history.push("/");
      });
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

  const reviewButton = () => {
    const userRev = reviews.find((rev) => rev.userId === session.user.id);

    if ((userRev && userRev != "undefined") || owner.id == session.user.id) {
      return;
    } else
      return (
        <OpenReviewModal
          itemText="Post Your Review"
          modalComponent={<ReviewModal spotId={spotId} />}
        />
      );
  };

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
          {isLoaded && loadPrevImage(spot.SpotImages)}
          <div className="detailsImgDiv">
            {isLoaded && loadOtherImages(spot.SpotImages)}
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
                {spot.numReviews
                  ? `${spot.avgStarRating} * ${spot.numReviews} ${
                      spot.numReviews === 1 ? "review" : "reviews"
                    }`
                  : "NEW"}
              </p>
            </div>
            <button
              id="reservationButton"
              onClick={() => alert("Feature Coming Soon")}
            >
              Reserve
            </button>
          </div>
        </div>

        {/* Dividing line */}
        <div className="reviewsDivStarsDisplay">
          <h3 id="avgStarRating">
            <i
              className="fa-solid fa-feather"
              style={{ color: "rgb(32, 185, 32)" }}
            ></i>{" "}
            {spot.numReviews
              ? `${spot.avgStarRating} * ${spot.numReviews} ${
                  spot.numReviews === 1 ? "review" : "reviews"
                }`
              : "NEW"}
          </h3>

          {session.user && reviewButton()}
          {spot.numReviews === 0 &&
            session.user &&
            spot.ownerId !== session.user.id && (
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                Be the first to review!
              </p>
            )}

          <div className="reviewsForSpot">
            {reviews.toReversed().map((rev) => (
              <div key={`review${rev.id}`}>
                <h4>
                  Reviewer Name: {rev.User.firstName} {rev.User.lastName}
                </h4>
                <p>
                  {rev.createdAt > rev.updatedAt
                    ? rev.createdAt.split("T")[0]
                    : rev.updatedAt.split("T")[0]}
                </p>
                <p>{rev.review}</p>
                {session.user && session.user.id === rev.userId && (
                  <OpenVerifyDeleteModal
                    itemText="Delete Review"
                    modalComponent={
                      <VerifyDeleteModal reviewId={rev.id} spotId={spotId} />
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="spotDetailHead">
      <div>{isLoaded && displayFetchData()}</div>
    </div>
  );
}
