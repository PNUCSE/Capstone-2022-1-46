#!/bin/bash

# imports  
. scripts/envVar.sh
. scripts/utils.sh

DELAY="$2"
MAX_RETRY="$3"
VERBOSE="$4"
: ${CHANNEL_NAME:="mychannel"}
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="false"}

: ${CONTAINER_CLI:="docker"}
: ${CONTAINER_CLI_COMPOSE:="${CONTAINER_CLI}-compose"}
infoln "Using ${CONTAINER_CLI} and ${CONTAINER_CLI_COMPOSE}"

if [ ! -d "channel-artifacts" ]; then
	mkdir channel-artifacts
fi

echo "ORDERER_CA :  $ORDERER_CA"
echo "ORDERER_ADMIN_TLS_SIGN_CERT : $ORDERER_ADMIN_TLS_SIGN_CERT"
echo "ORDERER_ADMIN_TLS_PRIVATE_KEY : $ORDERER_ADMIN_TLS_PRIVATE_KEY"

which configtxgen
if [ "$?" -ne 0 ]; then
    fatalln "configtxgen tool not found."
fi

makeGenesisBlock(){
  CHANNEL_NAME="people"
  FABRIC_CFG_PATH=${PWD}/configtx
  set -x
  configtxgen -profile people -outputBlock ./channel-artifacts/${CHANNEL_NAME}.block -channelID $CHANNEL_NAME
  FABRIC_CFG_PATH=$PWD/../config/
  osnadmin channel join --channelID $CHANNEL_NAME --config-block ./channel-artifacts/${CHANNEL_NAME}.block -o localhost:7053 --ca-file "$ORDERER_CA" --client-cert "$ORDERER_ADMIN_TLS_SIGN_CERT" --client-key "$ORDERER_ADMIN_TLS_PRIVATE_KEY" >&log.txt
  cat log.txt

  CHANNEL_NAME="revenue"
  FABRIC_CFG_PATH=${PWD}/configtx
  set -x
  configtxgen -profile revenue -outputBlock ./channel-artifacts/${CHANNEL_NAME}.block -channelID $CHANNEL_NAME
  FABRIC_CFG_PATH=$PWD/../config/
  osnadmin channel join --channelID $CHANNEL_NAME --config-block ./channel-artifacts/${CHANNEL_NAME}.block -o localhost:7053 --ca-file "$ORDERER_CA" --client-cert "$ORDERER_ADMIN_TLS_SIGN_CERT" --client-key "$ORDERER_ADMIN_TLS_PRIVATE_KEY" >&log.txt
  cat log.txt

  CHANNEL_NAME="market"
  FABRIC_CFG_PATH=${PWD}/configtx
  set -x
  configtxgen -profile market -outputBlock ./channel-artifacts/${CHANNEL_NAME}.block -channelID $CHANNEL_NAME
  FABRIC_CFG_PATH=$PWD/../config/
  osnadmin channel join --channelID $CHANNEL_NAME --config-block ./channel-artifacts/${CHANNEL_NAME}.block -o localhost:7053 --ca-file "$ORDERER_CA" --client-cert "$ORDERER_ADMIN_TLS_SIGN_CERT" --client-key "$ORDERER_ADMIN_TLS_PRIVATE_KEY" >&log.txt
  cat log.txt
}

#joinChannel ???????????? Org??????
joinChannel() {
  FABRIC_CFG_PATH=$PWD/../config/
  CHANNEL_NAME=$1
  ORG=$2
  setGlobals $ORG
  BLOCKFILE="./channel-artifacts/${CHANNEL_NAME}.block"
	local rc=1
	local COUNTER=1
	## Sometimes Join takes time, hence retry
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    set -x
    peer channel join -b $BLOCKFILE >&log.txt
    res=$?
    { set +x; } 2>/dev/null
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "After $MAX_RETRY attempts, peer0.${ORG} has failed to join channel '$CHANNEL_NAME' "
}
#setAnchorPeer ???????????? Org??????
setAnchorPeer() {
  CHANNEL_NAME=$1
  ORG=$2
  echo "CONTAINER_CLI : $CONTAINER_CLI"
  echo "ORG : $ORG"
  ${CONTAINER_CLI} exec cli ./scripts/setAnchorPeer.sh $ORG $CHANNEL_NAME 
}

makeGenesisBlock

FABRIC_CFG_PATH=$PWD/../config/
infoln "seller??? people??? ?????????.."
joinChannel people seller
infoln "buyer??? people??? ?????????.."
joinChannel people buyer
infoln "tax??? revenue??? ?????????.."
joinChannel revenue tax
infoln "koreapower??? market??? ?????????.."
joinChannel market koreapower

infoln "seller??? AnchorPeer?????????.."
setAnchorPeer people seller
infoln "buyer??? AnchorPeer?????????.."
setAnchorPeer people buyer
infoln "tax??? AnchorPeer?????????.."
setAnchorPeer revenue tax
infoln "koreapower??? AnchorPeer?????????.."
setAnchorPeer market koreapower

successln "??????!"
