/* BoilerPlate */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";

/* Import Necessities */
import Navigation from "./components/Navigation";
import Spots from "./components/Spots";
import * as sessionActions from "./store/session";
import SpotDetails from "./components/SpotDetails";
import SpotForm from "./components/Forms/NewSpot";
import CurrUserSpots from "./components/ManageSpots";
import ManageReviews from "./components/ManageReviews";

/* Build & Export Component */
function App() {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  // ! Style the 403 errors below - create error page component

  return (
    <div>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <Spots />
          </Route>
          <Route exact path="/mySpots">
            {session.user ? (
              <CurrUserSpots />
            ) : (
              "403: Log In to view your spots"
            )}
          </Route>
          <Route path="/mySpots/new">
            {session.user ? (
              <SpotForm user={session.user} />
            ) : (
              "403: Log In to create a new spot"
            )}
          </Route>
          <Route path="/myReviews">
            {session.user ? (
              <ManageReviews />
            ) : (
              "403: Log In to see the reviews you've left"
            )}
          </Route>
          <Route exact path="/:spotId">
            <SpotDetails />
          </Route>
          <Route path="/:spotId/update">
            {session.user ? (
              <SpotForm user={session.user} />
            ) : (
              "403: Log In to update spots"
            )}
          </Route>
          <Route>"404 Page Not Found"</Route>
        </Switch>
      )}
    </div>
  );
}

export default App;
