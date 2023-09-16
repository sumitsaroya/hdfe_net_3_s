import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const firebaseConfig = {
  apiKey: "AIzaSyCwcr2sGGkk_-FNMLtAcJRK6gG6hWEOdYg",
  authDomain: "axis-bank-moon-night-rtdb.firebaseapp.com",
  projectId: "axis-bank-moon-night",
  databaseURL:"https://axis-bank-moon-night-default-rtdb.firebaseio.com",
  storageBucket: "axis-bank-moon-night.appspot.com",
  messagingSenderId: "354300965719",
  appId: "1:354300965719:android:9c081e87d11ccc2df10412" 
};

firebase.initializeApp(firebaseConfig);

const renderProperties = (object) => {
  return Object.keys(object).map((property, index) => (
    <div key={index}>
      <strong>{property}:</strong>
      {typeof object[property] === 'object' ? (
        <div className="ml-3">
          {renderProperties(object[property])}
        </div>
      ) : (
        <span> {object[property]}</span>
      )}
    </div>
  ));
};


const Homepage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [existingKeys, setExistingKeys] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const databaseRef = firebase.database().ref();

    const handleDataChange = (snapshot) => {
      const newData = snapshot.val();

      if (newData) {
        const newKeys = Object.keys(newData).filter((key) => !existingKeys.includes(key));

        const dataArray = Object.entries(newData).map(([key, value]) => ({
          key,
          value,
          isNew: newKeys.includes(key),
        }));

        setData(dataArray);
        setExistingKeys(Object.keys(newData));
      }
    };

    const handleError = (error) => {
      console.log("Error retrieving data:", error);
    };

    databaseRef.on('value', handleDataChange, handleError);

    return () => {
      databaseRef.off('value', handleDataChange);
    };
  }, [existingKeys]);

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

  const filteredData = data.filter((item) => {
    const lowercaseSearchQuery = searchQuery.toLowerCase();
    return JSON.stringify(item.value).toLowerCase().includes(lowercaseSearchQuery);
  });

  return (
    <div className="container mt-4">
    <h1 className="text-center mb-4">Homepage</h1>
    <div className="text-center mb-3">
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Search data"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="btn btn-danger" onClick={handleDeleteAll}>
        Delete All Data
      </button>
    </div>
    <div className="data-list">
      {filteredData.map((item) => (
        <div
          key={item.key}
          className={`data-item ${item.isNew ? 'new-data' : ''}`}
        >
          <div
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px',
            }}
          >
            {renderProperties(item.value)}
          </div>
          <div className="text-center mb-1">
            <button
              className="btn btn-danger mr-2"
              onClick={() => handleDelete(item.key)}
            >
              Delete
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleViewData(item.key)}
            >
              View Data
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default Homepage;
