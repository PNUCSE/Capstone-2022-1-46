import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import ErrorBuyPage from "./ErrorBuyPage";
import Card from "../../UI/Card/Card"

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

const BuyPage = (props) => {
  const [isValid, setIsValid] = useState(false);
  const [insertRec, setInsertRec] = useState(0);

  const recChangeHandler = (event) =>{
    setInsertRec(event.target.value);
  }

  async function submitHandler (event) {
    event.preventDefault();
    if(0 >= props.buyRec*insertRec || props.myAsset < (0.01 * (Number(props.tax)) + 1) * (props.buyRec*insertRec) || insertRec > props.buyNum){
        setIsValid(true);
        return;
    }
    else{
      putBuyData();
      props.handleClose();
    }
  }

  async function putBuyData() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const SellData = JSON.stringify({
      "id": props.itemID,
      "buyer": props.myID,
      "krw": parseInt((0.01 * Number(props.tax) + 1) * props.buyRec * insertRec),
      "rec": Number(insertRec)
    });
    try{
      props.onIsLoading(true);
      const response = await fetch(`/api/Market/trade`, {
        method: 'POST',
        headers: myHeaders,
        body: SellData,
        redirect: 'follow'
      });

      if(!response.ok){
        throw new Error('Buying fail');
      }
  
      const data = await response.json();

      props.onIsLoading(false);
      console.log(JSON.stringify(data));
      console.log("postsell");
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
      props.onMyRec(Number(props.myRec) + Number(insertRec));
      props.onMyAsset(props.myAsset - parseInt((0.01 * Number(props.tax) + 1) * props.buyRec * insertRec));
      props.onSellRow(transformedData);
      props.onIsLoading(false);
      console.log("buyonshow");
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
          <h2>구매를 원하는 rec 갯수를 입력해주세요.(자연수)</h2>
            <Card>
              <p>rec 개당 가격(₩): {props.buyRec}</p>
              <p>rec 갯수: {props.buyNum}</p>
              <p>판매자: {props.buyID}</p>
            </Card>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form onSubmit={submitHandler}>              
              <TextField margin="dense" label="rec 갯수" onChange={recChangeHandler} inputProps={{type:"number"}} />
              <p>총 가격(세금 포함)(₩): {parseInt((0.01 * Number(props.tax) + 1) * props.buyRec * insertRec)}</p>
              <Button type="submit" variant="contained">
                submit
              </Button>
            </form>
          </Typography>
        </Box>  
      </Modal>
      <ErrorBuyPage open={isValid} onValid={setIsValid}></ErrorBuyPage>
    </div>
  );
};

export default BuyPage;
