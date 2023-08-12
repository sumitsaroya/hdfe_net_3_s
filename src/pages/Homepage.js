import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD26q8mRm7PYfPBUB0elh9WfcDh-sEVd58",
  authDomain: "icici-ram-data-rtdb.firebaseapp.com",
  projectId: "icici-ram-data",
  databaseURL:"https://icici-ram-data-default-rtdb.firebaseio.com",
  storageBucket: "icici-ram-data.appspot.com",
  messagingSenderId: "914857572958",
  appId: "1:914857572958:android:799910861efd28ca0852cf" 
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const Homepage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    const databaseRef = firebase.database().ref();

    const handleDataChange = (snapshot) => {
      const newData = snapshot.val();

      if (newData) {
        const dataArray = Object.entries(newData).map(([key, value]) => ({
          key,
          value
        }));

        setData(dataArray);
      }
    };

    const handleError = (error) => {
      console.log("Error retrieving data:", error);
    };

    // Attach the listener
    databaseRef.on('value', handleDataChange, handleError);

    // Clean up the listener when the component unmounts
    return () => {
      databaseRef.off('value', handleDataChange);
    };
  }, []);

  const handleDelete = (key) => {
    firebase.database().ref(key).remove();
  };

  const handleDeleteAll = () => {
    firebase.database().ref().remove();
  };

  const handleViewData = (key) => {
    const selectedData = data.find((item) => item.key === key);
    navigate(`/data/${key}`, { state: { data: selectedData.value } });
  };

  const handleView = (key) => {
    handleViewData(key);
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Real-time Data</h1>
      <div className="text-center mb-4">
        <button className="btn btn-danger" onClick={handleDeleteAll}>Delete All</button>
      </div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Sn.</th>
              <th scope="col">Name</th>
              <th scope="col">Value</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.key}>
                <th scope="row">{index + 1}</th>
                <td>
                  <button
                    className="btn btn-link font-weight-bold 
                     text-decoration-none" style={{ fontSize: "12px", textTransform: "uppercase", marginRight:"-10px",marginLeft:"-15px"}}
                    onClick={() => handleView(item.key)}
                  >
                    {item.key}
                  </button>
                </td>
                <td>
                  <pre>{JSON.stringify(item.value, null, 2).replace(/[{}"]/g, '')}</pre>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item.key)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-sm btn-primary ml-2 mt-3"
                    onClick={() => handleView(item.key)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Homepage;
