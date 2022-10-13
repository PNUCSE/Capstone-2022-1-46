# network.sh에서는 무슨일이 일어날까

## 시작

### network.sh createChannel

1. createChannel()

2. networkup을 실행
    * networkup 함수
        1. organizations/peerOrganizations가 없으면 **createOrgs**함수 실행
            * **createOrgs함수**

                1.  암호화 종류를 확인하고 암호화 종류에 맞춰 인증서 생성

                *   cryptogen
                    1.  organizations/ peerOrganizations , ordererOrganizations 제거
                    2.  crytogen을 이용해서 Org1,Org2,Orderer itentites생성

                        crytogen generate 를 사용

                        --config : organizations/cryptogen/에 있는 각 org.yaml파일 사용<br>
                            peer수와 사용자의 수(admin은 기본)를 지정할 수 있음
                        --output : "organizations" 이건뭔지몰라
                        
                *   CA로 암호화를 한다면
                    1. organizations/fabric-ca/registerEnroll.sh 파일 실행 (안에 설정이 다 있음)
                    1.  organizations/fabric-ca/org1/tls-cert.pem이 있나 확인
                    2.  createOrg1 , createOrg2 , createOrderer함수 실행

        2.  Org1,Org2에 대한 CCP파일 생성

            *   ./organizations/ccp-generats.sh 실행

                *   ORG에 대한 PEERPEM / CAPEM 경로 설정

                    ex)

                    PEERPEM = organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem
                    CAPEM=organizations/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem

    *   sed명령어로 컨테이너들 출력해주는것 같은데 이건 잘 모르겠다.

3.  scripts/creteChannel.sh 실행
    1.   createChannelGensisBlock 실행<br><br>
        *   채널생성과 artifacts.block 생성<br>
            
            프로파일을 이용해 채널을 생성한다.

            프로파일은 configtx.yaml 에서 가져온다.
            TwoOrgsApplicationGensis프로파일을 사용한다.

            ```yaml
            ################################################################################
            #
            #   Profile
            #
            #   - Different configuration profiles may be encoded here to be specified
            #   as parameters to the configtxgen tool
            #
            ################################################################################
            Profiles:

            TwoOrgsApplicationGenesis:
                <<: *ChannelDefaults
                Orderer:
                    <<: *OrdererDefaults
                    Organizations:
                        - *OrdererOrg
                    Capabilities: *OrdererCapabilities
                Application:
                    <<: *ApplicationDefaults
                    Organizations:
                        - *Org1
                        - *Org2
                    Capabilities: *ApplicationCapabilities
            ```

    2.  createChannel 실행

        osnadmin channel(ordering service node admin)명령어로 만든다.

        *   --channelID : 채널 이름을 지정한다.
        *   --config-block : 만들어지는 block파일을 지정한다.
            여기서는 ./channel-artifacts에 저장된다. 
        *   --o : orderer의 admin endpoint를 가르킨다.
            ex) localhost:7053
        *   --ca-file : OSN에 대한 TLS CA 인증서를 카르킨다.
        *   --client-cert : OSN에 대한 public key를 가르킨다.
        *   --client-key : OSN에 대한 private key를 가르킨다. (pem으로 인코딩 )

        test-network에서 사용된 예시로는 다음 파일들이 들어간다.
        ```shell
        CHANNEL_NAME : mychannel

        ORDERER_CA :  /home/kimcharless/go/src/github.com/test/test-network/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem

        ORDERER_ADMIN_TLS_SIGN_CERT : /home/kimcharless/go/src/github.com/test/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt

        ORDERER_ADMIN_TLS_PRIVATE_KEY : /home/kimcharless/go/src/github.com/test/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key
        ```
    
    3.  joinChannel 실행

        해당 작업은 모든 Org에 대하여 작업된다. (orderer는 해당되지 않음)
        ```python
        FABRIC_CFG_PATH=$PWD/../config/
        ORG=$1
        setGlobals $ORG        
        ```
        이 작업을 해주어 ORG번호를 지정하고 전역선언을 해준다.

        peer channel join 실행

        * -b : 블럭파일을 지정해준다. 

        명령은 같은데 두번 실행되는거 보니까 ORG번호를 글로벌로 선언하고 두번 해줘야 되는것 같다. 

    4.  setAnchorPeer 실행

        anchorpeer에 대한것은 다음 링크 [링크](https://velog.io/@dsunni/%ED%95%98%EC%9D%B4%ED%8D%BC%EB%A0%88%EC%A0%80-%ED%8C%A8%EB%B8%8C%EB%A6%AD-2%EC%9E%A5.-%ED%95%98%EC%9D%B4%ED%8D%BC%EB%A0%88%EC%A0%80-%ED%8C%A8%EB%B8%8C%EB%A6%AD-%EA%B0%9C%EC%9A%94)에서 확인

        genesis블록을 통해서 채널을 만들고 Org1,Org2가 만들어졌으면 피어를 각 Org에 join해주고 Anchor피어를 지정해주는 작업이다. 

        ```shell
        docker exac cli ./scripts/setAnchorPeer.sh $ORG $CHANNEL_NAME
        ```
        해당 명령이 실행된다. 

        *   setAnchorPeer.sh
            ORG와 CHANNEL_NAME에 대한 선언이 이뤄지고 ORG를 전역으로 넘긴다. 

            1.  setGlobalsCLI 실행
                scripts/envVar.sh
                해당 함수는 core_peer_address를 환경변수로 지정해준다. (해당 함수에서 port를 지정해줌)

                es) CORE_PEER_ADDRESS=peer0.org1.example.com:7051


            2.  ceeateAnchorPeerUpdate 실행
                1.  fetchChannelConfig 실행
                    peer channel fetch 명령을 통해 orderer에 정보를 준다.
                    -   config : 
                        ex) config_block.pb

                    -   -o : 오더링스비스 endpoint
                        ex) orderer.example.com:7050 

                    -   --ordererTLSHostnameOverride : 오더러에 TLS 연결을 확인할 때 사용하는 이름
                        ex) orderer.example.com

                    -   --cafile : ca파일 루트

                    -   -c : 채널 ID 스트링

                    -   --tls : 오더러 endpoint와 상호작용 할 때 TLS를 사용하겠다

            3.  updateAnchorPeer

                peer channel update -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com -c mychannel -f Org2MSPanchors.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem

                이런 명령어를 입력해서 Anchorpeer을 업데이트 한다. 
                

            근데 이부분이 너무 복잡하다 createAnchorPeerUpdate하고 updateAnchorPeer하고

    여기까지 하면 createChannel이 완료된다.    











