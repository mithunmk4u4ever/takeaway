// import React from 'react';
// import ReactDOM from 'react-dom';

// const Model_Styles = {
//     position: "fixed",
//     top: "50px",
//     left: "50px",
//     backgroundColor: "rgb(34,34,34",
//     zIndex: "100",
//     height: "90%",
//     width: "90%"
// };

// const Overlay_Styles = {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     zIndex: "100"
// };

// function Model({ children, onClose }) {
//     return ReactDOM.createPortal(
//         <div>
//             <div style={Overlay_Styles}></div>
//             <div style={Model_Styles}>
//                 <button className='btn btn-danger fs-4' style={{ marginLeft: "90%", marginTop: "-35px" }} onClick={onClose}>X</button>
//                 {children}
//             </div>
//         </div>,
//         document.getElementById('cart-root')
//     );
// }

// export default Model;
