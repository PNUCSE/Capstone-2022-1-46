/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParser;
import io.grpc.ManagedChannel;
import io.grpc.netty.shaded.io.grpc.netty.GrpcSslContexts;
import io.grpc.netty.shaded.io.grpc.netty.NettyChannelBuilder;
import org.hyperledger.fabric.client.CommitException;
import org.hyperledger.fabric.client.CommitStatusException;
import org.hyperledger.fabric.client.Contract;
import org.hyperledger.fabric.client.EndorseException;
import org.hyperledger.fabric.client.Gateway;
import org.hyperledger.fabric.client.GatewayException;
import org.hyperledger.fabric.client.SubmitException;
import org.hyperledger.fabric.client.identity.Identities;
import org.hyperledger.fabric.client.identity.Identity;
import org.hyperledger.fabric.client.identity.Signer;
import org.hyperledger.fabric.client.identity.Signers;
import org.hyperledger.fabric.client.identity.X509Identity;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.InvalidKeyException;
import java.security.cert.CertificateException;
import java.time.Instant;
import java.util.concurrent.TimeUnit;

public final class App {

	private static final String mspID = "buyerMSP";
	private static final String channelName = "people";
	private static final String chaincodeName = "people";

	// Path to crypto materials.
	private static final Path cryptoPath = Paths.get("..","organizations", "peerOrganizations", "buyer.example.com");
	// Path to user certificate.
	private static final Path certPath = cryptoPath.resolve(Paths.get("users", "User1@buyer.example.com", "msp", "signcerts", "User1@buyer.example.com-cert.pem"));
	// Path to user private key directory.
	private static final Path keyDirPath = cryptoPath.resolve(Paths.get("users", "User1@buyer.example.com", "msp", "keystore"));
	// Path to peer tls certificate.
	private static final Path tlsCertPath = cryptoPath.resolve(Paths.get("peers", "peer0.buyer.example.com", "tls", "ca.crt"));

	// Gateway peer end point.
	//private static final String peerEndpoint = "localhost:7051";
	private static final String peerEndpoint = "localhost:9051";
	private static final String overrideAuth = "peer0.buyer.example.com";

	private final Contract contract;
	private final String assetId = "asset" + Instant.now().toEpochMilli();
	private final Gson gson = new GsonBuilder().setPrettyPrinting().create();

	public static void main(final String[] args) throws Exception {
		System.out.println("Working Directory = " + System.getProperty("user.dir"));
		// The gRPC client connection should be shared by all Gateway connections to
		// this endpoint.
		var channel = newGrpcConnection();

		var builder = Gateway.newInstance().identity(newIdentity()).signer(newSigner()).connection(channel)
				// Default timeouts for different gRPC calls
				.evaluateOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
				.endorseOptions(options -> options.withDeadlineAfter(15, TimeUnit.SECONDS))
				.submitOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
				.commitStatusOptions(options -> options.withDeadlineAfter(1, TimeUnit.MINUTES));
		System.out.println(cryptoPath);
		System.out.println(certPath);
		System.out.println(keyDirPath);
		System.out.println(tlsCertPath);
		try (var gateway = builder.connect()) {
			new App(gateway).run();
		} finally {
			channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
		}
	}

	private static ManagedChannel newGrpcConnection() throws IOException, CertificateException {
		var tlsCertReader = Files.newBufferedReader(tlsCertPath);
		var tlsCert = Identities.readX509Certificate(tlsCertReader);
		System.out.println(peerEndpoint);
		return NettyChannelBuilder.forTarget(peerEndpoint)
				.sslContext(GrpcSslContexts.forClient().trustManager(tlsCert).build()).overrideAuthority(overrideAuth)
				.build();
	}

	private static Identity newIdentity() throws IOException, CertificateException {
		var certReader = Files.newBufferedReader(certPath);
		var certificate = Identities.readX509Certificate(certReader);

		return new X509Identity(mspID, certificate);
	}

	private static Signer newSigner() throws IOException, InvalidKeyException {
		var keyReader = Files.newBufferedReader(getPrivateKeyPath());
		var privateKey = Identities.readPrivateKey(keyReader);

		return Signers.newPrivateKeySigner(privateKey);
	}

	private static Path getPrivateKeyPath() throws IOException {
		try (var keyFiles = Files.list(keyDirPath)) {
			return keyFiles.findFirst().orElseThrow();
		}
	}

	public App(final Gateway gateway) {
		// Get a network instance representing the channel where the smart contract is
		// deployed.
		var network = gateway.getNetwork(channelName);

		// Get the smart contract from the network.
		contract = network.getContract(chaincodeName);
	}

