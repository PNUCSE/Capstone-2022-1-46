# 정보컴퓨터공학부 아메리카노샷추가
## 블록체인 기반의 신재행 에너지 거래 플랫폼 개발
<hr>

### 1. 프로젝트 소개
프로젝트명: 블록체인 기반의 신재행 에너지 거래 플랫폼 개발

<p> ● 기존의 원자력, 화석 에너지를 대체하는 신재생에너지를 기업에서도 사용해야할 의무가 생기게 되었다. 그래서 REC(신재생에너지 의무발전 공급 인증서)를 통해서 발전사업자가 신재생에너지를 생산하도록 유도하고, 이를 충족시키지 못했을 시, 다른 발전사업자게에 REC를 구매하는 것으로 필요 REC를 충당할 수 있도록 정책을 시행하고 REC거래 플랫폼을 제공하고 있다. 우리는 기존의 REC거래 플랫폼의 문제를 알아보고 이를 블록체인을 통해서 해결해 봤다.
<br>

<div align="center"><img src="https://user-images.githubusercontent.com/62837074/194026304-580c2c5c-b550-434e-bf20-6a3e7f43f7c0.png" width=400 height=300/></div>

<div align="center">[기존 REC거래 플랫폼]</div>
<br>

● 현재의 REC거래는 비효율적인 모습을 보여준다. 사업자가 REC를 등록하면 전력거래소에 서 매물로 설정하고 공급 의무자는 REC를 돈을 지불하고 구매하고 대금 청구 및 대금이 오고 간다. 국세청에 대금 수수료가 납부되고 이 모든 과정이 완료되면 REC의 소유권이 이전된다. 이때 각 기관들이 소유하고 있는 데이터들이 서로 달라 거래시에 서로 대조가 필요하며 거래 과정도 복잡해진다. 입찰 참여부터 최종 수수료 납부까지 4개기관, 10단계 를 거치는 과정으로 되어 있으며, REC구매 절차가 매우 복잡해해 이용자의 컴플레인이 많 았다. 에너지 제조산업 특성상 고령층 및 농민 사업자들의 비율이 높아 그 문제점은 더욱 심각하다.각 기관의 데이터베이스에 위조, 해킹 등의 위협도 존재한다. 직접적으로는 거래내용의 해 킹으로 금전적인 피해가 발생할 수 있고, 간접적으로는 이런 공격이 감지되었을 경우에 REC거래 자체가 일시중단되면서 피해가 발생할 수 있다. 본 팀은 프라이빗 블록체인 중 하나인 하이퍼레저 패브릭을 통하여 위 문제를 해결하고자 했다.<br>

<div align="center"><img src="https://user-images.githubusercontent.com/62837074/194027855-18f6ebd7-7694-472d-8164-a6a144c1676b.png" width=400 height=200/></div>

<div align="center">[hyperledger fabric]</div>
<br>

● 블록체인의 특성 상 거래내역은 블록에 무조건 저장이 된다. 그리고 이는 수정 및 삭제가 불가능하다. 이 특성을 이용하면 위에서 언급했던 기존 플랫폼의 문제를 대부분 해결할 수 있다. 
<br>
<hr>

### 2. 팀소개
<table>
  <tr>
    <td>이름</td>
    <td>● 차민준</td>
    <td>● 김재현</td>
    <td>● 오재석</td>
  </tr>
  <tr>
    <td>이메일</td>
    <td>● whwhdnfl2@naver.com</td>
    <td>● kimqhahqhah@naver.com</td>
    <td>● kimqhahqhah@naver.com</td>
  </tr>
  <tr>
    <td>역할</td>
    <td>● Reactjs를 활용한 프런트엔드 페이지 개발 <br>● 사용자/국세청/전력거래소 ChainCode 개발</td>
    <td>● 블록체인 네트워크 구성 <br>● hyperledger-fabric rest-api 구축(java)</td>
    <td>● spring-boot 서버 개발 <br>● mySQL 데이터베이스 구축 </td>
  </tr>
</table>
<hr>

### 3. 구성도

<p> ● 본 REC거래 플랫폼에는 seller, buyer, 전력거래소, 국세청으로 사용자가 구분된다. 지금부터 각 사용자 별로 사용할 수 있는 기능을 소개한다.</p>
<div align="center"><img src="https://user-images.githubusercontent.com/62837074/194320112-ead76648-1bae-4e04-9a24-56e26278da9e.png" width=600 height=400/></div>
<div align="center">[최초 접속 화면]</div>
<br>
● 최초로 페이지에 접근했을 때의 화면이다. 죄측에는 로그인을 할 수 있는 컴포넌트가 위치하고 있고 상단에는 현재 페이지의 이름이 나타나 있다. 중앙 메인 컴포넌트에는 hyperledger fabric의 공식홈페이지, doc와 react의 공식홈페이지로 이동할 수 있는 링크가 위치하고 있다. 일단 비밀번호는 더미데이터로 아무 값이나 입력해도 로그인이 가능하도록 하였고, 로그인은 Seller_User1, Seller_User1, Buyer_User1, Buyer_User2, koreapower_admin, tax_admin 이렇게 여섯 가지로 로그인이 가능하도록 설계하였다. 이 중 앞 네 가지는 사용자고 뒤 두 가지는 관리자이다.
<br>

