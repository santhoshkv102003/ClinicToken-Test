import "../styles/patientlist.css";

const PatientList = ({ list }) => {
  if (!list || list.length === 0) {
    return (
      <div className="empty-state">
        <p>No patients found</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="patient-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Treatment</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p, i) => (
            <tr key={i}>
              <td className="patient-name">{p.name}</td>
              <td>{p.age}</td>
              <td className="patient-phone">{p.phone}</td>
              <td>
                <span className="treatment-badge">{p.treatment}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;
