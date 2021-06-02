/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { useHistory, withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";

function RightMenu(props) {
  const history = useHistory();
  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };

  const profileHandler = ()=>{
    return history.push('/profile');
  }

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login" style={{textDecoration:'none'}}>Sign In</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register" style={{textDecoration:'none'}}>Register</a>
        </Menu.Item>
      </Menu>
    )
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="logout">
          <a onClick={logoutHandler} style={{textDecoration:'none'}}>Logout</a>
        </Menu.Item>
        <Menu.Item key="profile">
          <a onClick={profileHandler} style={{textDecoration:'none'}}>Profile</a>
        </Menu.Item>
      </Menu>
    )
  }
}

export default withRouter(RightMenu);