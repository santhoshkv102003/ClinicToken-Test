import { useEffect, useState } from "react";

const Navbar = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setTime(n.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="cq-header">
      <div className="logo">
        <div className="logo-mark">♥</div>
        ClinicQueue
      </div>
      <div className="header-right">
        <div className="status-chip">
          <div className="chip-dot" />
          SYSTEM ONLINE
        </div>
        <div className="time-chip">{time || "--:--:--"}</div>
      </div>
    </header>
  );
};

export default Navbar;
