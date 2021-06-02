import React, { Suspense } from 'react';
import { Route, Switch, useHistory } from "react-router-dom";
import Auth from "../hoc/auth";

import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer"
import MovieDetail from "./views/MovieDetail/MovieDetail"
import FavoritePage from "./views/FavoritePage/FavoritePage"
import Profile from './views/profilePage/Profile';
import ResetUser from './views/LoginPage/ResetUser';
import ChangePassword from './views/LoginPage/ChangePassword';

 
function App(props) {
console.log(props)

    return (
      <Suspense fallback={(<div>Loading...</div>)}>
        <NavBar />
          <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 72px)' }}>
            <Switch>
              <Route exact path="/" component={Auth(LandingPage, null)} />
              <Route exact path="/login" component={Auth(LoginPage, false)} />
              <Route exact path="/register" component={Auth(RegisterPage, false)} />
              <Route exact path="/movie/:movieId" component={Auth(MovieDetail, null)} />
              <Route exact path="/favorite" component={Auth(FavoritePage, null)} />
              <Route exact path="/profile" component={Auth(Profile, null)} />
              <Route exact path="/forgot-password" component={Auth(ResetUser, false)} />
              <Route exact path="/change-password/:userId/:token" component={Auth(ChangePassword, false)} />
            </Switch>
          </div>
        <Footer />
      </Suspense>
    );
}

export default App;