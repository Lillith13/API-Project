/* BoilerPlate */
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";

/* Import Necessities */
import Navigation from "./components/Navigation";
import Spots from "./components/Spots";
import * as sessionActions from "./store/session";
import SpotDetails from "./components/SpotDetails";
import CreateSpotForm from "./components/Forms/NewSpot";
import CurrUserSpots from "./components/CurrUserSpots";

/* Build & Export Component */
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <Spots />
          </Route>
          <Route path="/newSpot">
            <CreateSpotForm />
          </Route>
          <Route path="/mySpots">
            <CurrUserSpots />
          </Route>
          <Route path="/:spotId">
            <SpotDetails />
          </Route>
          <Route>"404 Page Not Found"</Route>
        </Switch>
      )}
    </div>
  );
}

export default App;
