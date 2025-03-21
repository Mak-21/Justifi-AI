import { NavLink } from "react-router-dom";
import styles from "./Button.module.css";

function Button({ size = "medium" }) {
  return (
    <NavLink
      className={
        size === "medium" ? styles.btn : `${styles.btn} ${styles.btnLarge}`
      }
      to="/ask-juris" // Navigate to the AskJuris route
    >
      Ask Juris
    </NavLink>
  );
}

export default Button;
