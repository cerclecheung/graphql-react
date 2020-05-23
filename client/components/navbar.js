import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import { logout } from '../store';

const Navbar = ({ handleClick, isLoggedIn }) => (
  <div className="bg-green-500 text-gray-100 p-2">
    {/* <h1 className="text-2xl px-20"> HollaBody</h1> */}
    <img
      className="px-10 w-50 object:contain"
      src="https://i.ibb.co/yk2Q8vT/hollabody-long-white.png"
      border="0"
    />
    <nav>
      <div className="flex justify-between px-10 ">
        {/* The navbar will show these links after you log in */}
        <div>
          <Link className="p-2" to="/">
            About
          </Link>
          <Link className="p-2" to="/classes">
            All Classes
          </Link>
        </div>
        {isLoggedIn ? (
          <div>
            <Link className="p-2" to="/me/bio">
              Me
            </Link>
            <Link className="p-2" to="/me/classes">
              My Class
            </Link>
            <a className="p-2" href="#" onClick={handleClick}>
              Logout
            </a>
          </div>
        ) : (
          <div>
            <Link className="p-2" to="/login">
              Login
            </Link>
            <Link className="p-2" to="/signup">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
    <hr />
  </div>
);

export default Navbar;

/**
 * CONTAINER
 */
// const mapState = (state) => {
//   return {
//     isLoggedIn: !!state.user.id,
//   };
// };

// const mapDispatch = (dispatch) => {
//   return {
//     handleClick() {
//       dispatch(logout());
//     },
//   };
// };

// export default connect(mapState, mapDispatch)(Navbar);

// /**
//  * PROP TYPES
//  */
// Navbar.propTypes = {
//   handleClick: PropTypes.func.isRequired,
//   isLoggedIn: PropTypes.bool.isRequired,
// };
