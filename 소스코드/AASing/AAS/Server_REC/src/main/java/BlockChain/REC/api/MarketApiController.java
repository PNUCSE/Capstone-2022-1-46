package BlockChain.REC.api;

import BlockChain.REC.connection.EasilyConnect;
import BlockChain.REC.domain.Account;
import BlockChain.REC.dto.AssetDto;
import BlockChain.REC.dto.MarketDto;
import BlockChain.REC.dto.MemberDto;
import BlockChain.REC.dto.TradeDto;
import BlockChain.REC.repository.AccountRepository;
import BlockChain.REC.service.AccountService;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.yaml.snakeyaml.error.Mark;

import javax.validation.Valid;
import javax.xml.bind.DatatypeConverter;
import java.lang.reflect.Member;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class MarketApiController {
    private final AccountService accountService;
    private final AccountRepository accountRepository;

    @ApiOperation(value = "마켓 매물 조회" ,notes =  "마켓에서 판매중인 매물들을 조회합니다")
    @GetMapping("/api/Market")
    public List<MarketDto> getMarket() throws Exception{
        Account account = accountRepository.findByUsername("koreapower_admin");
        MemberDto memberDto = new MemberDto(account);
        EasilyConnect easilyConnect = new EasilyConnect(memberDto);
        JsonArray Assets = easilyConnect.getMarket().getAsJsonArray();
        List<MarketDto> marketDtoList = new ArrayList<>();
        for(int i=0;i<Assets.size();++i){
            JsonObject asset = Assets.get(i).getAsJsonObject();
            MarketDto marketDto = new MarketDto(asset);
            if(marketDto.getState().equals("SALE")){
                marketDtoList.add(marketDto);
            }
        }
        return marketDtoList;
    }

    //진짜 단순하게 문자열만 보내면 됨 따음표도 팰요없음
    @PostMapping("/api/Market/myinfo")
    public List<MarketDto> getMyInfo(@RequestBody @Valid String ID) throws Exception{
        System.out.println(ID);
        Account account = accountRepository.findByUsername("koreapower_admin");
        MemberDto memberDto = new MemberDto(account);
        Account NOWaccount = accountRepository.findByUsername(ID);
        MemberDto memberDto2 = new MemberDto(NOWaccount);
        EasilyConnect easilyConnect = new EasilyConnect(memberDto);
        JsonArray Assets = easilyConnect.getMarket().getAsJsonArray();
        List<MarketDto> marketDtoList = new ArrayList<>();
        for(int i=0;i<Assets.size();++i){
            JsonObject asset = Assets.get(i).getAsJsonObject();
            MarketDto marketDto = new MarketDto(asset);
            if(memberDto2.getOriginal_id().equals("buyer")){
                if(marketDto.getBuyer().equals(ID) && marketDto.getState().equals("DONE") ){
                    marketDtoList.add(marketDto);
                }
            }
            else if(memberDto2.getOriginal_id().equals("seller")){
                if(marketDto.getSeller().equals(ID) && marketDto.getState().equals("DONE")){
                    marketDtoList.add(marketDto);
                }
            }
        }
        return marketDtoList;
    }

    //마켓의 거래완료목록 가져오는 함수
    @PostMapping("/api/Market/getDeal")
    public List<MarketDto> getAllDeal(@RequestBody @Valid String ID) throws Exception{
        System.out.println(ID);
        Account account = accountRepository.findByUsername("koreapower_admin");
        MemberDto memberDto = new MemberDto(account);
        EasilyConnect easilyConnect = new EasilyConnect(memberDto);
        JsonArray Assets = easilyConnect.getMarket().getAsJsonArray();
        List<MarketDto> marketDtoList = new ArrayList<>();
        for(int i=0;i<Assets.size();++i){
            JsonObject asset = Assets.get(i).getAsJsonObject();
            MarketDto marketDto = new MarketDto(asset);
            if(marketDto.getState().equals("DONE") ){
                marketDtoList.add(marketDto);
            }
        }
        return marketDtoList;
    }

    //마켓 어셋 수정 함수
    @PostMapping("/api/Market/dealupdate")
    public MarketDto dealupdate(@RequestBody @Valid AssetDto assetDto) throws Exception{
        Account marketAccount = accountRepository.findByUsername("koreapower_admin");
        MemberDto market = new MemberDto(marketAccount);
        EasilyConnect MarketConnect =  new EasilyConnect(market);
        MarketDto marketDto = new MarketDto(MarketConnect.getAssetByID(assetDto.getID()).getAsJsonObject());
//        marketDto.setREC(assetDto.getREC());
//        marketDto.setKRW(assetDto.getKRW());
        marketDto.setTime(LocalDateTime.now().toString());
        MarketConnect.UpdateAsset(marketDto);
        return marketDto;
    }

    @PostMapping("/api/Market/upREC")
    public MarketDto upREC(@RequestBody @Valid AssetDto assetDto) throws Exception{
        Account marketAccount = accountRepository.findByUsername("koreapower_admin");
        MemberDto market = new MemberDto(marketAccount);
        EasilyConnect MarketConnect =  new EasilyConnect(market);
        MarketDto marketDto = new MarketDto(MarketConnect.getAssetByID(assetDto.getID()).getAsJsonObject());
        marketDto.addREC(assetDto.getREC());
        //marketDto.setREC(marketDto.getREC() + assetDto.getREC());
        MarketConnect.UpdateAsset(marketDto);

        Account Selleraccount = accountRepository.findByUsername(assetDto.getID());
        MemberDto seller = new MemberDto(Selleraccount);
        EasilyConnect SellerConnect = new EasilyConnect(seller);
        AssetDto sellDto = new AssetDto(SellerConnect.getAssetByID(assetDto.getID()).getAsJsonObject());
        sellDto.minusREC(assetDto.getREC());
        SellerConnect.UpdateAsset(sellDto);
        return marketDto;
    }
    @PostMapping("/api/Market/upKRW")
    public MarketDto upKRW(@RequestBody @Valid AssetDto assetDto) throws Exception{
        Account marketAccount = accountRepository.findByUsername("koreapower_admin");
        MemberDto market = new MemberDto(marketAccount);
        EasilyConnect MarketConnect =  new EasilyConnect(market);
        MarketDto marketDto = new MarketDto(MarketConnect.getAssetByID(assetDto.getID()).getAsJsonObject());
        marketDto.changeKRW(assetDto.getKRW());
        MarketConnect.UpdateAsset(marketDto);
        return marketDto;
    }


    /*
    거래 함수
    {
    "id" : "asd",
    "buyer" : "sell",
    "krw" : 5,
    "rec" : 10
    }
     */
    @PostMapping("/api/Market/trade")
    public String trading(@RequestBody @Valid TradeDto tradeDto) throws Exception{
        System.out.println(tradeDto.toString());
        Account marketAccount = accountRepository.findByUsername("koreapower_admin");
        MemberDto market = new MemberDto(marketAccount);
        EasilyConnect MarketConnect =  new EasilyConnect(market);
        //시장
        MarketDto marketDto = new MarketDto(MarketConnect.getAssetByID(tradeDto.getId()).getAsJsonObject());
        marketDto.minusREC(tradeDto.getRec());
//        marketDto.setREC(marketDto.getREC() - tradeDto.getRec());
        marketDto.setTime(LocalDateTime.now().toString());
        marketDto.setBuyer(tradeDto.getBuyer());

        MessageDigest md = MessageDigest.getInstance("SHA-256");
        String password = marketDto.toString();
        byte[] digest = md.digest(password.getBytes(StandardCharsets.UTF_8));
        String sha256 = DatatypeConverter.printHexBinary(digest).toLowerCase();
        MarketDto newDeal = new MarketDto("asset",sha256,marketDto.getSeller(), marketDto.getBuyer(),tradeDto.getRec(),tradeDto.getKrw(),"DONE", marketDto.getTime());
        System.out.println(newDeal.toString());

        //구매자 돈뺴기
        Account Buyeraccount = accountRepository.findByUsername(tradeDto.getBuyer());
        MemberDto buyer = new MemberDto(Buyeraccount);
        EasilyConnect BuyerConnect = new EasilyConnect(buyer);
        AssetDto BuyerDto = new AssetDto(BuyerConnect.getAssetByID(tradeDto.getBuyer()).getAsJsonObject());
        BuyerDto.minusKRW(tradeDto.getKrw());
        BuyerDto.addREC(tradeDto.getRec());

//        BuyerDto.setKRW(BuyerDto.getKRW() - tradeDto.getKrw());
//        BuyerDto.setREC(BuyerDto.getREC() + tradeDto.getRec());


        //판매자 돈넣기
        Account Selleraccount = accountRepository.findByUsername(tradeDto.getId());
        MemberDto seller = new MemberDto(Selleraccount);
        EasilyConnect SellerConnect = new EasilyConnect(seller);
        AssetDto sellDto = new AssetDto(SellerConnect.getAssetByID(tradeDto.getId()).getAsJsonObject());
        sellDto.addKRW(tradeDto.getKrw());
        //sellDto.setKRW(sellDto.getKRW() + tradeDto.getKrw());

//        if(BuyerDto.getKRW() < 0 || marketDto.getREC() < 0) return "Fail!";
        System.out.println("수정할 마켓 : " + marketDto.toString());
        System.out.println("수정된 바이어 정보 : " + BuyerDto.toString());
        System.out.println("수정된 셀러 정보 : " + sellDto.toString());
        System.out.println("새로운 거래 정보 : " + newDeal.toString());
        MarketConnect.UpdateAsset(marketDto);
        BuyerConnect.UpdateAsset(BuyerDto);
        SellerConnect.UpdateAsset(sellDto);
        MarketConnect.createAsset(newDeal);
        return "success";
    }

}
