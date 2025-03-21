import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import { Suspense, lazy } from "react";
import SpinnerFullPage from "./components/SpinnerFullPage";

const Homepage = lazy(() => import("./pages/Homepage"));
const AskJuris = lazy(() => import("./pages/AskJuris"));

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Suspense fallback={<SpinnerFullPage />}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/ask-juris" element={<AskJuris />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
  