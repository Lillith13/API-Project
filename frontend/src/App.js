/* BoilerPlate */
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";

/* Import Necessities */
import Navigation from "./components/Navigation";
import Spots from "./components/Spots";
import * as sessionActions from "./store/session";

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
        </Switch>
      )}
    </div>
  );
}

export default App;
