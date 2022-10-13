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

#joinChannel 채널이름 Org이름
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
#setAnchorPeer 채널이름 Org이름
setAnchorPeer() {
  CHANNEL_NAME=$1
  ORG=$2
  echo "CONTAINER_CLI : $CONTAINER_CLI"
  echo "ORG : $ORG"
  ${CONTAINER_CLI} exec cli ./scripts/setAnchorPeer.sh $ORG $CHANNEL_NAME 
}

makeGenesisBlock

FABRIC_CFG_PATH=$PWD/../config/
infoln "seller를 people에 가입중.."
joinChannel people seller
infoln "buyer를 people에 가입중.."
joinChannel people buyer
infoln "tax를 revenue에 가입중.."
joinChannel revenue tax
infoln "koreapower를 market에 가입중.."
joinChannel market koreapower

infoln "seller를 AnchorPeer설정중.."
setAnchorPeer people seller
infoln "buyer를 AnchorPeer설정중.."
setAnchorPeer people buyer
infoln "tax를 AnchorPeer설정중.."
setAnchorPeer revenue tax
infoln "koreapower를 AnchorPeer설정중.."
setAnchorPeer market koreapower

successln "완료!"
