import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { UserContext } from '../context';

const Navbar = () => {
  const { handleLogOut, apolloToken } = useContext(UserContext);
  return (
    <div>
      <img
        className="px-10 w-50 object:contain"
        src="https://i.ibb.co/yk2Q8vT/hollabody-long-white.png"
        border="0"
      />
      <nav>
        <div className="flex justify-between px-10 ">
          {apolloToken ? (
            <div>
              {/* The navbar will show these links after you log in */}
              <Link className="p-2" to="/portfolio">
                Portfolio
              </Link>
              <Link className="p-2" to="/transactions">
                Transactions
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

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};
