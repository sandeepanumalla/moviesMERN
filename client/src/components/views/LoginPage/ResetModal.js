import React from 'react'
import { Redirect, useHistory } from 'react-router-dom';
import './ResetModal.css';

const ResetModal = (props) => {
    const history = useHistory();
    const toggleAlert = () =>{
        return props.setShowAlert(!props.showAlert);
    }
   
    // const handleClick = () =>{
    //     return history.push('/change-password')
    // }
    
    return (
       <React.Fragment>
        <div onClick={()=>{ console.log("clickedModal");toggleAlert()}} className={ props.showAlert ? `Modal`:`Modal hiddenOverlay`}>
        </div>
         <div className={ props.showAlert ? `main_modal`:`main_modal hidden none`}>
         
         <div className='modal_header'>
         <div className='modal_title' >
         {
             props.isSuccess ? 
              <p>we have sent your password reset link and instructions at your email address</p>
              :
              <p>user does not exist with this email</p>
         }
        
         </div>     

        </div>
        {
            //<div onClick={()=>{handleClick()}} className="btn_class"><button className="btn_login">Continue</button></div>
      
        }
         </div>
         </React.Fragment>
        
    )
}

export default ResetModal
