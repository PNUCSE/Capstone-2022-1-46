package BlockChain.REC.dto;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
public class TradeDto {
    private String id;
    private String buyer;
    private int krw;
    private int rec;

    public TradeDto(String id, String buyer, int krw, int rec) {
        this.id = id;
        this.buyer = buyer;
        this.krw = krw;
        this.rec = rec;
    }

}
