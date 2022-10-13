package BlockChain.REC.domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.persistence.*;

import static BlockChain.REC.domain.Role.NOT_PERMITTED;

@Entity
@Getter @Setter
@Table(name = "User")
public class Account {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String user_id;
    private String password;

    private String msp_id;

    private String channel_name;

    private String chaincode_name;

    private String peer_end_point;

    @Enumerated(EnumType.STRING)
    private Role role;

    public Account createAccount(Account account, PasswordEncoder passwordEncoder){
        account.setPassword(passwordEncoder.encode(password));
        account.setRole(NOT_PERMITTED);
        return account;
    }

}
