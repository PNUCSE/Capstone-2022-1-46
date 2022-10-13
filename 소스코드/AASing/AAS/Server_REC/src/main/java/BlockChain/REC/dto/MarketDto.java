package BlockChain.REC.dto;

import com.google.gson.JsonObject;
import java.time.LocalDateTime;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
public class MarketDto {
    private String DocType;
    private String ID;
    private String Seller;
    private String Buyer;
    private int REC;
    private int KRW;
    private String state;
    private String time;

    public MarketDto(String docType, String ID, String seller, String buyer, int REC, int KRW, String state, String time) {
        DocType = docType;
        this.ID = ID;
        Seller = seller;
        Buyer = buyer;
        this.REC = REC;
        this.KRW = KRW;
        this.state = state;
        this.time = time;
    }
    public MarketDto(JsonObject asset){
        this.DocType = asset.get("docType").getAsString();
        this.ID = asset.get("ID").getAsString();
        this.Seller = asset.get("seller").getAsString();
        this.Buyer = asset.get("buyer").getAsString();
        this.REC = asset.get("REC").getAsInt();
        this.KRW = asset.get("KRW").getAsInt();
        this.state = asset.get("State").getAsString();
        this.time = asset.get("Time").getAsString();
        //this.time = asset.get("Time").getAsString();
    }

    public void addREC(int increment){
        this.REC += increment;
    }

    public void changeKRW(int KRW){
        this.KRW = KRW;
    }

    public void minusREC(int decrement) {
        this.REC -= decrement;
    }
}
