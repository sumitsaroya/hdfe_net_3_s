import React from 'react';
import { useLocation, navigate } from 'react-router-dom';

const DataView = () => {
  const location = useLocation();
  const data = location.state?.data;

  return (
    <div>
      <h2>Data View</h2>
      {data && (
        <table className="table">
          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr key={key}>
                <td><strong>{key}:</strong></td>
                <td>{JSON.stringify(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DataView;