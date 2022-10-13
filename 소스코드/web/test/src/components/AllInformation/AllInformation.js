import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Chip, Stack } from "@mui/material";


const AllInformation = (props) => {
  return (
    <React.Fragment>
      <Stack direction="row" spacing={1}>
        <Chip
            label="Official Hyperledger Fabric Homepage Link"
            component="a"
            href="https://www.hyperledger.org/use/fabric"
            variant="outlined"
            target='_blink'
            clickable
        />
        <Chip
            label="Official Hyperledger Fabric doc Link"
            component="a"
            href="https://hyperledger-fabric.readthedocs.io/en/latest/whatis.html"
            variant="outlined"
            target='_blink'
            clickable
        />
        <Chip
            label="Official React Link"
            component="a"
            href="https://reactjs.org/"
            variant="outlined"
            target='_blink'
            clickable
        />
      </Stack>
        <h2>현재 시장에 올라가 있는 매물 목록</h2>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">rec 개당 가격&nbsp;(₩)</TableCell>
              <TableCell align="right">rec 갯수(₩)</TableCell>
              <TableCell align="right">총 가격&nbsp;(₩)</TableCell>
              <TableCell align="right">판매자</TableCell>
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
                <TableCell align="right">{row.allKRW}</TableCell>
                <TableCell align="right">{row.seller}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    <h2>전체 거래 기록</h2>
      <TableContainer component={Paper}>
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
            {props.AllInformationRow.map((row, index) => (
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
      </TableContainer>


      
    </React.Fragment>
  );
};

export default AllInformation;
