import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd';
import './LikeDislikes.css';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import AlertModal from './AlertModal';


function LikeDislikes(props) {
    const user = useSelector(state => state.user)

    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null);
    const [showAlert,setShowAlert] = useState(false);
    const [DislikeAction, setDislikeAction] = useState(null);

    let variable = {};

    if (props.movie) {
        variable = { movieId: props.movieId, userId: props.userId }
    } else {
        variable = { commentId: props.commentId, userId: props.userId }
    }
   const getLikes = async ()=>{
       const response = await fetch(`http://localhost:5000/api/movieLikes/getMovieLikes/${props.movieId}`,{
           method:"GET",
           headers:{
            Accept:'application/json',
            'Content-Type':'application/json'
        },
       
       })
       const data = await response.json()
       console.log("likes data",data)
       if(response.status == 200){
           setLikes(data);
       }
   }
   const getDislikes = async ()=>{
       
    const response = await fetch(`http://localhost:5000/api/movieDisLikes/getMovieDislikes/${props.movieId}`,{
        method:"GET",
        headers:{
         Accept:'application/json',
         'Content-Type':'application/json'
     },
    
    })
    const data = await response.json()
    if(response.status == 200){
        setLikes(data);
    }
}

    useEffect(() => {

       getLikes();
       getDislikes();

    }, [])

    const toggleAlert = () =>{
        return setShowAlert(!showAlert);
    }
    const onLike = () => {

        if (user.userData && !user.userData.isAuth) {
            return setShowAlert(true)
        }

        if (LikeAction === null) {

            Axios.post(`http://localhost:5000/api/movieLikes/addmovieLikes/${props.userId}/${props.movieId}`)
                .then(response => {
                    if (response.status == 200) {

                        setLikes(Likes + 1)
                        setLikeAction('liked')

                        if (DislikeAction !== null) {
                            setDislikeAction(null)
                            setDislikes(Dislikes - 1)
                        }


                    } else {
                        alert('Failed to increase the like')
                    }
                })


        } else {

            Axios.post('/api/like/unLike', variable)
                .then(response => {
                    if (response.data.success) {

                        setLikes(Likes - 1)
                        setLikeAction(null)

                    } else {
                        alert('Failed to decrease the like')
                    }
                })

        }

    }


    const onDislike = () => {

        if (user.userData && !user.userData.isAuth) {
             return setShowAlert(true)
        }

        if (DislikeAction !== null) {

            Axios.post('/api/like/unDislike', variable)
                .then(response => {
                    if (response.data.success) {

                        setDislikes(Dislikes - 1)
                        setDislikeAction(null)

                    } else {
                        alert('Failed to decrease dislike')
                    }
                })

        } else {

            Axios.post('/api/like/upDislike', variable)
                .then(response => {
                    if (response.data.success) {

                        setDislikes(Dislikes + 1)
                        setDislikeAction('disliked')

                        //If dislike button is already clicked
                        if (LikeAction !== null) {
                            setLikeAction(null)
                            setLikes(Likes - 1)
                        }

                    } else {
                        alert('Failed to increase dislike')
                    }
                })
        }
    }

    return (
        <React.Fragment>
        <AlertModal setShowAlert={setShowAlert} showAlert={showAlert}/>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike} />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Likes.length}</span>
            </span>&nbsp;&nbsp;&nbsp;&nbsp;
            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon
                        type="dislike"
                        theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDislike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Dislikes.length}</span>
            </span>
               

            
        </React.Fragment>
    )
}

export default LikeDislikes
