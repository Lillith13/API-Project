/* BoilerPlate */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

/* Import Necessities */
import * as spotsActions from "../../store/spots";

/* Import Related CSS */
import "./CurrUserSpots.css";

export default function CurrUserSpots() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(spotsActions.loadUserSpots()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div>
      <h1>coming soon...</h1>
    </div>
  );
}
