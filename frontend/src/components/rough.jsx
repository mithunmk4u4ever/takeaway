import React from 'react'

export default function Rough() {
    const userEmail = 'qwe@gmail.com';
const newuser = async () => {
    
    try {
        const response = await fetch('http://localhost:3300/api/finduser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userEmail }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
            // Handle successful response
            console.log(data);
        } else {
            // Handle error response
            console.error(data.error);
        }
    } catch (error) {
        // Handle network or other errors
        console.error(error);
    }
}
  return (
    <div>
        <button onClick={newuser}>find</button>
    </div>
  )
}



