import React from 'react'
import axios from 'axios'

function Admindashboard() {

    const handleUser=async ()=>{
        try {
            const response=await axios.get("http://localhost:3300/api/admin/userdata")
           console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div>
        <button onClick={handleUser}>Users' Data</button>
    </div>
  )
}

export default Admindashboard