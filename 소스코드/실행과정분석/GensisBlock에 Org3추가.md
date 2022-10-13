# Org3를 기본적으로 추가한 상태로 시작


##  gensisBlock에서부터 Org를 생성한 상태로 네트워크를 시작하는 방법을 설명한다.

1. Org3에 대한 인증키를 생성한다.
2. 네트워크가 시작될 때 만들어지는 genesis block 프로파일에 Org3를 추가해준다.
3. 도커 compose파일에 Org3에 대한 정보를 준다.

    이 작업으로 해당 compose-test-net.yaml을 이용해 도커를 실행하였을때 Org3에 대한 컨테이너가 생성된다. 








1.  ##  **Cryptogen을 이용해서 Key를 생성한다.**

    1.  organizations/cryptogen 에 Org3 암호화 관련 yaml파일을 넣어둔다.
        ```yaml
        # Copyright IBM Corp. All Rights Reserved.
        #
        # SPDX-License-Identifier: Apache-2.0
        #

        # ---------------------------------------------------------------------------
        # "PeerOrgs" - Definition of organizations managing peer nodes
        # ---------------------------------------------------------------------------
        PeerOrgs:
          # ---------------------------------------------------------------------------
          # Org3
          # ---------------------------------------------------------------------------
          - Name: Org3
            Domain: org3.example.com
            EnableNodeOUs: true
            Template:
              Count: 1
              SANS:
                - localhost
            Users:
              Count: 1
        ```
    
    2.  network.sh 파일의 createOrgs에 암호화 과정을 추가해준다.
        ```python
        # ORG3도 암호화
        infoln "Creating Org3 Identities"

        set -x
        #cryptogen generate명령을 이용해서 crypto-config-org3.yaml을 사용해 암호화한다.
        cryptogen generate --config=./organizations/cryptogen/crypto-config-org3.yaml --output="organizations"
        res=$?
        { set +x; } 2>/dev/null
        if [ $res -ne 0 ]; then
          fatalln "Failed to generate certificates..."
        fi
        ```
        이걸로 network.sh up을 실행했을 때 createOrgs함수에서 알아서 Org3.yaml을 이용해 crypto하는 과정이 일어나고 organizations/peerOrganizations/org3.example.com 폴더가 생긴다.

<br>

2.  ##  **configtx.yaml 설정**  
    genesis block을 생성할 때 사용할 프로파일을 수정해줘야 한다. 

    프로파일은 confingtx/configtx.yaml파일을 사용한다. 

    ```yaml
    - &Org3
        # DefaultOrg defines the organization which is used in the sampleconfig
        # of the fabric.git development environment
        Name: Org3MSP

        # ID to load the MSP definition as
        ID: Org3MSP

        MSPDir: ../organizations/peerOrganizations/org3.example.com/msp

        # Policies defines the set of policies at this level of the config tree
        # For organization policies, their canonical path is usually
        #   /Channel/<Application|Orderer>/<OrgName>/<PolicyName>
        Policies:
            Readers:
                Type: Signature
                Rule: "OR('Org3MSP.admin', 'Org3MSP.peer', 'Org3MSP.client')"
            Writers:
                Type: Signature
                Rule: "OR('Org3MSP.admin', 'Org3MSP.client')"
            Admins:
                Type: Signature
                Rule: "OR('Org3MSP.admin')"
            Endorsement:
                Type: Signature
                Rule: "OR('Org3MSP.peer')"
      ```
      본래는 Orderer,Org1,Org2밖에 없지만 Org3를 추가해준다.
      정책은 다른것들과 똑같이 해두었다. MSPDir에 아까 만들어준 인증서를 넣어준다.

      ```yaml
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
                      - *Org3
                  Capabilities: *ApplicationCapabilities
      ```
      아래도 바꿔준다. Organizations를 추가해주었다.


