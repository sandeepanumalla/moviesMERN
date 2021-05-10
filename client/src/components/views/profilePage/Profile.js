
import { blue } from '@material-ui/core/colors'
import { Card, Descriptions } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_KEY, API_URL } from '../../Config'
import './profile.css'


const Profile = (props) => {
    const [details,setDetails] = useState();
    const [avatar,setAvatar] = useState();
    const [favorites,setFavorites] = useState();
    const [ratings,setRatings] = useState();

    useEffect(()=>{
        if(props.user.userData !== undefined){
            setDetails(props.user.userData);
            setAvatar(props.user.userData.image);
            console.log('props',props.user.userData.image)
        }
    },[props.user.userData])
const fetchRating = async (item) =>{
     const dataPromise = await fetch(`${API_URL}movie/${item}?api_key=${API_KEY}&language=en-US`);
    return dataPromise.json();
}
    useEffect(() => {
        let array = [];
        favorites && favorites.map(async item =>{
            array.push(item.movieId);
            
        })
        const fetchLoop = async ()=>{
            const dataPromise = await Promise.all( array.map(e=>{
                const data =  fetchRating(e);
                return data;
            }))
            console.log("data",dataPromise);
            setRatings(dataPromise);
        }
        
        fetchLoop();
        
    },[favorites])
    console.log("profile",props.user.userData);
    let variable = { userFrom: localStorage.getItem('userId') }

    const fetchFavoredMovie = () => {
        axios.post('/api/favorite/getFavoredMovie', variable)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.favorites)
                    setFavorites(response.data.favorites)
                } else {
                    alert('Failed to get favored movie')
                }
            })
    }

    useEffect(() => {
        fetchFavoredMovie();
    },[details])
    const style ={
        
        background: `url(${avatar})`,
        backgroudSize: 'cover'
    }
    
    let count = 0;
    return (
        <div>
            <div className="section1">
                <div style={style} className="image_container">
                </div>
                <div className="details_container">
                <div className="table_header">
                    <h3>Your details</h3>
                </div>
                <table class="table">
                
                <tbody>
                  <tr>
                    <th className="name" scope="row">Name</th>
                    <td>{details && details.name}</td>
                    
                  </tr>
                  <tr>
                    <th className="name" scope="row">E-mail</th>
                    <td>{details && details.email}</td>
                    
                  </tr>
                 
                </tbody>
              </table>
                </div>
            </div>
            <div className="section2">
                    <div>
                     <h3>Your Favourite Movies</h3>
                    </div>
                    <table class="table">
                    <thead>
                   
                    <tr>
                        <th scope="col">Sr. No</th>
                        <th scope="col">Favourite Movies</th>
                        <th scope="col">Average Rating</th>
                    </tr>
                    </thead>
                    <tbody>
                    
                        
                        {
                           
                        favorites && favorites.map(item =>{
                            count++;
                            return <tr ><th>{count}</th>  
                                      <td>{item.movieTitle}</td>  
                                      {ratings && ratings.map(e =>{
                                          
                                          if(e.title == item.movieTitle) 
                                           return <td>{e.vote_average}</td>
                                          
                                      })
                                    
                                        }
                                      </tr>
                        })
                    }
                    
                    </tbody>
                </table>
            </div>
            
        </div>
    )
}

export default Profile

/* 
 <div className="site-card-border-less-wrapper">
            <Card style={style} title="Card title" bordered={false} style={{ width: 300 }}>
                
            </Card>
        </div>
*/