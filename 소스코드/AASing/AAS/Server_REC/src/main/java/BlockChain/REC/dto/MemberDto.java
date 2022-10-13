package BlockChain.REC.dto;

import BlockChain.REC.domain.Account;
import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
public class MemberDto {

  private String original_id;

  public MemberDto(String original_id, String mspID, String channelName, String chaincodeName, Path cryptoPath, Path certPath, Path keyDirPath, Path tlsCertPath, String peerEndpoint, String overrideAuth, String ID, String user) {
    this.original_id = original_id;
    this.mspID = mspID;
    this.channelName = channelName;
    this.chaincodeName = chaincodeName;
    this.cryptoPath = cryptoPath;
    this.certPath = certPath;
    this.keyDirPath = keyDirPath;
    this.tlsCertPath = tlsCertPath;
    this.peerEndpoint = peerEndpoint;
    this.overrideAuth = overrideAuth;
    this.ID = ID;
    User = user;
  }

  private String mspID;
  private String channelName;
  private String chaincodeName;

  // Path to crypto materials.
  private Path cryptoPath;
  // Path to user certificate.
  private Path certPath;
  // Path to user private key directory.
  private Path keyDirPath;
  // Path to peer tls certificate.
  private Path tlsCertPath;
  private final Path basePath = Paths.get("..","AASing","AAS");
  private String peerEndpoint;
  private String overrideAuth;

  private String ID;
  private String User;

  public MemberDto(Account account) {
    this.original_id = account.getMsp_id();
    this.ID = account.getUser_id();
    this.User = this.ID.substring(this.ID.length()-5);
    this.mspID = String.format("%sMSP", account.getMsp_id());
    this.channelName = account.getChannel_name();
    this.chaincodeName = account.getChaincode_name();
    this.cryptoPath = Paths.get("..","organizations", "peerOrganizations",
        String.format("%s.example.com", this.original_id));
    this.certPath = this.cryptoPath.resolve(Paths.get("users",
        String.format("%s@%s.example.com",this.User, this.original_id), "msp", "signcerts",
        String.format("%s@%s.example.com-cert.pem",this.User, this.original_id)));
    this.keyDirPath = this.cryptoPath.resolve(Paths.get("users", String.format("%s@%s.example.com",this.User, this.original_id), "msp", "keystore"));;
    this.tlsCertPath = this.cryptoPath.resolve(Paths.get("peers",
        String.format("peer0.%s.example.com", this.original_id), "tls", "ca.crt"));;
    this.peerEndpoint = account.getPeer_end_point();
    this.overrideAuth = String.format("peer0.%s.example.com", this.original_id);

//    System.out.println("ID : " + this.ID);
//    System.out.println("User : "+this.User);
//    System.out.println("original_id : " + original_id);
//    System.out.println("mspID : " + mspID);
//    System.out.println("cryptoPath : " + cryptoPath + "권한 : " + this.cryptoPath.toFile().canRead());
//    System.out.println("certPath : " + certPath + "권한 : " + this.certPath.toFile().canRead());
//    System.out.println("keyDirPath : " + keyDirPath );
//    System.out.println("tlsCertPath : " + tlsCertPath  + "권한 : " + this.tlsCertPath.toFile().canRead());
//    System.out.println("channelName : " + channelName);
//    System.out.println("chaincodeName : " + chaincodeName);
//    System.out.println("peerEndpoint : " + peerEndpoint);
//    System.out.println("overrideAuth : " + overrideAuth);
  }

}
