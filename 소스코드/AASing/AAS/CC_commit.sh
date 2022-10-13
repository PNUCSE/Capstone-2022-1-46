#!/bin/bash

source scripts/utils.sh
. scripts/envVar.sh
. scripts/ccutils.sh
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
#export CC_PACKAGE_ID="market_1.0:a61c9a479a5cc51673cba6a0b4ca18f4209497c1fad320324c3a0463992242fc"
export CC_VERSION="1.0"
getcheck(){
    export CC_END_POLICY="--signature-policy OR('sellerMSP.peer','buyerMSP.peer')" 
    CC_NAME="people"
    CC_VERSION="1.0"
    setGlobals seller
    peer lifecycle chaincode queryinstalled >&log.txt
    peer lifecycle chaincode checkcommitreadiness --channelID people ${CC_END_POLICY} --name people --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json
    CC_PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    
    peer lifecycle chaincode approveformyorg -o localhost:7050 ${CC_END_POLICY} --ordererTLSHostnameOverride orderer.example.com --channelID ${CC_NAME} --name ${CC_NAME} --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
    peer lifecycle chaincode checkcommitreadiness --channelID people ${CC_END_POLICY} --name people --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json

    cat log.txt

    setGlobals buyer
    peer lifecycle chaincode queryinstalled >&log.txt
    peer lifecycle chaincode checkcommitreadiness --channelID people ${CC_END_POLICY} --name people --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json
    CC_PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    peer lifecycle chaincode approveformyorg -o localhost:7050 ${CC_END_POLICY} --ordererTLSHostnameOverride orderer.example.com --channelID ${CC_NAME} --name ${CC_NAME} --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
    peer lifecycle chaincode checkcommitreadiness --channelID people ${CC_END_POLICY} --name people --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json

    cat log.txt
    
    infoln "채널 people 커밋"
    peer lifecycle chaincode commit -o localhost:7050 ${CC_END_POLICY} --ordererTLSHostnameOverride orderer.example.com --channelID people --name people --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/seller.example.com/peers/peer0.seller.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/buyer.example.com/peers/peer0.buyer.example.com/tls/ca.crt"
    infoln "채널 people 확인"
    peer lifecycle chaincode querycommitted --channelID people --name people --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
    

    setGlobals tax
    CC_NAME="revenue"
    peer lifecycle chaincode queryinstalled >&log.txt
    peer lifecycle chaincode checkcommitreadiness --channelID revenue --name revenue --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json
    CC_PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID ${CC_NAME} --name ${CC_NAME} --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
    peer lifecycle chaincode checkcommitreadiness --channelID revenue --name revenue --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json
    cat log.txt

    infoln "채널 revenue 커밋"
    peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID revenue --name revenue --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:11051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/tax.example.com/peers/peer0.tax.example.com/tls/ca.crt" 
    infoln "채널 revenue 확인"
    peer lifecycle chaincode querycommitted --channelID revenue --name revenue --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
    

    CC_NAME="market"
    setGlobals koreapower
    peer lifecycle chaincode queryinstalled >&log.txt
    peer lifecycle chaincode checkcommitreadiness --channelID market --name market --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json
    CC_PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID ${CC_NAME} --name ${CC_NAME} --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
    peer lifecycle chaincode checkcommitreadiness --channelID market --name market --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json
    cat log.txt

    infoln "채널 market 커밋"
    peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID market --name market --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:11061 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/koreapower.example.com/peers/peer0.koreapower.example.com/tls/ca.crt" 

    infoln "채널 market 확인"
    peer lifecycle chaincode querycommitted --channelID market --name market --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

}


getcheck



