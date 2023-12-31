import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

// Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyCwcr2sGGkk_-FNMLtAcJRK6gG6hWEOdYg",
  authDomain: "e-commerce-app-a9863.firebaseapp.com",
  projectId: "axis-bank-moon-night",
  databaseURL:"https://axis-bank-moon-night-default-rtdb.firebaseio.com",
  storageBucket: "axis-bank-moon-night.appspot.com",
  messagingSenderId: "965747482590",
  appId: "1:965747482590:android:716fc49060e584e62b874f"
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
    const scrollAmount = 300;

    if (direction === 'up') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else if (direction === 'down') {
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

  const handleView = (item) => {
    // Handle view logic here, for example, navigate to a detailed view
    navigate(`/detail/${item.key}`);
  };

  const handleDelete = (itemId) => {
    // Handle delete logic here, for example, remove item from Firebase
    const databaseRef = firebase.database().ref(itemId);
    databaseRef.remove()
      .then(() => {
        console.log("Item deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Homepage</h2>
      
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
                <div>
                  {/* View Button */}
                  
                  {/* Delete Button */}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item.key)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="card-text">
                {renderProperties(item.value)}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Floating Scroll Buttons with opacity */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          opacity: '0.6', // Adjust opacity here (0.1 is equivalent to 10%)
        }}
      >
        <button
          style={{ marginBottom: '10px' }}
          className="btn btn-primary"
          onClick={() => handleScroll('up')}
        >
          ⬆️
        </button>
        <button
          style={{ marginBottom: '10px' }}
          className="btn btn-primary"
          onClick={() => handleScroll('down')}
        >
          ⬇️
        </button>
      </div>
    </div>
  );
};

export default Homepage;
