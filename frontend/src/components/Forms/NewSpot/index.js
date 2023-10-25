/* BoilerPlate */
import { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

/* Import Necessities */
import * as spotActions from "../../../store/spots";

/* Import Related CSS */
import "./newSpotForm.css";

export default function CreateSpotForm() {
  const history = useHistory();
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session);
  // console.log(session.user); // returns current user info

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

  const [hasSubmitted, setHasSubmitted] = useState(false);

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

    let spotImgUrls = [prevImg, img1, img2, img3, img4];
    spotImgUrls = spotImgUrls.filter((img) => img && img != "undefined");

    dispatch(
      spotActions.createASpot(newSpot, spotImgUrls, session.user.id)
    ).then(
      (newSpotId) => history.push(`/${newSpotId}`)
      /* console.log(newSpotId)*/
    );

    setHasSubmitted(true);
  };

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

  return (
    <div className="createSpotFormDiv">
      <form className="createSpotForm" onSubmit={onSubmit}>
        <h2>Create a new Spot</h2>
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
          {/* {description.length < 30 && <p className="errors">Description needs a minimum of 30 characters</p>} */}
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
          {/* {} */}
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
            {/* {} */}
          </div>
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
            {/* {} */}
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
          <button className="submitNewSpot" type="submit">
            Create Spot
          </button>
        </div>
      </form>
    </div>
  );
}
