package BlockChain.REC.connection;

import BlockChain.REC.dto.AssetDto;
import BlockChain.REC.dto.MarketDto;
import BlockChain.REC.dto.MemberDto;
import BlockChain.REC.dto.TaxDto;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import io.grpc.ManagedChannel;
import io.grpc.netty.shaded.io.grpc.netty.GrpcSslContexts;
import io.grpc.netty.shaded.io.grpc.netty.NettyChannelBuilder;
import lombok.Data;
import org.hyperledger.fabric.client.*;
import org.hyperledger.fabric.client.identity.*;
import org.yaml.snakeyaml.error.Mark;

import java.io.IOException;
import java.lang.reflect.Member;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.InvalidKeyException;
import java.security.cert.CertificateException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.concurrent.TimeUnit;

@Data
public class EasilyConnect {
    private MemberDto memberDto;
    private Contract contract;

    public EasilyConnect(MemberDto memberDto) throws Exception {
        this.memberDto = memberDto;
        var channel = newGrpcConnection();
        var builder = Gateway.newInstance().identity(newIdentity()).signer(newSigner()).connection(channel)
                // Default timeouts for different gRPC calls
                .evaluateOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
                .endorseOptions(options -> options.withDeadlineAfter(15, TimeUnit.SECONDS))
                .submitOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
                .commitStatusOptions(options -> options.withDeadlineAfter(1, TimeUnit.MINUTES));
        var gateway = builder.connect();
        var network = gateway.getNetwork(this.memberDto.getChannelName());
        this.contract = network.getContract(memberDto.getChaincodeName());
    }


    private ManagedChannel newGrpcConnection() throws IOException, CertificateException {
        var tlsCertReader = Files.newBufferedReader(this.memberDto.getTlsCertPath());
        var tlsCert = Identities.readX509Certificate(tlsCertReader);
        return NettyChannelBuilder.forTarget(this.memberDto.getPeerEndpoint())
                .sslContext(GrpcSslContexts.forClient().trustManager(tlsCert).build()).overrideAuthority(this.memberDto.getOverrideAuth())
                .build();
    }

    private Identity newIdentity() throws IOException, CertificateException {
        var certReader = Files.newBufferedReader(memberDto.getCertPath());
        var certificate = Identities.readX509Certificate(certReader);
        return new X509Identity(memberDto.getMspID(), certificate);
    }

    private Signer newSigner() throws IOException, InvalidKeyException {
        var keyReader = Files.newBufferedReader(getPrivateKeyPath());
        var privateKey = Identities.readPrivateKey(keyReader);
        return Signers.newPrivateKeySigner(privateKey);
    }

    private Path getPrivateKeyPath() throws IOException {
        try (var keyFiles = Files.list(memberDto.getKeyDirPath())) {
            return keyFiles.findFirst().orElseThrow();
        }
    }

    public JsonElement GetAllAssets() throws GatewayException {
        var result = contract.evaluateTransaction("GetAllAssets");
        System.out.println(prettyJson(result));
        return prettyJson(result);
    }

    public JsonElement getTax() throws GatewayException{
        var result = contract.evaluateTransaction("ReadAsset","TAX");
        System.out.println(prettyJson(result));
        return prettyJson(result);
    }

    public JsonElement getAssetByID(String id) throws GatewayException{
        System.out.println(this.memberDto.toString());
        var result = contract.evaluateTransaction("ReadAsset",id);
        System.out.println(prettyJson(result));
        return prettyJson(result);
    }

    public JsonElement getAssetHistory() throws GatewayException{
        System.out.println("MspID : %s".format(memberDto.getMspID()));
        var result = contract.evaluateTransaction("GetAssetHistory", this.memberDto.getID());
        System.out.println(prettyJson(result));
        return prettyJson(result);
    }

    public void createAsset(AssetDto assetDto) throws EndorseException, SubmitException, CommitStatusException, CommitException{
        contract.submitTransaction("CreateAsset",
                assetDto.getID(),
                Integer.toString(assetDto.getREC()),
                Integer.toString(assetDto.getKRW()),
                assetDto.getRole()
        );
    }
    public void createAsset(MarketDto marketDto) throws EndorseException, SubmitException, CommitStatusException, CommitException{
        contract.submitTransaction("CreateAsset",
                marketDto.getID(),
                marketDto.getSeller(),
                marketDto.getBuyer(),
                Integer.toString(marketDto.getREC()),
                Integer.toString(marketDto.getKRW()),
                marketDto.getState(),
                marketDto.getTime()
        );
    }

   public void UpdateAsset(MarketDto marketDto) throws EndorseException, SubmitException, CommitStatusException, CommitException{
    contract.submitTransaction("UpdateAsset",
            marketDto.getID(),
            marketDto.getSeller(),
            marketDto.getBuyer(),
            Integer.toString(marketDto.getREC()),
            Integer.toString(marketDto.getKRW()),
            marketDto.getState(),
            marketDto.getTime()
            );
    }
    public void UpdateAsset(AssetDto assetDto) throws EndorseException, SubmitException, CommitStatusException, CommitException{
        contract.submitTransaction("UpdateAsset",
                assetDto.getID(),
                Integer.toString(assetDto.getREC()),
                Integer.toString(assetDto.getKRW()),
                assetDto.getRole());
    }
    public void UpdateAsset(TaxDto taxDto) throws EndorseException, SubmitException, CommitStatusException, CommitException{
        contract.submitTransaction("UpdateAsset",
                "TAX",
                "REVENUE",
                Integer.toString(taxDto.getTax())
        );
    }


    /*여기부터 market*/
    public JsonElement getMarket() throws GatewayException, CommitException{
        var result = contract.evaluateTransaction("GetAllAssets");
        System.out.println(prettyJson(result));
        return prettyJson(result);
    }

    private void initLedger() throws EndorseException, SubmitException, CommitStatusException, CommitException {
        contract.submitTransaction("InitLedger");
    }

    private JsonElement prettyJson(final byte[] json) {
        return prettyJson(new String(json, StandardCharsets.UTF_8));
    }
    private JsonElement prettyJson(final String json) {
        return JsonParser.parseString(json);
    }

}
