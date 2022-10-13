import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from '@mui/material/CircularProgress';
import Button from "@mui/material/Button";
import BuyPage from "./BuyPage";



const Buy = (props) => {
  const [open, setOpen] = useState(false);

  const handleOpen = (t_rec, t_num, t_id) => {
    setNowRec(t_rec);
    setNowAsset(t_num);
    setNowID(t_id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false)
  };

  const [nowrec, setNowRec] = useState(1);
  const [nownum, setNowAsset] = useState(1);
  const [nowID, setNowID] = useState("");
  


  return (
    <React.Fragment>
      {!props.isLoading && <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">rec 개당 가격&nbsp;($)</TableCell>
              <TableCell align="right">rec 갯수</TableCell>
              <TableCell align="right">총 가격&nbsp;(₩)</TableCell>
              <TableCell align="right">총 가격(세금포함)&nbsp;(₩)</TableCell>
              <TableCell align="right">판매자</TableCell>
              <TableCell align="right">구매</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.sellRow.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">{row.KRW}</TableCell>
                <TableCell align="right">{row.REC}</TableCell>
                <TableCell align="right">{row.allKRW}₩</TableCell>
                <TableCell align="right">{parseInt(row.allKRW * ((0.01 * Number(props.tax)) + 1))}₩</TableCell>
                <TableCell align="right">{row.seller}</TableCell>
                <TableCell align="right">
                  {(Number(row.REC) !== 0 && props.myAsset >= row.KRW * ((0.01 * Number(props.tax)) + 1)) && (
                    <Button onClick={() => handleOpen(row.KRW, row.REC, row.seller)}>구매</Button>
                  )}
                  {(Number(row.REC) === 0 || props.myAsset < row.KRW * ((0.01 * Number(props.tax)) + 1)) && <Button disabled>구매</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}
      {props.isLoading && <h2>Loading...<CircularProgress size={23}/></h2>}
      <BuyPage tax={props.tax} buyID={nowID} onIsLoading={props.onIsLoading} onSellRow={props.onSellRow} itemID={nowID} open={open} handleClose={handleClose} myID={props.myID} myRec={props.myRec} myAsset={props.myAsset} onMyRec={props.onMyRec} onMyAsset={props.onMyAsset} buyRec={nowrec} buyNum={nownum}></BuyPage>
    </React.Fragment>
  );
};

export default Buy;
