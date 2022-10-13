package BlockChain.REC.api.Response;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AccountResponse extends CommonResponse{
    private Long id;

    public AccountResponse(boolean success, int statusCode, String message, Long id) {
        super(success, statusCode, message);
        this.id = id;
    }
}
