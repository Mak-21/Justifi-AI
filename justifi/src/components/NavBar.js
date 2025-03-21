import { NavLink, useLocation } from "react-router-dom";
import styles from "./NavBar.module.css";
import Logo from "./Logo";

function NavBar() {
  const location = useLocation();

  return (
    <nav className={styles.nav}>
      <Logo />
      {/* Conditionally render the Ask Juris button if not on the /ask-juris page */}
      {location.pathname !== "/ask-juris" && (
        <NavLink to="/ask-juris" className={styles.btn}>
          Ask Juris
        </NavLink>
      )}
    </nav>
  );
}

export default NavBar;

