package BlockChain.REC.service;

import BlockChain.REC.domain.Account;
import BlockChain.REC.domain.Role;
import BlockChain.REC.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static BlockChain.REC.config.MagicValue.EXISTS_USERNAME_MESSAGE;
import static BlockChain.REC.config.MagicValue.LOGIN_FAIL_MESSAGE;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AccountService implements UserDetailsService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;



    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = this.accountRepository.findByUsername(username);

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(account.getRole().name()));
        return new User(account.getUser_id(),account.getPassword(),authorities);
    }
    /**
     * 로그인 메서드
     * @return 로그인 성공여부(Boolean)
     */
    public boolean Login(String username, String password){
        Account account = accountRepository.findByUsername(username);
        if (!passwordEncoder.matches(password,account.getPassword())){
            throw new IllegalStateException(LOGIN_FAIL_MESSAGE);
        }
        return true;
    }

    /**
     * 유저 조회
     */

    /**
     * 회원 정보 변경(Transactional)
     * (비밀번호 암호화 필요)
     */


    /**
     * 중복 user_ID가 있는지 확인하는 메서드
     */
    public boolean validateDuplicateUsername(String Username){
        return accountRepository.existsByUsername(Username);
    }

}
