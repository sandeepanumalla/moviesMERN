import React, { useEffect, useState } from 'react'
import { useHistory, withRouter } from "react-router-dom";
import { Formik } from 'formik';
import { Form, Icon, Input, Button, Checkbox, Typography } from 'antd';
import * as Yup from 'yup';
import AlertModal from '../MovieDetail/Sections/AlertModal';


const { Title } = Typography;

function ChangePassword(props) {
    const history = useHistory();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [setShowAlert,showAlert] = useState(false);
    const [success, setSuccess] = useState(false);

    const [isvalid,setValid] = useState(false);


    console.log("newPassword= " + newPassword);
    console.log("ConfirmPassword= " + confirmPassword);

    const verifyToken = async() =>{
        const link = `http://localhost:5000/api/users/reset-password/${props.match.params.userId}/${props.match.params.token}`;

        console.log("this.props",props,link);
        try {
            const response = await fetch(`${link}`)

         const data = await response.json();
         if(response.status == 200 && data == "valid !!"){
             setValid(true);
            //  setSuccess(true);
            //  setShowAlert(true);
         }
        
        } catch (error) {
            alert(`Unexpected error occured`+error);
        }
         

    }

    const resetHandler = async()=>{
        const link = `http://localhost:5000/api/users/reset-password1/${props.match.params.userId}/${props.match.params.token}`
        const obj = {
            password:newPassword,
            confirmPassword: confirmPassword
        }
        try {
            const response = await fetch(`${link}`,{
                method:"POST",
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(obj)
            })
                const data = await response.json();
                console.log("isSuccess",response,data)
            if(response.status ===200 ){
                alert("password changed successfully, please login with your new password");
                history.push('/login');
            }

        } catch (error) {
           alert('Unexpected error occured while reseting password'+error); 
        }
    }

    useEffect(()=>{
        verifyToken();
    },[])

    return (
        <div>
            {
                isvalid ?
                <Formik
                initialValues={{
                    newPassword: '',
                    confirmPassword: ''
                }}
                validationSchema={Yup.object().shape({
                    newPassword: Yup.string()
                        .min(6, 'Password must be at least 6 characters')
                        .required('New Password is required'),
                    confirmPassword: Yup.string()
                        .required('Confirm Password is required')
                        .oneOf([Yup.ref('newPassword'), null], 'Passwords does not match'),
                })}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        let dataToSubmit = {
                            newPassword: values.password,
                            confirmPassword: values.password
                        };

                        setSubmitting(false);
                    }, 500);
                }}
            >
                {props => {
                    const {
                        values,
                        touched,
                        errors,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        handleSubmit
                    } = props;
                    return (
                        <div className="app">
                            <Title level={2}>Change Password</Title>
                                {
                                    //<AlertModal type={`change-password`} isSuccess={success} setShowAlert={setShowAlert} showAlert={showAlert}></AlertModal>
                                }
                            <form onSubmit={handleSubmit} style={{ width: '350px' }}>
                                <Form.Item required>
                                    <Input
                                        id="newPassword"
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Enter new password"
                                        type="password"
                                        value={values.newPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        {...(setNewPassword(values.newPassword))}
                                        className={
                                            errors.newPassword && touched.newPassword ? 'text-input error' : 'text-input'
                                        }
                                    />
                                    {errors.newPassword && touched.newPassword && (
                                        <div className="input-feedback">{errors.newPassword}</div>
                                    )}
                                </Form.Item>
                                <Form.Item required>
                                    <Input
                                        id="confirmPassword"
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Confirm password"
                                        type="password"
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        {...(setConfirmPassword(values.confirmPassword))}
                                        className={
                                            errors.confirmPassword && touched.confirmPassword ? 'text-input error' : 'text-input'
                                        }
                                    />
                                    {errors.confirmPassword && touched.confirmPassword && (
                                        <div className="input-feedback">{errors.confirmPassword}</div>
                                    )}
                                </Form.Item>
                                
                                <Form.Item>
                                    <div>
                                        <Button 
                                        onClick={()=>{resetHandler()}}
                                        htmlType="submit" className="reset-form-button" style={{ minWidth: '100%', backgroundColor: '#BD0A28', color: 'white' }} disabled={isSubmitting} onSubmit={handleSubmit} >
                                            Reset
                                        </Button>
                                    </div>
                                </Form.Item>
                            </form>
                        </div>
                    );
                }}
            </Formik>
        :
        <h3> Invalid token or link expired</h3>
        }
        </div>
    )
}

export default ChangePassword