	public void run() throws GatewayException, CommitException {
		// Initialize a set of asset data on the ledger using the chaincode 'InitLedger' function.
		//initLedger();

		// Return all the current assets on the ledger.
		//getAllAssets();

		// Create a new asset on the ledger.
		//createAsset();
		getAllAssets();

		// Update an existing asset asynchronously.
		// transferAssetAsync();

		// Get the asset details by assetID.
		// readAssetById();

		// Update an asset which does not exist.
		// updateNonExistentAsset();
	}

	/**
	 * This type of transaction would typically only be run once by an application
	 * the first time it was started after its initial deployment. A new version of
	 * the chaincode deployed later would likely not need to run an "init" function.
	 */
	private void initLedger() throws EndorseException, SubmitException, CommitStatusException, CommitException {
		System.out.println("\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger");

		contract.submitTransaction("InitLedger");

		System.out.println("*** Transaction committed successfully");
	}

	/**
	 * Evaluate a transaction to query ledger state.
	 */
	private void getAllAssets() throws GatewayException {
		System.out.println("\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger");

		var result = contract.evaluateTransaction("GetAllAssets");

		System.out.println("*** Result: " + prettyJson(result));
	}

	private String prettyJson(final byte[] json) {
		return prettyJson(new String(json, StandardCharsets.UTF_8));
	}

	private String prettyJson(final String json) {
		var parsedJson = JsonParser.parseString(json);
		return gson.toJson(parsedJson);
	}

	/**
	 * Submit a transaction synchronously, blocking until it has been committed to
	 * the ledger.
	 */
	private void createAsset() throws EndorseException, SubmitException, CommitStatusException, CommitException {
		System.out.println("\n--> Submit Transaction: CreateAsset, creates new asset with ID, Color, Size, Owner and AppraisedValue arguments");

		contract.submitTransaction("CreateAsset", "sex3", "fuck", "5", "300000","done");

		System.out.println("*** Transaction committed successfully");
	}

	/**
	 * Submit transaction asynchronously, allowing the application to process the
	 * smart contract response (e.g. update a UI) while waiting for the commit
	 * notification.
	 */
	private void transferAssetAsync() throws EndorseException, SubmitException, CommitStatusException {
		System.out.println("\n--> Async Submit Transaction: TransferAsset, updates existing asset owner");

		var commit = contract.newProposal("TransferAsset")
				.addArguments(assetId, "Saptha")
				.build()
				.endorse()
				.submitAsync();

		var result = commit.getResult();
		var oldOwner = new String(result, StandardCharsets.UTF_8);

		System.out.println("*** Successfully submitted transaction to transfer ownership from " + oldOwner + " to Saptha");
		System.out.println("*** Waiting for transaction commit");

		var status = commit.getStatus();
		if (!status.isSuccessful()) {
			throw new RuntimeException("Transaction " + status.getTransactionId() +
					" failed to commit with status code " + status.getCode());
		}

		System.out.println("*** Transaction committed successfully");
	}

	private void readAssetById() throws GatewayException {
		System.out.println("\n--> Evaluate Transaction: ReadAsset, function returns asset attributes");

		var evaluateResult = contract.evaluateTransaction("ReadAsset", assetId);

		System.out.println("*** Result:" + prettyJson(evaluateResult));
	}

	/**
	 * submitTransaction() will throw an error containing details of any error
	 * responses from the smart contract.
	 */
	private void updateNonExistentAsset() {
		try {
			System.out.println("\n--> Submit Transaction: UpdateAsset asset70, asset70 does not exist and should return an error");

			contract.submitTransaction("UpdateAsset", "asset70", "blue", "5", "Tomoko", "300");

			System.out.println("******** FAILED to return an error");
		} catch (EndorseException | SubmitException | CommitStatusException e) {
			System.out.println("*** Successfully caught the error: ");
			e.printStackTrace(System.out);
			System.out.println("Transaction ID: " + e.getTransactionId());

			var details = e.getDetails();
			if (!details.isEmpty()) {
				System.out.println("Error Details:");
				// for (var detail : details) {
				// 	System.out.println("- address: " + detail.getAddress() + ", mspId: " + detail.getMspId()
				// 			+ ", message: " + detail.getMessage());
				// }
			}
		} catch (CommitException e) {
			System.out.println("*** Successfully caught the error: " + e);
			e.printStackTrace(System.out);
			System.out.println("Transaction ID: " + e.getTransactionId());
			System.out.println("Status code: " + e.getCode());
		}
	}
}
