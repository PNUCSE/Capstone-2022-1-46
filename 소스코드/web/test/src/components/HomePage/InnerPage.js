import classes from "./good.module.css";
import Card from "./Card"
import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Chip, Stack } from "@mui/material";



  export default class InnerPage extends PureComponent  {
    render(){
    return (
        <React.Fragment>
            <br></br>
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
      <br></br>
            <div className={classes.parent}>
                <Card>
                    <div className={classes.good}>
                        <h2>보유 자산(₩)</h2>
                        <br/>
                        <p className={classes.nice}>{this.props.asset}₩</p>
                        
                    </div>
                </Card>
                <Card>
                    <div className={classes.good}>
                        <h2>보유 REC</h2>
                        <br/>
                        <p className={classes.nice}>{this.props.rec}</p>
                    </div>

                </Card>
                <Card>
                    <div className={classes.good}>
                        <h2>최근 거래한 자산 양(₩)</h2>
                        <br/>
                        <p className={classes.nice}>{this.props.rKRW}₩</p>
                    </div>

                </Card>
                <Card>
                    <div className={classes.good}>
                        <h2>최근 거래한 REC 양</h2>
                        <br/>
                        <p className={classes.nice}>{this.props.rREC}</p>
                    </div>

                </Card>
            </div>
            <br></br>
            <br></br>
          <h2>최근 REC가격 추이(개당)</h2>
          <LineChart
            width={1210}
            height={500}
            data={this.props.AllInformationRow}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="perREC" stroke="#82ca9d" />
          </LineChart>
        </React.Fragment>
      );
        }
}

