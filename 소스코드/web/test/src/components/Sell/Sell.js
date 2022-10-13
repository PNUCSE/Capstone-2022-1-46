import React, {useState} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CircularProgress } from "@mui/material";

import Button from "@mui/material/Button";
import SellPage from "./SellPage";

const Sell = (props) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  

  return (
    <React.Fragment>
      <Button onClick={handleOpen} variant="contained">
        매물 등록
      </Button>
      {!props.isLoading && <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">rec 개당 가격&nbsp;(₩)</TableCell>
              <TableCell align="right">rec 갯수</TableCell>
              <TableCell align="right">총 가격&nbsp;(₩)</TableCell>
              <TableCell align="right">총 가격(세금포함)&nbsp;(₩)</TableCell>
              <TableCell align="right">판매자</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.sellRow.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">{row.KRW}₩</TableCell>
                <TableCell align="right">{row.REC}</TableCell>
                <TableCell align="right">{row.allKRW}₩</TableCell>
                <TableCell align="right">{parseInt(row.allKRW * ((0.01 * Number(props.tax)) + 1))}₩</TableCell>
                <TableCell align="right">{row.seller}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}
      {props.isLoading && <h2>Loading...<CircularProgress size={23}/></h2>}
      <SellPage
        open={open}
        handleClose={handleClose}
        myID={props.myID}
        myRec={props.myRec}
        myAsset={props.myAsset}
        onMyRec={props.onMyRec}
        onMyAsset={props.onMyAsset}
        onIsLoading={props.onIsLoading}
        onSellRow={props.onSellRow}
      ></SellPage>
    </React.Fragment>
  );
};

export default Sell;
