import NavBar from "../components/NavBar";

function AppLayout({ children }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

export default AppLayout;
