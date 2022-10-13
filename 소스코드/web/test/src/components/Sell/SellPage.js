import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import { useState } from "react";
import ErrorSellPage from "./ErrorSellPage";
import {TextField} from "@mui/material";

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

const SellPage = (props) => {
  const [isValid, setIsValid] = useState(false);
  const [insertRec, setInsertRec] = useState(0);
  const [insertPrice, setInsertPrice] = useState(0);


  const recChangeHandler = (event) =>{
    setInsertRec(event.target.value);
  }

  const priceChangeHandler = (event) =>{
    setInsertPrice(event.target.value);
  }

  async function submitRECHandler (event) {
    event.preventDefault();
    if(props.myRec < Number(insertRec) || Number(insertRec) <= 0){
        setIsValid(true);
        return;
    }
    else{
      postSellRECData();
      props.handleClose();
    }
  };

  async function submitKRWHandler (event) {
    event.preventDefault();
    if(insertPrice <= 0){
        setIsValid(true);
        return;
    }
    else{
      postSellKRWData();
      props.handleClose();
    }
  };

  async function postSellRECData(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    props.onIsLoading(true);
    
    const SellRECData = JSON.stringify({
      id: props.myID,
      rec: Number(insertRec),
    });

    try{
      const response = await fetch(`/api/Market/upREC`, {
        method: 'POST',
        headers: myHeaders,
        body: SellRECData,
        redirect: 'follow'
      });
      if(!response.ok){
        throw new Error('market등록 실패1')
      }
      const data = await response.json();
      props.onMyRec(props.myRec - Number(insertRec));
      console.log(JSON.stringify(data));
      console.log("postsell1");
    }catch(error){
      console.log(error.message);
      return;
    }
    props.onIsLoading(true);
    try{
      const response = await fetch(`/api/Market`);
      if(!response.ok){
        throw new Error('데이터 받아오기 실패')
      }

      const data = await response.json();


      const transformedData = data.map((marketData) => {
        return {
          KRW: marketData.krw,
          REC: marketData.rec,
          seller: marketData.seller,
          id: marketData.id,
          allKRW: marketData.krw * marketData.rec,
        };
      });
      props.onSellRow(transformedData);
      props.onIsLoading(false);
      console.log("sellonshow");
    }catch (error){
      console.log(error.message);
    }
  }

  async function postSellKRWData(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    props.onIsLoading(true);

    const SellKRWData = JSON.stringify({
      id: props.myID,
      krw: Number(insertPrice),
    });
    
    try{
      const response = await fetch(`/api/Market/upKRW`, {
        method: 'POST',
        headers: myHeaders,
        body: SellKRWData,
        redirect: 'follow'
      });
      if(!response.ok){
        throw new Error('market등록 실패2')
      }
      const data = await response.json();
      console.log(JSON.stringify(data));
      console.log("postsell2");
    }catch(error){
      console.log(error.message);
    }
    props.onIsLoading(true);
    try{
      const response = await fetch(`/api/Market`);
      if(!response.ok){
        throw new Error('데이터 받아오기 실패')
      }

      const data = await response.json();


      const transformedData = data.map((marketData) => {
        return {
          KRW: marketData.krw,
          REC: marketData.rec,
          seller: marketData.seller,
          id: marketData.id,
          allKRW: marketData.krw * marketData.rec,
        };
      });
      props.onSellRow(transformedData);
      props.onIsLoading(false);
      console.log("sellonshow");
    }catch (error){
      console.log(error.message);
    }
  }

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form onSubmit={submitRECHandler}>
              <h2>판매를 원하는 rec 갯수를입력해주세요. (자연수)</h2>
              <TextField margin="dense" label="rec 갯수" onChange={recChangeHandler} inputProps={{type:"number"}} />
              <div/>
              <Button type="submit" variant="contained">
                submit
              </Button>
            </form>
            <form onSubmit={submitKRWHandler}>
              <h2>판매를 원하는 rec의 개당 가격을 입력해주세요. (자연수)</h2>
              <TextField margin="dense" label="개당 가격" onChange={priceChangeHandler} inputProps={{type:"number"}} />
              <div/>
              <Button type="submit" variant="contained">
                submit
              </Button>
            </form>
          </Typography>
        </Box>  
      </Modal>
      <ErrorSellPage open={isValid} onValid={setIsValid}></ErrorSellPage>
    </div>
  );
};

export default SellPage;
