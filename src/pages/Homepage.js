import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzSCjb8vxxYgi0ppNoshnZwARHEjYsisc",
  authDomain: "jhmoon.firebaseapp.com",
  projectId: "jhmoonnight",
  databaseURL: "https://jhmoonnight-default-rtdb.firebaseio.com",
  storageBucket: "jhmoonnight.appspot.com",
  messagingSenderId: "203686556208",
  appId: "1:203686556208:android:e675e73a5addf92913f3f5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const renderProperties = (object) => {
  return Object.keys(object).map((property) => {
    const value = object[property];
    if (typeof value === 'object') {
      return (
        <div key={property}>
          {property}: {renderProperties(value)}
        </div>
      );
    } else {
      return (
        <div key={property}>
          {property}: {value}
        </div>
      );
    }
  });
};

const Homepage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

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
        setFilteredData(dataArray); // Initialize filteredData with all data
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

  const handleScroll = (direction) => {
    const scrollAmount = 300; // You can adjust this value based on your preference

    if (direction === 'up') {
      window.scrollTo({
        top: window.scrollY - scrollAmount,
        behavior: 'smooth',
      });
    } else if (direction === 'down') {
      window.scrollTo({
        top: window.scrollY + scrollAmount,
        behavior: 'smooth',
      });
    } else if (direction === 'bottom') {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const filtered = data.filter((item) => {
      return item.key.includes(searchQuery) ||
        JSON.stringify(item.value).includes(searchQuery);
    });

    setFilteredData(filtered);
  }, [searchQuery, data]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Homepage</h2>
      <div className="mb-3">
        <button
          className="btn btn-primary mr-2"
          onClick={() => handleScroll('up')}
        >
          Scroll Up
        </button>
        <button
          className="btn btn-primary mr-2"
          onClick={() => handleScroll('down')}
        >
          Scroll Down
        </button>
        <button
          className="btn btn-primary"
          onClick={() => handleScroll('bottom')}
        >
          Scroll to Bottom
        </button>
      </div>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredData.map((item, index) => (
        <div key={item.key} className="mb-3">
          <h6>SN: {filteredData.length - index}</h6>
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h6 className="card-title">ID: {item.key}</h6>
              </div>
              <div className="card-text">
                {renderProperties(item.value)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Homepage;
