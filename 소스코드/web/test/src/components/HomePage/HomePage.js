import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Store from "@mui/icons-material/Store";
import Home from "@mui/icons-material/Home";
import Paid from "@mui/icons-material/Paid";
import PermIdentity from "@mui/icons-material/PermIdentity";
import Login from "../Login/Login";
import { useState } from "react";
import { Button } from "@mui/material";
import Card from "../../UI/Card/Card";
import MyInformationTable from "../MyInformation/MyInformationTable";
import Buy from "../Buy/Buy";
import Sell from "../Sell/Sell";
import ErrorLogin from "../Login/ErrorLogin";
import Tax from "../Tax/Tax";
import InnerPage from "./InnerPage";
import ChargingPage from "../ChargingPage/ChargingPage";
import AllInformation from "../AllInformation/AllInformation";
import FirstPage from "./FirstPage";


const drawerWidth = 240;

const HomePage = () => {
  const [page, setPage] = useState(1);
  const [myID, setMyID] = useState("");
  const [isLoginBuyer, setIsLoginBuyer] = useState(false);
  const [isLoginSeller, setIsLoginSeller] = useState(false);
  const [isLoginAdmin, setIsLoginAdmin] = useState(false);
  const [isLoginAdminTax, setIsLoginAdminTax] = useState(false);
  const [tax, setTax] = useState(0);

  const [taxOpen, setTaxOpen] = useState(false);

  const [error, setError] = useState(null);

  const handleTaxOpen = () => {
    setTaxOpen(true);
  };
  const handleTaxClose = () => setTaxOpen(false);

  const [asset, setAsset] = useState(0);
  const [rec, setRec] = useState(0);

  const [sellRows, setSellRows] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [loginIsValid, setLoginIsValid] = useState(false);

  const [role, setRole] = useState("buyer");


  const [informationRow, setInformationRow] = useState([]);
  const [AllInformationRow, setAllInformationRows] = useState([]);


  const [chargingOpen, setChargingOpen] = useState(false);

  const [rKRW, setRKRT] = useState(0); 
  const [rREC, setRREC] = useState(0); 

  const handleChargingOpen = () =>{
    setChargingOpen(true);
  }

  const handleChargingClose = () =>{
    setChargingOpen(false);
  }


  const BuyerLoginHandler = () => {
    setIsLoginBuyer(true);
  };

  const SellerLoginHandler = () => {
    setIsLoginSeller(true);
  };

  const AdminLoginHandler = () => {
    setIsLoginAdmin(true);
  }

  const TaxAdminLoginHandler = () => {
    setIsLoginAdminTax(true);
  }

  const LogoutHandler = () => {
    setIsLoginBuyer(false);
    setIsLoginSeller(false);
    setIsLoginAdmin(false);
    setIsLoginAdminTax(false);
    setPage(1);
  };

  const MyIDHander = (ID) => {
    setMyID(ID);
  };

  const PageHanderOne = () => {
    setPage(1);
    setError(null);
  };

  async function PageHanderEight(){
    try{
      const SellData = `${myID}`;
      const response = await fetch(`/api/Market/myinfo`,{
        method: 'POST',
        body: SellData
      });
      if(!response.ok){
        throw new Error('거래 정보 받아오기 실패');
      }
      const data = await response.json();
      let recentKRW = 0;
      let recentREC = 0;
      for(var i = 0; i < data.length; i++){
        recentKRW += Number(data[i].krw);
        recentREC += Number(data[i].rec);
      }
      setRKRT(recentKRW);
      setRREC(recentREC);
      console.log(JSON.stringify(data));
      setError(null);
      setPage(8);
      setInformationRow(data);
    }catch(error){
      console.log(error.message);
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    setIsLoading(true);
    
    const SellRECData = 'koreapower_admin';

    try{
      const response = await fetch(`/api/Market/getDeal`, {
        method: 'POST',
        headers: myHeaders,
        body: SellRECData,
        redirect: 'follow'
      });
      if(!response.ok){
        throw new Error(' 실패!!!!!!!!')
      }
      const data = await response.json();
      data.sort((a, b) => {
        a = a.time.toLowerCase();
        b = b.time.toLowerCase();
        if (a > b) return 1;
        if (a < b) return -1;
    
        return 0;
    });
      const transformedData = data.map((marketData) => {
        return {
          name: marketData.time.substr(5, 8),
          perREC: Number(marketData.krw) / Number(marketData.rec),
        };
      });
      console.log(JSON.stringify(data));
      setPage(8);
      setAllInformationRows(transformedData);
      setIsLoading(false);
    }catch(error){
      console.log(error.message);
      return;
    }

  }

  async function PageHanderTwo()  {
    try{
      const SellData = `${myID}`;
      const response = await fetch(`/api/Market/myinfo`,{
        method: 'POST',
        body: SellData
      });
      if(!response.ok){
        throw new Error('거래 정보 받아오기 실패');
      }
      const data = await response.json();
      data.sort((a, b) => {
        a = a.time.toLowerCase();
        b = b.time.toLowerCase();
        if (a < b) return 1;
        if (a > b) return -1;
    
        return 0;
    });
      console.log(JSON.stringify(data));
      setError(null);
      setPage(2);
      setInformationRow(data);
    }catch(error){
      console.log(error.message);
    }

  };

  async function PageHanderThree () {
    setIsLoading(true);
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
          allKRW: marketData.krw * marketData.rec,
          seller: marketData.seller,
          id: marketData.id,
        };
      });
      setError(null);
      setPage(3);
      setSellRows(transformedData);
      setIsLoading(false);
      console.log("homepagebuyshow");
    }catch (error){
      setError(error.message);
      console.log(error.message);
    }
  };

  async function PageHanderFour () {
    setIsLoading(true);
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
          allKRW: marketData.krw * marketData.rec,
          seller: marketData.seller,
          id: marketData.id,
        };
      });
      setError(null);
      setPage(4);
      setSellRows(transformedData);
      setIsLoading(false);
      console.log("homepagesellshow");
    }catch (error){
      setError(error.message);
      console.log(error.message);
    }
  };

  const PageHandlerFive =() =>{
    setError(null);
    setPage(5);
    handleTaxOpen();
  }

  const PageHandlerSix =() =>{
    setError(null);
    setPage(6);
    handleChargingOpen();
  }

  async function PageHandlerSeven(){
    setIsLoading(true);
    try{
      const response = await fetch(`/api/Market`);
      if(!response.ok){
        throw new Error('실패다.')
      }

      const data = await response.json();

      const transformedData = data.map((marketData) => {
        return {
          KRW: marketData.krw,
          REC: marketData.rec,
          allKRW: marketData.krw * marketData.rec,
          seller: marketData.seller,
          id: marketData.id,
        };
      });
      console.log(JSON.stringify(data));
      setError(null);
      setSellRows(transformedData);
      setIsLoading(false);
    }catch (error){
      setError(error.message);
      console.log(error.message);
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    setIsLoading(true);
    
    const SellRECData = 'koreapower_admin';

    try{
      const response = await fetch(`/api/Market/getDeal`, {
        method: 'POST',
        headers: myHeaders,
        body: SellRECData,
        redirect: 'follow'
      });
      if(!response.ok){
        throw new Error(' 실패!!!!!!!!')
      }
      const data = await response.json();
      data.sort((a, b) => {
        a = a.time.toLowerCase();
        b = b.time.toLowerCase();
        if (a < b) return 1;
        if (a > b) return -1;
    
        return 0;
    });
      const transformedData = data.map((marketData) => {
        return {
          krw: marketData.krw,
          rec: marketData.rec,
          time: marketData.time,
          seller: marketData.seller,
          buyer: marketData.buyer,
          id: marketData.id,
        };
      });
      console.log(JSON.stringify(data));
      setPage(7);
      setAllInformationRows(transformedData);
      setIsLoading(false);
    }catch(error){
      console.log(error.message);
      return;
    }

  }

  return (
    <React.Fragment>
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {page === 1 && `홈페이지`}
            {page === 2 && `내 거래내역`}
            {page === 3 && `REC 구매`}
            {page === 4 && `REC 판매`}
            {page === 5 && `Tax 수정`}
            {page === 6 && `환전 및 REC충전`}
            {page === 7 && `모든 거래내역`}
            {page === 8 && `메인페이지`}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {(isLoginBuyer || isLoginSeller) && (["메인페이지", "내 거래내역", "REC 구매", "REC 판매", "환전 및 REC충전"].map(
            (text, index) => (
              <ListItem key={text} disablePadding>
                {index === 0 && (
                  <ListItemButton disabled={!(isLoginBuyer||isLoginSeller)} onClick={PageHanderEight}>
                    <ListItemIcon>{<Home />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                )}
                {index === 1 && (
                  <ListItemButton disabled={!(isLoginBuyer||isLoginSeller)} onClick={PageHanderTwo}>
                    <ListItemIcon>{<PermIdentity />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                )}
                {index === 2 && (
                  <ListItemButton disabled={!isLoginBuyer} onClick={PageHanderThree}>
                    <ListItemIcon>{<Store />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                )}
                {index === 3 && (
                  <ListItemButton disabled={!isLoginSeller} onClick={PageHanderFour}>
                    <ListItemIcon>{<Store />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                )}
                {index === 4 && (
                  <ListItemButton disabled={!(isLoginSeller||isLoginBuyer)} onClick={PageHandlerSix}>
                    <ListItemIcon>{<Paid />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                )}
              </ListItem>
            )
          ))}
          {isLoginAdmin && (["홈페이지", "모든 거래내역"].map(
            (text, index) => (
              <ListItem key={text} disablePadding>
                {index === 0 && (
                  <ListItemButton disabled={false} onClick={PageHanderOne}>
                    <ListItemIcon>{<Home />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                )}
                {index === 1 && (
                  <ListItemButton disabled={false} onClick={PageHandlerSeven}>
                    <ListItemIcon>{<PermIdentity />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                )}
              </ListItem>
            )
          ))}
          {isLoginAdminTax && (["홈페이지", "Tax 수정"].map(
            (text, index) => (
              <ListItem key={text} disablePadding>
                {index === 0 && (
                  <ListItemButton disabled={false} onClick={PageHanderOne}>
                    <ListItemIcon>{<Home />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                )}
                {index === 1 && (
                  <ListItemButton disabled={false} onClick={PageHandlerFive}>
                    <ListItemIcon>{<PermIdentity />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                )}
              </ListItem>
            )
          ))}          
        </List>
        <Divider />
        {!(isLoginBuyer || isLoginSeller || isLoginAdmin || isLoginAdminTax) && <Login rec={rec} onRec={setRec} onAsset={setAsset} asset={asset} onRole={setRole} onSellerLogin={SellerLoginHandler} onBuyerLogin={BuyerLoginHandler} onAdminLogin={AdminLoginHandler} onTaxAdminLogin={TaxAdminLoginHandler} onID={MyIDHander} onTax={setTax} isValid={loginIsValid} onValid={setLoginIsValid}/>}
        {(isLoginBuyer || isLoginSeller) && (
          <Card>
            <h2>내 정보</h2>
            <p>ID: {myID}</p>
            <p>role: {role}</p>
            <p>보유 자산: {asset}원 </p>
            <p>보유 REC: {rec}개</p>
            <p>현재 세율: {tax}%</p>
            <Button onClick={LogoutHandler}>Logout</Button>
          </Card>
        )}
        {isLoginAdmin && (
          <Card>
            <p>{myID}</p>
            <p>role: {role}</p>
            <p>현재 세율: {tax}%</p>
            <Button onClick={LogoutHandler}>Logout</Button>
          </Card>
        )}
        {isLoginAdminTax && (
          <Card>
            <p>{myID}</p>
            <p>role: {role}</p>
            <p>현재 세율: {tax}%</p>
            <Button onClick={LogoutHandler}>Logout</Button>
          </Card>
        )}        
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        {!error && page === 1 && <FirstPage asset={asset} rec={rec}></FirstPage>}
        {!error && page === 2 && <MyInformationTable informationRow={informationRow} onInformationRow={setInformationRow}/>}
        {!error && page === 3 && <Buy onError={setError} tax={tax} isLoading={isLoading} onIsLoading={setIsLoading} sellRow={sellRows} myID={myID} onSellRow={setSellRows} myRec={rec} myAsset={asset} onMyRec={setRec} onMyAsset={setAsset}/>}
        {!error && page === 4 && <Sell tax={tax} onError={setError} isLoading={isLoading} onIsLoading={setIsLoading} sellRow={sellRows} myID={myID} onSellRow={setSellRows} myRec={rec} myAsset={asset} onMyRec={setRec} onMyAsset={setAsset}/>}
        {!error && page === 5 && <Tax myID={myID} open={taxOpen} onTaxOpen={handleTaxOpen} onTaxClose={handleTaxClose} tax={tax} onTax={setTax}></Tax>}
        {!error && page === 6 && <ChargingPage  onError={setError} rec={rec} onRec={setRec} asset={asset} onAsset={setAsset} myID={myID} open={chargingOpen} onChargingClose={handleChargingClose} onChargingOpen={handleChargingOpen}></ChargingPage>}
        {!error && page === 7 && <AllInformation sellRow={sellRows} AllInformationRow={AllInformationRow}></AllInformation>}
        {!error && page === 8 && <InnerPage rKRW={rKRW} rREC={rREC} asset={asset} rec={rec} AllInformationRow={AllInformationRow}></InnerPage>}

        {error && <h1>{error}</h1>}
      </Box>
    </Box>
    <ErrorLogin open={loginIsValid} onValid={setLoginIsValid}></ErrorLogin>
    </React.Fragment>
  );
};

export default HomePage;
