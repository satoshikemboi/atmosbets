import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";

import Hero from "./components/Hero";
import QuickFilters from "./components/QuickFilters";

import Sports from "./pages/Sports";
import Slip from "./pages/Slip";
import Profile from "./pages/Profile";
import Deposit from "./pages/Deposit";

import { Routes, Route } from "react-router-dom";

function Home() {
  return (
    <>
      <Hero autoPlayMs={6000} />
      <QuickFilters />
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      <Navbar />

      <main className="pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/betslip" element={<Slip />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/deposit" element={<Deposit />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}

export default App;