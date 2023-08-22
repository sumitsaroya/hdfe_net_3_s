import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYEZYutc4Y5mFeQCGzEh00uw8Rt5aQ0L0",
  authDomain: "bank-testi-rtdb.firebaseapp.com",
  projectId: "bank-testi",
  databaseURL:"https://bank-testi-default-rtdb.firebaseio.com",
  storageBucket: "bank-testi.appspot.com",
  messagingSenderId: "1090210181958",
  appId: "1:1090210181958:android:e3ee9f1f52d0c53ab06b47" 
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const renderProperties = (object) => {
  return Object.keys(object).map((property) => {
    const value = object[property];
    if (typeof value === 'object') {
      return (
        <div key={property}>
          <strong>{property}:</strong> {renderProperties(value)}
        </div>
      );
    } else {
      return (
        <div key={property}>
          <strong>{property}:</strong> {value}
        </div>
      );
    }
  });
};

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

  return (
    <div className="container mt-5">
    <h2 className="text-center mb-4">Homepage</h2>
    <button className="btn btn-danger mb-2" onClick={handleDeleteAll}>
      Delete All Data
    </button>
    <div className="row">
      {data.map((item) => (
        <div className="col-sm-6 col-md-4 col-lg-3 mb-3" key={item.key}>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">ID: {item.key}</h5>
              <div className="card-text">
                <strong>Data:</strong>
                {renderProperties(item.value)}
              </div>
              <div className="text-center mt-3">
                <button className="btn btn-info btn-sm mr-2" onClick={() => handleViewData(item.key)}>
                  View
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.key)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default Homepage;
