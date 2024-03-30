import {useContext, useState} from 'react'
import { myContext } from './ContextReducer';

const Carousel = () => {
   const {items,filtered,setFiltered}=useContext(myContext)
   const [searchQuery,setSearchQuery]=useState("")
   

   const handleSearch=(e)=>{
    const query=e.target.value
    setSearchQuery(query)

    const searchData=items.filter(data=>{
        const {name,CategoryName,description}=data

        return(
            name.toLowerCase().includes(query.toLowerCase())||
            CategoryName.toLowerCase().includes(query.toLowerCase())||
            description.toLowerCase().includes(query.toLowerCase())
        )
    })
    setFiltered(searchData)
   }

   console.log("props",items);

    return (
        <div>
            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" style={{'objectFit':'contain !important'}}>
                <div className="carousel-indicators" >
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner" style={{'maxHeight':'500px'}}>

                    <div className="carousel-caption" style={{'zIndex':1}}>
                        <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={searchQuery} onChange={handleSearch}/>
                                <button className="btn btn-outline-success bg-success text-light" type="submit" onSubmit={handleSearch}>Search</button>
                        </form>
                    </div>

                    <div className="carousel-item active">
                        <img src="https://source.unsplash.com/random/900x700/?burger" className="d-block w-100" alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://source.unsplash.com/random/900x700/?chicken_biriyani" className="d-block w-100" alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://source.unsplash.com/random/900x700/?pizza" className="d-block w-100" alt="..." />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    )
}

export default Carousel