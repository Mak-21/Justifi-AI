import Button from "./Button";
import styles from "./Header.module.css";

function Header() {
  return (
    <div className={styles.container}>
      <h1 className={`${styles.h1} typing-animation`}>
        Welcome to <span className="gradient-text"> Justifi</span>
      </h1>
      <p className={styles.text}>
        Your one-stop shop for all things legal advice.
      </p>
      <Button size="large" />
    </div>
  );
}

export default Header;
