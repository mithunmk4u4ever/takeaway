import React from 'react'

function VerificationModal({onClose}) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Address and Payment Verification</h2>
        {/* Add form fields for address and payment verification */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default VerificationModal