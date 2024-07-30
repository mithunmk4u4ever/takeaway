import React, { useState } from 'react';
import PopUp from './PopUp';

function App() {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setPopupMessage('');
  };

  return (
    <div>
      <button onClick={() => showPopup('Registration Successful!')}>Register</button>
      <button onClick={() => showPopup('Login Successful!')}>Login</button>

      {isPopupVisible && <PopUp message={popupMessage} onClose={closePopup} />}
    </div>
  );
}

export default App;
