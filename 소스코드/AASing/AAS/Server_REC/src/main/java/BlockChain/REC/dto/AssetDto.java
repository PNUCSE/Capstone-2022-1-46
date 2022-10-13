package BlockChain.REC.dto;

import com.google.gson.JsonObject;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;


@NoArgsConstructor
@Data
public class AssetDto {
  private String docType;
  private String ID;
  private int REC;
  private int KRW;
  private String Role;
  public AssetDto(JsonObject asset) {
        this.docType = asset.get("docType").getAsString();
        this.ID = asset.get("ID").getAsString();
        this.REC = asset.get("REC").getAsInt();
        this.KRW = asset.get("KRW").getAsInt();
        this.Role = asset.get("Role").getAsString();
  }
  public void addREC(int increment){
    this.REC += increment;
  }
  public void addKRW(int increment){
    this.KRW += increment;
  }

  public void minusREC(int decrement){
    this.REC -= decrement;
  }
  public void minusKRW(int decrement){
    this.KRW -= decrement;
  }
}
