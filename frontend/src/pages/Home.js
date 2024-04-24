import React, { useContext } from 'react';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'

import Card from '../components/Card'
import Carousel from '../components/Carousel'
import { myContext } from '../components/ContextReducer';


const Home = () => {

  const {items, setItems,category, setCategory,filtered,setFiltered}= useContext(myContext)

  const token=localStorage.getItem("authToken")
  const loadData = async () => {
    const response = await fetch("http://localhost:3300/api/foodData", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
    const data = await response.json()
    console.log("food", data)
    setItems(data[0])
    setCategory(data[1])
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div>
      <div><Navbar/></div>
      <div><Carousel /></div>
  
      <div className='container'>
        {
          filtered && filtered.length > 0 ?
            filtered.map((mapeditem) =>
              <div key={mapeditem._id} className='col-12 col-md-6 col-lg-3 m-2'>
                <Card foodItem={mapeditem} options={mapeditem.options[0]} />
              </div>
            )
            :
            category ?
              category.map((data) =>
                <div className='mb-3 row'>
                  <div key={data._id} className='fs-3 m-3'>
                    {data.CategoryName}
                  </div>
                  <hr />
                  {
                    items ? items.filter((item) => item.CategoryName === data.CategoryName).map((mapeditem) =>
                      <div key={mapeditem._id} className='col-12 col-md-6 col-lg-3 m-2'>
                        <Card foodItem={mapeditem} options={mapeditem.options[0]} />
                      </div>
                    )
                      : ""
                  }
                </div>
              )
              : ""
        }
      </div>
      <button onClick={loadData}>Load</button>
      <div><Footer /></div>
    </div>
  );
  
}

export default Home