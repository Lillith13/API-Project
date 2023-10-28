/* BoilerPlate */
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

/* Import Necessities */
import * as spotActions from "../../../store/spots";

/* Import Related CSS */
import "./spotForm.css";

export default function SpotForm({ user }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots);
  const { spotId } = useParams();

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [prevImg, setPrevImg] = useState("");
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");
  const [imgsArr, setImgsArr] = useState([]);

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && spotId) {
      dispatch(spotActions.getASpot(spotId)).then((spot) => {
        if (spot.ownerId != user.id) {
          history.push("/");
        }
        if (spot && spot != "undefined") {
          setCountry(spot.country);
          setAddress(spot.address);
          setCity(spot.city);
          setState(spot.state);
          setLat(spot.lat);
          setLng(spot.lng);
          setDescription(spot.description);
          setName(spot.name);
          setPrice(spot.price);

          const pImg = spot.SpotImages.find((img) => img.preview);
          setPrevImg(pImg.url);

          const otherImgs = spot.SpotImages.filter((img) => !img.preview);
          const iArr = [];
          if (otherImgs.length > 0) {
            if (otherImgs[0]) setImg1(otherImgs[0].url);
            if (otherImgs[1]) setImg2(otherImgs[1].url);
            if (otherImgs[2]) setImg3(otherImgs[2].url);
            if (otherImgs[3]) setImg4(otherImgs[3].url);
          }

          // setImgsArr(iArr);
        }
      });
    }
  }, [dispatch]);

  useEffect(() => {
    const errs = {};

    if (!country) errs.country = "Country is Required";
    if (!address) errs.address = "Address is Required";
    if (!city) errs.city = "City is Required";
    if (!state) errs.state = "State is Required";
    if (!lat) errs.lat = "Latitude is Required";
    if (isNaN(lat)) errs.lat = "Latitude must be a number";
    if (lat && (lat < -90 || lat > 90))
      errs.lat = "Latitude must be between -90 and 90 degrees";
    if (!lng) errs.lng = "Longitude is Required";
    if (isNaN(lng)) errs.lng = "Longitude must be a number";
    if (lng && (lng < -180 || lng > 180))
      errs.lng = "Longitude must be between -180 and 180 degrees";
    if (!description) errs.description = "Description is Required";
    if (description && description.length < 30)
      errs.description = "Descriptions must be 30 characters or more";
    if (!name) errs.name = "Spot title is Required";
    if (!price) errs.price = "Price per night is Required";
    if (isNaN(price)) errs.price = "Price must be a number";
    if (!prevImg) errs.prevImg = "At least one image is Required";

    setErrors({ ...errs });
  }, [country, address, city, state, lat, lng, description, price, prevImg]);

  useEffect(() => {
    setHasSubmitted(false);
    setCountry("");
    setAddress("");
    setCity("");
    setState("");
    setLat("");
    setLng("");
    setDescription("");
    setName("");
    setPrice("");
    setPrevImg("");
    setImg1("");
    setImg2("");
    setImg3("");
    setImg4("");
  }, [hasSubmitted]);

  const onSubmit = (e) => {
    e.preventDefault();

    const newSpot = {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
    };

    let spotImgUrls;
    spotImgUrls = [prevImg];
    if (img1) spotImgUrls.push(img1);
    if (img2) spotImgUrls.push(img2);
    if (img3) spotImgUrls.push(img3);
    if (img4) spotImgUrls.push(img4);
    if (spotId && spotId != "undefined") {
      // spotImgUrls = [prevImg, ...imgsArr];
      // dispatch spot update
      dispatch(spotActions.updateSpot(spotId, spotImgUrls, newSpot)).then(() =>
        history.push(`/${spotId}`)
      );
    } else {
      spotImgUrls = spotImgUrls.filter((img) => img && img != "undefined");
      // dispatch create
      dispatch(spotActions.createASpot(newSpot, spotImgUrls, user.id)).then(
        (newSpotId) => history.push(`/${newSpotId}`)
      );
    }

    setHasSubmitted(true);
  };

  return (
    <div className="createSpotFormDiv">
      <form className="createSpotForm" onSubmit={onSubmit}>
        <h2>{spotId ? "Update your" : "Create a new"} Spot</h2>
        <h3>Where's your place located?</h3>
        <p>
          Guests will only get your exact address once they've booked a
          reservation.
        </p>
        <div className="fullAddressDiv">
          <div className="countryDiv">
            <label>Country {/* {} */}</label>
            <input
              type="text"
              placeholder="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              id="countryInput"
              required
            />
            {errors.country && <p className="errors">{errors.country}</p>}
          </div>
          <br />
          <div className="addressDiv">
            <label>Address {/* {} */}</label>
            <input
              type="text"
              placeholder="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              id="addressInput"
              required
            />
            {errors.address && <p className="errors">{errors.address}</p>}
          </div>
          <div className="cityState">
            <div className="cityDiv">
              <label id="cityInput">City {/* {} */}</label>
              <input
                type="text"
                placeholder="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              {errors.city && <p className="errors">{errors.city}</p>}
            </div>
            <p id="formComma"> , </p>
            <div className="stateDiv">
              <label id="stateInput">State {/* {} */}</label>
              <input
                type="dropdown"
                placeholder="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
              {errors.state && <p className="errors">{errors.state}</p>}
            </div>
          </div>
          <div className="latNlng">
            <div className="latDiv">
              <label>Latitude {/* {} */}</label>
              <input
                type="text"
                placeholder="lat"
                id="latInput"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
              />
              {errors.lat && <p className="errors">{errors.lat}</p>}
            </div>
            <p id="formComma"> , </p>
            <div className="lngDiv">
              <label>Longitude {/* {} */}</label>
              <input
                type="text"
                placeholder="lng"
                id="lngInput"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                required
              />
              {errors.lng && <p className="errors">{errors.lng}</p>}
            </div>
          </div>
        </div>

        <div className="descDiv">
          <h3>Describe your place to guests</h3>
          <p>
            Mention the best features of your space, any special amentities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <textarea
            id="descInput"
            className="input"
            placeholder="Please write at least 30 characters"
            style={{ height: "250px" }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && <p className="errors">{errors.description}</p>}
        </div>

        <div className="nameDiv">
          <h3>Create a title for your spot</h3>
          <p>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </p>
          <input
            type="text"
            placeholder="Name of your spot"
            id="nameInput"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <p className="errors">{errors.name}</p>}
        </div>

        <div className="priceDiv">
          <h3>Set a base price for your spot</h3>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <div className="priceInputDiv">
            <i className="fa-solid fa-dollar-sign fa-shake" id="dollarSign" />
            <input
              type="text"
              placeholder="Price per night (USD)"
              id="priceInput"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          {errors.price && <p className="errors">{errors.price}</p>}
        </div>

        <div className="imgSecDiv">
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <div className="imgInputsDiv">
            <input
              placeholder="Preview Image URL"
              value={prevImg}
              onChange={(e) => {
                setPrevImg(e.target.value);
              }}
              required
            />
            {errors.prevImg && <p className="errors">{errors.prevImg}</p>}
            <br />
            <input
              placeholder="Image URL"
              value={img1}
              onChange={(e) => setImg1(e.target.value)}
            />
            {/* {} */}
            <br />
            <input
              placeholder="Image URL"
              value={img2}
              onChange={(e) => setImg2(e.target.value)}
            />
            {/* {} */}
            <br />
            <input
              placeholder="Image URL"
              value={img3}
              onChange={(e) => setImg3(e.target.value)}
            />
            {/* {} */}
            <br />
            <input
              placeholder="Image URL"
              value={img4}
              onChange={(e) => setImg4(e.target.value)}
            />
            {/* {} */}
          </div>
        </div>

        <div className="subSpotDiv">
          <button
            className="submitNewSpot"
            type="submit"
            disabled={Object.keys(errors).length > 0 ? true : false}
          >
            {spotId ? "Update" : "Create"} Spot
          </button>
        </div>
      </form>
    </div>
  );
}
