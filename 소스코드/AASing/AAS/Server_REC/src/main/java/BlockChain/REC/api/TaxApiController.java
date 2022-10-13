package BlockChain.REC.api;

import BlockChain.REC.connection.EasilyConnect;
import BlockChain.REC.domain.Account;
import BlockChain.REC.dto.MemberDto;
import BlockChain.REC.dto.TaxDto;
import BlockChain.REC.repository.AccountRepository;
import BlockChain.REC.service.AccountService;
import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequiredArgsConstructor
public class TaxApiController {
    private final AccountService accountService;
    private final AccountRepository accountRepository;


    @GetMapping("/api/tax")
    public int getTax() throws Exception{
        Account account = accountRepository.findByUsername("tax_admin");
        MemberDto memberDto = new MemberDto(account);
        EasilyConnect easilyConnect = new EasilyConnect(memberDto);
        JsonObject asset = easilyConnect.getTax().getAsJsonObject();
        TaxDto taxDto = new TaxDto(asset);
        return taxDto.getTax();
    }

    @PostMapping("/api/updateTax")
    public String setTax(@RequestBody @Valid TaxDto taxDto) throws Exception{
        if(!taxDto.getId().equals("tax_admin") ) return "Fail";
        Account account = accountRepository.findByUsername("tax_admin");
        MemberDto memberDto = new MemberDto(account);
        EasilyConnect easilyConnect = new EasilyConnect(memberDto);
        easilyConnect.UpdateAsset(taxDto);
        return "Success";
    }


}
