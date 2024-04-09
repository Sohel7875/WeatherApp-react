import React from 'react'

const SearchEngine = ({ setLocation, search}) => {

  const handleKeyPress =(event) =>{
    if(event.key ==="Enter"){
      performanceSearch();
    }
  }

  const handleclick = () =>{
    performanceSearch();
  }

  const performanceSearch =() =>{
    search();
  }
  
    return (
        <div className="SearchEngine">
          <input
            type="text"
            className="city-search"
            placeholder="enter city name"
            name="location"
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleclick}><i className="fas fa-search" style={{ fontSize: "18px" }}></i></button>
        </div>
      );
    }

export default SearchEngine