<div align="center"><img src="https://user-images.githubusercontent.com/62837074/194316991-8d5a1ab2-a498-442c-ad81-2143ae3847fc.png" width=600 height=400/></div>
<div align="center">[seller 로그인 화면]</div>
<br>
● 로그인 이후 위와 같이 로그인 컴포넌트는 사라지고 사용자의 정보를 표시하는 컴포넌트가 생기는 것을 볼 수 있다로그인 이후에는 사용자에 따라서 좌측에 메뉴 목록이 생긴다. rec 판매자의 경우에는 전체적인 사용자의 정보를 볼 수 있는 “전체적인 정보 확인” 메뉴, 내 거래내역을 알 수 있는 “내 거래내역” 메뉴, 판매할 rec를 등록할 수 있는 “rec 판매” 메뉴, rec를 충전하고 자산을 환전할 수 있는 “환전 및 REC충전”을 볼 수 있다. (구매는 불가능하므로 rec 구매 버튼은 비활성화 된다.)메인 페이지를 보면 사용자의 보유 rec, 자산, 최근에 거래한 총 rec, 자산을 볼 수 있다. 그 아래에는 차트를 통해서 최근 시장에서 거래된 rec 개당 가격의 추이를 확인할 수 있다. 본 차트는 recharts 라이브러리를 활용하였다.
<br>

<div align="center"><img src="https://user-images.githubusercontent.com/62837074/194317013-8218ecec-fcda-49e8-93ca-0b43ab3818c7.png" width=600 height=400/></div>
<div align="center">[내 거래내역 페이지]</div>
<br>
● 내 거래내역을 누르면 [그림 37]과 같은 페이지가 나타나게 된다. 중앙 페이지에 표가 나타나게 되는데, 표에서 사용자가 거래했던 거래 별로 거래 번호, 거래 시기, rec거래량, 자산 거래량, 판매자, 구매자를 알 수 있다. 거래 번호는 거래 체결시 sha256해시값이 생성된다. 
<br>

<div align="center"><img src="https://user-images.githubusercontent.com/62837074/194317019-4c53ebc9-642b-4aad-80ba-146548bbbabe.png" width=600 height=400/></div>
<div align="center">[매물 등록 페이지]</div>
<br>
● 현재 시장에 등록된 매물들이 보여준다. 판매자는 위 매물들의 가격을 참고하여 rec의 개당 가격을 설정하거나 자신이 소유하고 있는 rec를 매물로 등록할 수 있다.
<br>

<div align="center"><img src="https://user-images.githubusercontent.com/62837074/194317020-10f2c3ed-bb11-49db-a7fc-0fa2f8e4cde6.png" width=600 height=400/></div>
<div align="center">[환전 및 REC충전 메뉴]</div>
<br>
● Modal을 통해서 REC를 충전하고 자산도 충전할 수 있다. 등록 이후에는 내 정보 컴포넌트에서 rec와 자산이 바뀐 것을 바로 확인해 볼 수 있다.

<div align="center"><img src="https://user-images.githubusercontent.com/62837074/194317024-43a6b1e3-e51d-47fa-9a83-229eacbc9b67.png" width=600 height=400/></div>
<div align="center">[REC 구매 메뉴]</div>
<br>
● 구매자로 로그인한 후에 REC 구매 메뉴를 통해서 REC를 구매할 수 있다. 위 Modal에 원하는 개수를 입력해서 REC를 구매할 수 있다. 자신의 자산보다 많이 구매하려고 하면 Modal창을 통하여 입력을 제한한다.

<div align="center"><img src="https://user-images.githubusercontent.com/62837074/194317027-bb894458-d081-41bf-b4c4-f8fb4d05f743.png" width=600 height=400/></div>
<div align="center">[일반 관리자의 모든 거래내역 메뉴]</div>
<br>
● 전력거래소로 로그인한 후에는 모든 거래 내역 메뉴에서 시장에 올라온 매물과 모든 사용자의 거래내역을 볼 수 있다.
<br>
<br>
<div align="center"><img src="https://user-images.githubusercontent.com/62837074/194317035-08d13ee3-ec6c-463c-b991-90507b5a3c3d.png" width=600 height=150/></div>
● 현재 판매 중인 매물의 내용을 확인할 수 있다. 

