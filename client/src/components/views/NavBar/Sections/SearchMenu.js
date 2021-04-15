import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { Menu } from 'antd';
import { Input } from 'antd';
import LandingPage from '../../LandingPage/LandingPage';
import { connect, useDispatch } from 'react-redux';
import { addSearchResult, showInitialResult, typing } from '../../../../actions/user_actions';
import axios from 'axios';


const SearchMenu = (props) => {
   
    const [searchTerm, setSearchTerm] = useState("");
    /* const [debouncedTerm,setDebouncedTerm] = useState(""); */
    const [searchResult, setSearchResult] = useState([]);

    const { Search } = Input;
    const onSearch = value => console.log(value);

    const dispatch = useDispatch();

    function searchChangeHandler(e) {
        e.preventDefault();
        console.log(e.target.value);
        setSearchTerm(e.target.value.trim());
        //<LandingPage props.searchItem={(e.target.value)} />
    }
    console.log("searchTerm = " + searchTerm);
    


    useEffect(() => {

        
        const fetch = async()=>{
             dispatch(addSearchResult(searchTerm))
        }
        if(searchTerm === "" || searchTerm.length === 0){
                 dispatch(showInitialResult());
        }
        else{
            dispatch(typing(true))
            

            const timeoutId = setTimeout(() =>{
                if(searchTerm != '' || searchTerm.length == 0){
                    fetch() 
                    dispatch(typing(false));
                       console.log("running now");
                }
             },500)
           
             return()=>{
                console.log("cleanup");
                clearInterval(timeoutId);
            }  
        }
        
    },[searchTerm])

    useEffect(() => {
        const fetchData =async ()=>{
            return await axios.get(`${props.data}`)
        .then(response=> {
          
            setSearchResult(response.data.results)
        })
        .catch(error=>console.log("error",error))
        }
        fetchData()
    },[props.status])

   

console.log("props",props);
console.log("response",searchResult[0]);

    return (
        <div className="searchMenu">
            <Menu mode={props.mode} />
            <div>
                <Search
                placeholder="Search"
                allowClear onSearch={onSearch}
                style={{ width: 400 }}
                onChange={(e) => searchChangeHandler(e)}
                 /> 
                    {window.location.pathname.includes('/movie')  && !props.status &&
                        <div className="search_results" >
                        
                        
                                {searchResult.slice(0,6).map(result => <ul class="list-group">
                                    <li key={result.id} class="list-group-item ">
                                        <a href={`/movie/${result.id}`}>{result.original_title}</a>
                                    </li>
                                </ul>
                                )
                            }
                       
                     </div>
                    }
            </div>
            
            
            

            {/*
            console.log("Search Term = " + searchTerm);
           <LandingPage search={searchTerm}/>
            */}
        </div>
    )
}

const mapStateToProps = (state)=>{
    return {data: state.searchResult.s,
    status: state.searchResult.status
    }
}


export default connect(mapStateToProps,null)(SearchMenu);