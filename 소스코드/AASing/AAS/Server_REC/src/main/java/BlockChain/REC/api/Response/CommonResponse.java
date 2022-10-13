package BlockChain.REC.api.Response;

import lombok.Data;

@Data
public class CommonResponse {
    boolean success;
    int statusCode;
    String message;

    public CommonResponse(boolean success, int statusCode, String message) {
        this.success = success;
        this.statusCode = statusCode;
        this.message = message;
    }
}
