

import React from 'react';

function PopUp({ message, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '300px',
      height: '150px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '15px',
      backgroundColor: 'grey',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      zIndex: 1000
    }}>
      <p>{message}</p>
      <button onClick={onClose}>OK</button>
    </div>
  );
}

export default PopUp;

