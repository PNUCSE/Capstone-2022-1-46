import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import { useState } from "react";
import {TextField} from "@mui/material";
import ErrorChargingPage from "./ErrorChargingPage";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ChargingPage = (props) => {
  const [insertREC, setInsertTax] = useState(0);
  const [insertKRW, setInsertKRW] = useState(0);

  const [chargingIsValid, setChargingIsValid] = useState(false);


  const submitrecHandler = (event) => {
    event.preventDefault();
    if(Number(props.rec) + Number(insertREC) < 0){
      setChargingIsValid(true);
      return;
    }
    postChargingrecData();
    props.onRec(Number(props.rec) + Number(insertREC));
    props.onChargingClose();
  };

  const submitkrwHandler = (event) => {
    event.preventDefault();
    if(Number(props.asset) + Number(insertKRW) < 0){
      setChargingIsValid(true);
      return;
    }
    postChargingkrwData();
    props.onAsset(Number(props.asset) + Number(insertKRW));
    props.onChargingClose();
  };

  const REChangeHandler = (event) => {
    setInsertTax(event.target.value);
  }

  const KRWchangeHandler = (event) => {
    setInsertKRW(event.target.value);
  }

  async function postChargingrecData(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const SellData = JSON.stringify({
      id: props.myID,
      rec: insertREC,
    });
    if(insertREC > 0){
      try{
        const response = await fetch(`/api/makeREC`, {
          method: 'POST',
          headers: myHeaders,
          body: SellData,
          redirect: 'follow'
        });
  
        if(!response.ok){
          throw new Error('Charging rec fail');
        }
        const data = await response.json();
        props.onRec(props.rec + Number(insertREC));
        console.log(JSON.stringify(data));
        console.log("postchargingrec");
      }catch(error){
        console.log(error.message);
      }
    }
    else if(insertREC < 0){
      try{
        const response = await fetch(`/api/makeREC`, {
          method: 'POST',
          headers: myHeaders,
          body: SellData,
          redirect: 'follow'
        });
  
        if(!response.ok){
          throw new Error('minus rec fail');
        }
        const data = await response.json();
        props.onRec(props.rec + Number(insertREC));
        console.log(JSON.stringify(data));
        console.log("postminusrec");
      }catch(error){
        console.log(error.message);
      }
    }
    else{
      setChargingIsValid(true);
    }
  }


  async function postChargingkrwData(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const SellData = JSON.stringify({
      id: props.myID,
      krw: insertKRW,
    });
    if(insertKRW > 0){
      try{
        const response = await fetch(`/api/chargeKRW`, {
          method: 'POST',
          headers: myHeaders,
          body: SellData,
          redirect: 'follow'
        });
  
        if(!response.ok){
          throw new Error('Charging krw fail');
        }
        const data = await response.json();
        props.onAsset(props.asset + Number(insertKRW));
        console.log(JSON.stringify(data));
        console.log("postchargingkrw");
      }catch(error){
        console.log(error.message);
      }
    }
    else if(insertKRW < 0){
      try{
        const response = await fetch(`/api/chargeKRW`, {
          method: 'POST',
          headers: myHeaders,
          body: SellData,
          redirect: 'follow'
        });
  
        if(!response.ok){
          throw new Error('minus krw fail');
        }
        const data = await response.json();
        props.onAsset(props.asset + Number(insertKRW));
        console.log(JSON.stringify(data));
        console.log("postminuskrw");
      }catch(error){
        console.log(error.message);
      }
    }
    else{
      setChargingIsValid(true);
    }
  }


  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.onChargingClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form onSubmit={submitrecHandler}>
              <h2>충전하거나 빼가고싶은 rec양을 입력하세요. (정수)</h2>
              <TextField margin="dense" label="REC" onChange={REChangeHandler} inputProps={{type:"number"}} />
              <div/>
              <Button type="submit" variant="contained">
                submit
              </Button>
            </form>
            <form onSubmit={submitkrwHandler}>
              <h2>충전하거나 빼가고싶은 자산양을 입력하세요.</h2>
              <TextField margin="dense" label="KRW" onChange={KRWchangeHandler} inputProps={{type:"number"}} />
              <div/>
              <Button type="submit" variant="contained">
                submit
              </Button>
            </form>
          </Typography>
        </Box>  
      </Modal>
      {chargingIsValid && <ErrorChargingPage open={chargingIsValid} onValid={setChargingIsValid}></ErrorChargingPage>}
    </div>
  );
};

export default ChargingPage;
