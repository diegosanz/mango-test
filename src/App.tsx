import React from "react";
import "./App.css";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { hot } from "react-hot-loader";
import { store } from "./store/store";
import { Provider } from "react-redux";
import NotFound from "./ui/components/not-found/NotFound";
import Exercise2 from "./demo/components/exercise2/Exercise2";
import Exercise1 from "./demo/components/exercise1/Exercise1";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Redirect
              to={{
                pathname: "/exercise1",
              }}
            />
          </Route>

          <Route exact path="/exercise1" component={Exercise1} />
          <Route exact path="/exercise2" component={Exercise2} />

          <Route path="*" component={NotFound} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

export default process.env.NODE_ENV === "development" ? hot(module)(App) : App;
