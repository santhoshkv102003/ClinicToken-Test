import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import "../styles/patientlist.css";

const PatientList = ({ list }) => {
  const { calculateWaitTime } = useContext(AppContext);

  if (!list || list.length === 0) {
    return (
      <div className="pl-empty">
        <div className="pl-empty-icon">◷</div>
        <p className="pl-empty-text">No patients found</p>
        <p className="pl-empty-sub">The list is currently empty</p>
      </div>
    );
  }

  return (
    <div className="pl-table-wrap">
      <table className="pl-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Wait (Mins)</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p, i) => (
            <tr key={i}>
              <td>
                <span className="pl-token">T{String(p.tokenNumber || i + 1).padStart(2, "0")}</span>
              </td>
              <td className="pl-name">{p.name}</td>
              <td>{p.age}</td>
              <td className="pl-phone">{p.phone}</td>
              <td>
                <span className="pl-wait-badge" style={{ 
                  color: 'var(--accent)', 
                  fontWeight: 'bold',
                  background: 'rgba(0, 243, 255, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {calculateWaitTime(p.tokenNumber, list)} mins
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;