<br>
<div align="center"><img src="https://user-images.githubusercontent.com/62837074/194317038-50677dd5-8703-4948-9fb7-cb7eeffd31a1.png" width=600 height=150/></div>
● 체결된 거래기록을 확인할 수 있다. 생성된 해시값과 거래 시간, 그리고 거래정보를 확인할 수 있다. 
<br>
<br>
<div align="center"><img src="https://user-images.githubusercontent.com/62837074/194317040-f7eee3bc-8847-407c-a32f-2b12a8cbf933.png" width=600 height=400/></div>
<div align="center">[tax관리자의 tax 수정 메뉴]</div>
<br>
●  국세청 관리자로 로그인하면 tax를 정할 수 있다. 이때 tax는 % 단위로 적용된다. 0~100 사이의 숫자를 입력하지 않으면 Modal창이 나타나 입력을 제한하게 된다.

<hr>

### 4. 소개 및 시연 영상
[![부산대학교 정보컴퓨터공학부 소개](http://img.youtube.com/vi/df4CwBAZTM0/0.jpg)](https://youtu.be/df4CwBAZTM0)    


<hr>

### 5. 사용법
● 원할한 사용을 위해 설치해야 할 것은 크게 hyperledger fabric, spring, react, mysql 네 가지로 구분된다. 우선 hyperledger fabric 설치부터 한다.<br>
● 다음 링크에서 hyperledger fabric을 설치하고 테스트를 한다. <a href="https://hyperledger-fabric.readthedocs.io/en/latest/getting_started.html">hyperledger fabric 공식 문서</a><br>
● hyperledger fabric이 요구하는 docker, golang 등 모든 요소를 설치하도록 하자.<br>
● 다음 링크의 Using the Fabric test network까지만 잘 실행 된다면 Hyperledger fabric은 설치가 완료된 것이다. <a href="https://hyperledger-fabric.readthedocs.io/en/latest/test_network.html">Using the Fabric test network</a><br>
● react의 필요 모듈을 설치하기 위해서는 /web/test 폴더에서 "npm install" 명령어를 터미널에서 실행해 주기만 하면 된다. 그 후 "npm start"를 입력하면 자동으로 react는 작동하게 된다.<br>


### 블록체인 네트워크 사용법
1. hyperledger-fabric공식 홈페이지 
https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html 
운영체제별로 프로그램을 깔아준다. 

2. 블록체인 네트워크 실행
```
cd AASing/AAS

AASing/AAS ./refresh.sh

./CC_commit.sh
```


### 서버 사용법
● Springboot와 mysql을 사용한다.


1. intelliJ에서 서버 프로젝트 열기
  
    AASing/AAS/Server_REC/build.gradle

    
2. Mysql

● user 테이블 생성 

```sql
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `chaincode_name` varchar(255) DEFAULT NULL,
  `channel_name` varchar(255) DEFAULT NULL,
  `msp_id` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `peer_end_point` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

● user 테이블에 데이터 입력

```sql

INSERT INTO `user` (`id`,`chaincode_name`,`channel_name`,`msp_id`,`password`,`peer_end_point`,`role`,`user_id`) VALUES (1,'people','people','buyer',NULL,'localhost:9051','BUYER','Buyer_User1');
INSERT INTO `user` (`id`,`chaincode_name`,`channel_name`,`msp_id`,`password`,`peer_end_point`,`role`,`user_id`) VALUES (2,'people','people','buyer',NULL,'localhost:9051','BUYER','Buyer_User2');
INSERT INTO `user` (`id`,`chaincode_name`,`channel_name`,`msp_id`,`password`,`peer_end_point`,`role`,`user_id`) VALUES (3,'people','people','buyer',NULL,'localhost:9051','BUYER','Buyer_User3');
INSERT INTO `user` (`id`,`chaincode_name`,`channel_name`,`msp_id`,`password`,`peer_end_point`,`role`,`user_id`) VALUES (4,'people','people','seller',NULL,'localhost:7051','SELLER','Seller_User1');
INSERT INTO `user` (`id`,`chaincode_name`,`channel_name`,`msp_id`,`password`,`peer_end_point`,`role`,`user_id`) VALUES (5,'people','people','seller',NULL,'localhost:7051','SELLER','Seller_User2');
INSERT INTO `user` (`id`,`chaincode_name`,`channel_name`,`msp_id`,`password`,`peer_end_point`,`role`,`user_id`) VALUES (6,'market','market','koreapower',NULL,'localhost:11061','KOREAPOWER','koreapower_admin');
INSERT INTO `user` (`id`,`chaincode_name`,`channel_name`,`msp_id`,`password`,`peer_end_point`,`role`,`user_id`) VALUES (7,'revenue','revenue','tax',NULL,'localhost:11051','TAX','tax_admin');
```

서버 실행버튼 클릭

