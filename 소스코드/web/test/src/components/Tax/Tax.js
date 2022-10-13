import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import { useState } from "react";
import ErrorTaxPage from "./ErrorTaxPage";
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

const Tax = (props) => {
  const [taxIsValid, setTaxIsValid] = useState(false);
  const [insertTax, setInsertTax] = useState(0);


  const submitHandler = (event) => {
    event.preventDefault();
    if(insertTax < 0 || insertTax > 100){
      setTaxIsValid(true);
      return;
    }
    props.onTax(insertTax);
    postTaxData();
    props.onTaxClose();
  };

  const taxChangeHandler = (event) => {
    setInsertTax(event.target.value);
  }

  async function postTaxData(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log(props.myID)

    const SellData = JSON.stringify({
      "doctype" : "asset",
      "id" : props.myID,
      "state" : "REVENUE",
      "tax" : Number(insertTax)
    });
    try{
      const response = await fetch(`/api/updateTax`, {
        method: 'POST',
        headers: myHeaders,
        body: SellData,
        redirect: 'follow'
      });

      if(!response.ok){
        throw new Error('taxupdate fail')
      }

      props.onTax(insertTax)
      const data = await response.json();
      console.log(JSON.stringify(data));
      console.log("postsell");
    }catch(error){
      console.log(error.message);
    }
  }

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.onTaxClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form onSubmit={submitHandler}>
              <div>
                <h2>원하는 세율(%)을 입력 해주세요. (0-100 사이의 숫자입니다.)</h2>
                <TextField margin="normal" label="tax(%)" onChange={taxChangeHandler} inputProps={{type:"number"}} />
              </div>
              <Button type="submit" variant="contained">
                submit
              </Button>
            </form>
          </Typography>
        </Box>  
      </Modal>
      {taxIsValid && <ErrorTaxPage open={taxIsValid} onValid={setTaxIsValid}></ErrorTaxPage>}
    </div>
  );
};

export default Tax;
