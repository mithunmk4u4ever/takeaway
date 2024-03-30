import React, { useState } from 'react'

const NewSession = () => {

    const [state,setState]=useState(false)

    const handleSetData=()=>{
        setState(true)
        sessionStorage.setItem("key",state)
    }
    const handleGetData=()=>{
       let key= sessionStorage.getItem("key")
       console.log(key,typeof(key))
       
    }
  return (
    <div>
        <button onClick={handleSetData}>button</button>
        <button onClick={handleGetData}>button2</button>
    </div>
  )
}

export default NewSession