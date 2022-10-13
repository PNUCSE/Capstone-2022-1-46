package BlockChain.REC.api;

import BlockChain.REC.api.Response.CommonResponse;
import BlockChain.REC.connection.EasilyConnect;
import BlockChain.REC.domain.Account;
import BlockChain.REC.dto.AssetDto;
import BlockChain.REC.dto.HistoryDto;
import BlockChain.REC.dto.MarketDto;
import BlockChain.REC.dto.MemberDto;
import BlockChain.REC.repository.AccountRepository;
import BlockChain.REC.service.AccountService;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.checkerframework.checker.units.qual.A;
import org.hyperledger.fabric.client.CommitException;
import org.hyperledger.fabric.client.CommitStatusException;
import org.hyperledger.fabric.client.EndorseException;
import org.hyperledger.fabric.client.SubmitException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import static BlockChain.REC.config.MagicValue.*;

@RestController
@RequiredArgsConstructor
public class AccountApiController {

    private final AccountService accountService;
    private final AccountRepository accountRepository;

    /**
     * username 중복 검사 API
     * @param username user_id
     * @return CommonResponse
     */
    @GetMapping("/api/signin/exists")
    public CommonResponse checkUsername(@RequestParam @Valid String username){
        boolean success = accountService.validateDuplicateUsername(username);
        String msg = (!success) ? UNIQUE_USERNAME_MESSAGE : EXISTS_USERNAME_MESSAGE;
        return new CommonResponse(success,SUCCESS_STATUS_CODE,msg);
    }

    /**
     * 로그인 API
     * @return CommonResponse
     */
    @PostMapping("/api/login")
    public CommonResponse Login(@RequestBody @Valid LoginRequest request){
        boolean result = accountService.Login(request.getUsername(), request.getPassword());
        String msg = (result) ? LOGIN_SUCCESS_MESSAGE : LOGIN_FAIL_MESSAGE;
        return new CommonResponse(result,SUCCESS_STATUS_CODE,msg);
    }

    //여기부터 api
    @GetMapping("/api/getall/{id}")
    public List<AssetDto> testConnect(@PathVariable String id) throws Exception {
        Account account = accountRepository.findByUsername(id);
        MemberDto memberDto = new MemberDto(account);
        EasilyConnect easilyConnect = new EasilyConnect(memberDto);
        JsonArray Assets = easilyConnect.GetAllAssets().getAsJsonArray();
        List<AssetDto> assetDtoList = new ArrayList<>();
        for(int i=0;i<Assets.size();++i){
            JsonObject asset = Assets.get(i).getAsJsonObject();
            assetDtoList.add(new AssetDto(asset));
        }
        return assetDtoList;
    }
    @GetMapping("/api/getHistory/{id}")
    public String getHistory(@PathVariable String id) throws Exception{
        Account account = accountRepository.findByUsername(id);
        MemberDto memberDto = new MemberDto(account);
        EasilyConnect easilyConnect = new EasilyConnect(memberDto);
        JsonArray Assets = easilyConnect.getAssetHistory().getAsJsonArray();
        return Assets.toString();
    }
    @GetMapping("/api/logininfo/{id}")
    public AssetDto getLogininfo(@PathVariable String id) throws Exception{
        Account account = accountRepository.findByUsername(id);
        MemberDto memberDto = new MemberDto(account);
        EasilyConnect easilyConnect = new EasilyConnect(memberDto);
        JsonElement Assets = easilyConnect.getAssetByID(memberDto.getID());
        AssetDto assetDto = new AssetDto(Assets.getAsJsonObject());
        return assetDto;
    }

    @PostMapping("/api/makeREC")
    public AssetDto upREC(@RequestBody @Valid AssetDto assetDto) throws Exception{
        Account SellerAccount = accountRepository.findByUsername(assetDto.getID());
        MemberDto seller = new MemberDto(SellerAccount);
        EasilyConnect SellerConnect = new EasilyConnect(seller);
        AssetDto sellDto = new AssetDto(SellerConnect.getAssetByID(assetDto.getID()).getAsJsonObject());
        sellDto.addREC(assetDto.getREC());
        //sellDto.setREC(sellDto.getREC() + assetDto.getREC());
        SellerConnect.UpdateAsset(sellDto);
        return sellDto;
    }
    @PostMapping("/api/exchangeKRW")
    public AssetDto exchangeKRW(@RequestBody @Valid AssetDto assetDto) throws Exception{
        Account SellerAccount = accountRepository.findByUsername(assetDto.getID());
        MemberDto seller = new MemberDto(SellerAccount);
        EasilyConnect SellerConnect = new EasilyConnect(seller);
        AssetDto sellDto = new AssetDto(SellerConnect.getAssetByID(assetDto.getID()).getAsJsonObject());
        sellDto.minusKRW(-assetDto.getKRW());
        //sellDto.setKRW(sellDto.getKRW() - assetDto.getKRW());
        SellerConnect.UpdateAsset(sellDto);
        return sellDto;
    }
    @PostMapping("/api/minusREC")
    public AssetDto minusREC(@RequestBody @Valid AssetDto assetDto) throws Exception{
        Account BuyerAccount = accountRepository.findByUsername(assetDto.getID());
        MemberDto buyer = new MemberDto(BuyerAccount);
        EasilyConnect BuyerConnect = new EasilyConnect(buyer);
        AssetDto buyDto = new AssetDto(BuyerConnect.getAssetByID(assetDto.getID()).getAsJsonObject());
        buyDto.minusREC(assetDto.getREC());
        BuyerConnect.UpdateAsset(buyDto);
        return buyDto;
    }
    @PostMapping("/api/chargeKRW")
    public AssetDto chargeKRW(@RequestBody @Valid AssetDto assetDto) throws Exception{
        Account BuyerAccount = accountRepository.findByUsername(assetDto.getID());
        MemberDto buyer = new MemberDto(BuyerAccount);
        EasilyConnect BuyerConnect = new EasilyConnect(buyer);
        AssetDto buyDto = new AssetDto(BuyerConnect.getAssetByID(assetDto.getID()).getAsJsonObject());
        buyDto.addKRW (assetDto.getKRW());
        BuyerConnect.UpdateAsset(buyDto);
        return buyDto;
    }





    @PostMapping("/api/controlAsset")
    public AssetDto updateAsset(@RequestBody @Valid AssetDto assetDto) throws Exception {
        System.out.println(assetDto.toString());
        Account account = accountRepository.findByUsername(assetDto.getID());
        MemberDto memberDto = new MemberDto(account);
        EasilyConnect easilyConnect = new EasilyConnect(memberDto);
        easilyConnect.UpdateAsset(assetDto);
        return assetDto;
    }

}
