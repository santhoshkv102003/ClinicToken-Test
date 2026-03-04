import "../styles/navbar.css";
import { Heart } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="nav">
      <div className="nav-logo flex items-center gap-2">
        <Heart className="w-6 h-6 text-primary" />
        <span>ClinicQueue</span>
      </div>
      <div className="nav-links">
      </div>
    </nav>
  );
};

export default Navbar;
