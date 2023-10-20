import React from "react";
import { Switch, Route } from "react-router-dom";

import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignUpPage";

function App() {
  return (
    <Switch>
      <Route exact path="/">
        Temp Home Page
      </Route>
      <Route path="/login">
        <LoginFormPage />
      </Route>
      <Route path="/signup">
        <SignupFormPage />
      </Route>
    </Switch>
  );
}

export default App;
