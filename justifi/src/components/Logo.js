import styles from "./Logo.module.css";
import { NavLink } from "react-router-dom";

function Logo() {
  return (
    <NavLink to="/">
      <img className={styles.logo} src="justifi_logo.png" alt="Justifi Logo" />
    </NavLink>
  );
}

export default Logo;
