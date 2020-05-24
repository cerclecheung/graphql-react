import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import { logout } from '../store';

const Navbar = ({ isLoggedIn }) => {
  const handleLogOut = () => {
    localStorage.removeItem('apollo-token');
  };
  return (
    <div>
      <img
        className="px-10 w-50 object:contain"
        src="https://i.ibb.co/yk2Q8vT/hollabody-long-white.png"
        border="0"
      />
      <nav>
        <div className="flex justify-between px-10 ">
          <div>
            <Link className="p-2" to="/">
              About
            </Link>
          </div>
          {isLoggedIn ? (
            <div>
              {/* The navbar will show these links after you log in */}
              <Link className="p-2" to="/portfolio">
                Portfolio
              </Link>
              <Link className="p-2" to="/transaction">
                Transaction
              </Link>
              <a className="p-2" href="#" onClick={handleLogOut}>
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
};

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
