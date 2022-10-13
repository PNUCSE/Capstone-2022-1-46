package BlockChain.REC.dto;

import com.google.gson.JsonObject;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
public class HistoryDto {
    /*
    type HistoryQueryResult struct {
        Record    *Asset    `json:"record"`
        TxId      string    `json:"txId"`
        Timestamp time.Time `json:"timestamp"`
        IsDelete  bool      `json:"isDelete"`
    }
     */
    private AssetDto record;
    private String Txid;
    private String Timestamp;
    private boolean Isdelete;


    public HistoryDto(AssetDto record, String txid, String timestamp, boolean isdelete) {
        this.record = record;
        Txid = txid;
        Timestamp = timestamp;
        Isdelete = isdelete;
    }
}
