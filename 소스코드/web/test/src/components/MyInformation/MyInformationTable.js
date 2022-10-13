import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";




const MyInformationTable = (props) => {

  return (
    <React.Fragment>
      
      {props.informationRow.length !== 0 && <h2>거래내역</h2>}
        { props.informationRow.length !== 0 &&<TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">거래 번호</TableCell>
              <TableCell align="left">거래 시기</TableCell>
              <TableCell align="left">rec거래량</TableCell>
              <TableCell align="left">자산 거래량&nbsp;(₩)</TableCell>
              <TableCell align="left">판매자</TableCell>
              <TableCell align="left">구매자</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.informationRow.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{row.id}</TableCell>
                <TableCell align="left">{row.time}</TableCell>
                <TableCell align="left">{row.rec}</TableCell>
                <TableCell align="left">{row.krw}</TableCell>
                <TableCell align="left">{row.seller}</TableCell>
                <TableCell align="left">{row.buyer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> }
      {props.informationRow.length === 0 && <h1>거래내역이 없습니다.</h1>}
    </React.Fragment>
  );
};

export default MyInformationTable;
