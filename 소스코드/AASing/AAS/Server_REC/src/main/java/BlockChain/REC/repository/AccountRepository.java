package BlockChain.REC.repository;

import BlockChain.REC.domain.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;

import static BlockChain.REC.config.MagicValue.MAX_NUMBER_OF_USERNAME;

@Repository
@RequiredArgsConstructor
public class AccountRepository {
    private final EntityManager em;

    /**
     * 계정정보 영속성 컨텐스트에 저장.
     * @param account
     */
    public void save(Account account){
        em.persist(account);
    }

    public Account findOne(Long id){
        return em.find(Account.class, id);
    }

    /**
     * user_ID로 유저 조회 메서드
     * @param username
     * @return Account
     */
    public Account findByUsername(String username){
        return em.createQuery("select a from Account a where a.user_id = :user_id",Account.class)
                .setParameter("user_id",username)
                .getSingleResult();
    }

    /**
     * 중복 ID를 가지고 있는 유저가 있는지 검사
     * @param username
     * @return boolean
     */
    public boolean existsByUsername(String user_id){
        return (em.createQuery("select a from Account a where a.user_id = :user_id",Account.class)
                 .setParameter("user_id",user_id)
                 .getResultList().size() == MAX_NUMBER_OF_USERNAME);
    }


}
