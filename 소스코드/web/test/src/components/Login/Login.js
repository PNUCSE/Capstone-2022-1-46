import React, { useState, useReducer } from "react";

import classes from "./Login.module.css";
import Button from "@mui/material/Button";



const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: true };
  }
  if (action.type === "CONF_VALID") {
    return { value: state.value, isValid: true };
  }
  return { value: "", isValid: false };
};

const Login = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    valid: false,
  });

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
    setFormIsValid(emailState.isValid && enteredPassword.trim().length > 1);
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
    setFormIsValid(emailState.isValid && event.target.value.trim().length > 1);
  };

  const validateEmailHandler = () => {
    dispatchEmail({
      type: "CONF_VALID",
    });
  };

  const validatePasswordHandler = () => {
    setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const BuyerOrSellerAPI = () => {
    
    setIsLoading(true);
    fetch(`/api/logininfo/${emailState.value}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setIsLoading(false);
      props.onRec(data.rec);
      props.onAsset(data.krw);
    });
    setIsLoading(true);
    fetch(`/api/tax`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setIsLoading(false);
      props.onTax(data);
    });
    
  }

  const AdminAPI = () => {
    setIsLoading(true);
    fetch(`/api/tax`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setIsLoading(false);
      props.onTax(data);
    });
  }

  const submitHandler = (event) => {
    event.preventDefault();
    if(!(emailState.value === "Seller_User1" || emailState.value === "Seller_User2" || emailState.value === "Buyer_User1" || emailState.value === "Buyer_User2" || emailState.value === "koreapower_admin" || emailState.value === "tax_admin")){
      props.onValid(true);
      return;
    }
    if(emailState.value === "Seller_User1" || emailState.value === "Seller_User2"){
      BuyerOrSellerAPI();
      props.onID(emailState.value);
      props.onSellerLogin();
      props.onRole("seller");
    }
    else if(emailState.value === "koreapower_admin"){
      AdminAPI();
      props.onID(emailState.value);
      props.onAdminLogin();
      props.onRole("admin");
    }
    else if (emailState.value === "tax_admin"){
      AdminAPI();
      props.onID(emailState.value);
      props.onTaxAdminLogin();
      props.onRole("taxAdmin");
    }
    else{
      BuyerOrSellerAPI();
      props.onID(emailState.value);
      props.onBuyerLogin();
      props.onRole("buyer");
    }
  };

  return (
    <React.Fragment>
      {isLoading && <p> now login...</p>}
      {!isLoading &&
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">아이디</label>
          <input
            type="text"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordIsValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" variant="contained" disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>}
    </React.Fragment>
  );
};

export default Login;
