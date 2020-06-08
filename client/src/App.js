import React, { Fragment, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './component/layout/Navbar';
import Landing from './component/layout/landing';
import Login from './component/Auth/Login';
import Signup from './component/Auth/Signup';
import Alert from './component/layout/Alert';
import Dashboard from './component/Dashboard/Dashboard'
import PrivateRoute from './component/routing/PrivateRoute'
import CreateProfile from './component/profile-forms/CreateProfile'
import EditProfile from './component/profile-forms/EditProfile'
import AddExperience from './component/profile-forms/AddExperience'
import AddEducation from './component/profile-forms/AddEducation';
import Profiles from './component/profiles/Profiles'
import Profile from './component/profile/Profile'

//Redux

import { Provider } from 'react-redux';
import store from './store';
import  {loadUser}  from './actions/auth';
import setAuthToken from './utils/setAuthToken';







if (localStorage.token) {
  setAuthToken(localStorage.token);
}




const App = () => {

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);


  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Signup} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/profile/:id" component={Profile} />
              
              <PrivateRoute exact path="/dashboard" component={Dashboard}/>
              <PrivateRoute exact path="/create-profile" component={CreateProfile}/> 
              <PrivateRoute exact path="/edit-profile" component={EditProfile}/> 
              <PrivateRoute exact path="/add-experience" component={AddExperience}/>
              <PrivateRoute exact path="/add-education" component={AddEducation}/>

              

              </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};
export default App;
