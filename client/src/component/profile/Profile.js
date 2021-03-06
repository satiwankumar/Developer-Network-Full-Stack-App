import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileByID } from '../../actions/profile';
import {Link } from 'react-router-dom'
import ProfileTop from './ProfileTop'

const Profile = ({
  getProfileByID,
  profile: { profile, loading },
  auth,
  match,
}) => {
  useEffect(() => {
    getProfileByID(match.params.id);
  }, [getProfileByID,match.params.id]);

  return <Fragment>
    {profile ===null || loading ? (<Spinner/>):(
      <Fragment>
      <Link to="/profiles" className="btn btn-light">
      Back to Profiles
      </Link>

    {auth.isAuthenticated && auth.loading ===false  && auth.user._id === profile.user._id && (<Link to="/edit-profile" className="btn btn-dark" >Edit Profile</Link>)}

      </Fragment>
    )}
      <div className="profile-grid my-1">
      <ProfileTop profile={profile}/>
      </div>


  </Fragment>

};

Profile.propTypes = {
  getProfileByID: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfileByID })(Profile);
