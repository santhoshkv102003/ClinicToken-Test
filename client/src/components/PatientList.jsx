import "../styles/patientlist.css";

const PatientList = ({ list }) => {
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
            <th>#</th>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p, i) => (
            <tr key={i}>
              <td>
                <span className="pl-token">T{String(i + 1).padStart(2, "0")}</span>
              </td>
              <td className="pl-name">{p.name}</td>
              <td>{p.age}</td>
              <td className="pl-phone">{p.phone}</td>
              <td>
                <span className="pl-badge">{p.treatment}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;