3. ## **compose 파일에 Org3에 대한 정보 추가**
    network.sh파일을 보면 도커 컴포즈를 실행할 때 
    ```python
    -f compose/compose-test-net.yaml 
    -f compose/docker/docker-compose-test-net.yaml
    #그리고 
      compose/compose-ca.yaml
    ```
    이렇게 세가지 파일을 이용한다.

    1.  compose-test-net.yaml
        * volumes 에 peer0.org3.example.com 추가
          ```
          volumes:
          orderer.example.com:
          peer0.org1.example.com:
          peer0.org2.example.com:
          peer0.org3.example.com:
          ```
        * services에 peer0.org3.example.com 추가
          ```yaml
          # peer3
          peer0.org3.example.com:
            container_name: peer0.org3.example.com
            image: hyperledger/fabric-peer:latest
            labels:
              service: hyperledger-fabric
            environment:
              - FABRIC_CFG_PATH=/etc/hyperledger/peercfg
              #Generic peer variables
              - FABRIC_LOGGING_SPEC=INFO
              #- FABRIC_LOGGING_SPEC=DEBUG
              - CORE_PEER_TLS_ENABLED=true
              - CORE_PEER_PROFILE_ENABLED=true
              - CORE_PEER_TLS_CERT_FILE=/etc/hyperledger/fabric/tls/server.crt
              - CORE_PEER_TLS_KEY_FILE=/etc/hyperledger/fabric/tls/server.key
              - CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/tls/ca.crt
              # Peer specific variables
              - CORE_PEER_ID=peer0.org3.example.com
              - CORE_PEER_ADDRESS=peer0.org3.example.com:11051
              - CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/msp
              - CORE_PEER_LISTENADDRESS=0.0.0.0:11051
              - CORE_PEER_CHAINCODEADDRESS=peer0.org3.example.com:11052
              - CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:11052
              - CORE_PEER_GOSSIP_BOOTSTRAP=peer0.org3.example.com:11051
              - CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.org3.example.com:11051
              - CORE_PEER_LOCALMSPID=Org3MSP
              - CORE_METRICS_PROVIDER=prometheus
              #이부분 바꿈 peerOorg1 -> peerOorg3
              - CHAINCODE_AS_A_SERVICE_BUILDER_CONFIG={"peername":"peer0org3"}
              - CORE_CHAINCODE_EXECUTETIMEOUT=300s      
            volumes:
                - ../organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com:/etc/hyperledger/fabric        
                - peer0.org3.example.com:/var/hyperledger/production
            working_dir: /root
            command: peer node start
            ports:
              - 11051:11051
            networks:
              - test
          ```
          포트에 대한건 아직 정확히 모르겠다 흐
          * cli에 의존성 추가
            ```yaml
            depends_on:
              - peer0.org1.example.com
              - peer0.org2.example.com
              - peer0.org3.example.com
            ```
      2.  compose/docker/docker-compose-test-net.yaml에 추가
          ```yaml
            peer0.org3.example.com:
              container_name: peer0.org3.example.com
              image: hyperledger/fabric-peer:latest
              labels:
                service: hyperledger-fabric
              environment:
                #Generic peer variables
                - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
                - CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=fabric_test
              volumes:
                - ./docker/peercfg:/etc/hyperledger/peercfg
                - ${DOCKER_SOCK}:/host/var/run/docker.sock
          ```
      3.  compose-ca.yaml 수정
          ```yaml
          # org3추가
            ca_org3:
              image: hyperledger/fabric-ca:latest
              labels:
                service: hyperledger-fabric
              environment:
                - FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server
                - FABRIC_CA_SERVER_CA_NAME=ca-org3
                - FABRIC_CA_SERVER_TLS_ENABLED=true
                - FABRIC_CA_SERVER_PORT=11054
              ports:
                - "11051:11051"    
                - "11054:11054"
              command: sh -c 'fabric-ca-server start -b admin:adminpw -d'
              volumes:
                - ..organizations/fabric-ca/org3:/etc/hyperledger/fabric-ca-server
              container_name: ca_org3
              networks:
                  - test
            ```
##  이렇게까지 하고 실행하면 추가된 상태로 실행이 된다.

## Port설정하는거하고 의존성이 뭔지는 모르겠으니 이거 알아봐야한다.


