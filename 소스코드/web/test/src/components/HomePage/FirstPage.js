import React from "react";
import { Chip, Stack } from "@mui/material";

const FirstPage = () => {
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
            {/* <p>firstpage</p> */}
        </React.Fragment>

    );
}

export default FirstPage;