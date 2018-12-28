package it.chalmers.gamma.service;

import it.chalmers.gamma.db.entity.ITClient;
import it.chalmers.gamma.db.entity.Text;
import it.chalmers.gamma.db.repository.ITClientRepository;
import it.chalmers.gamma.requests.AddITClientRequest;
import it.chalmers.gamma.util.TokenUtils;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.provider.ClientDetails;
import org.springframework.security.oauth2.provider.ClientDetailsService;
import org.springframework.security.oauth2.provider.ClientRegistrationException;
import org.springframework.stereotype.Service;

@Service
public class ITClientService implements ClientDetailsService {

    @Value("${application.auth.accessTokenValidityTime}")       // TODO Fix this
    private int accessTokenValidityTime;

    @Value("${application.auth.autoApprove}")
    private boolean autoApprove;

    @Value("${application.auth.refreshTokenValidityTime}")
    private int refreshTokenValidityTime;

    private ITClientRepository itClientRepository;

    private PasswordEncoder passwordEncoder;

    public ITClientService(ITClientRepository itClientRepository){
        this.itClientRepository = itClientRepository;
        this.passwordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Override
    public ClientDetails loadClientByClientId(String clientId) throws ClientRegistrationException {
        System.out.println("Kollar null");
        System.out.println(clientId);
        ITClient client = this.itClientRepository.findByClientId(clientId);
        System.out.println(client);
//        BaseClientDetails details = new BaseClientDetails();
//        details.setClientId(client.getClientId());
//        details.setAuthorizedGrantTypes(client.getAuthorizedGrantTypes());
//        details.setClientSecret(passwordEncoder.encode(client.getClientSecret()));
//        details.setScope(client.getScope());
//        details.setRegisteredRedirectUri(client.getRegisteredRedirectUri());
//        details.setAutoApproveScopes(client.getScope());        // Change this to force a approval from user.
//        details.setAuthorities(client.getAuthorities());
        return client;
    }

    public void createITClient(AddITClientRequest request) {
        ITClient client = new ITClient();
        client.setName(request.getName());
        Text description = new Text();
        description.setEn(request.getDescription().getEn());
        description.setSv(request.getDescription().getSv());
        client.setDescription(description);
        client.setWebServerRedirectUri(request.getUrlRedirect());
        client.setCreatedAt(Instant.now());
        client.setLastModifiedAt(Instant.now());
        client.setAccessTokenValidity(accessTokenValidityTime);
        client.setAutoApprove(autoApprove);
        client.setRefreshTokenValidity(refreshTokenValidityTime);
        client.setClientId(TokenUtils.generateToken());
        client.setClientSecret(TokenUtils.generateToken());
        itClientRepository.save(client);
    }

    public List<ITClient> getAllClients(){
        return itClientRepository.findAll();
    }

    public ITClient getITClient(UUID id){
        return itClientRepository.findById(id).orElseThrow();
    }

    public void removeITClient(UUID id){
        itClientRepository.deleteById(id);
    }

    public void editClient(UUID id, AddITClientRequest request){
        ITClient client = itClientRepository.findById(id).orElseThrow();
        client.setLastModifiedAt(Instant.now());
        client.setName(request.getName() == null ? client.getName() : request.getName());
        client.setDescription(request.getDescription() == null ? client.getDescription() : request.getDescription());
        client.setWebServerRedirectUri(request.getUrlRedirect() == null
                ? client.getWebServerRedirectUri() : request.getUrlRedirect());
    }

    public boolean clientExists(UUID id){
        return itClientRepository.existsById(id);
    }

    public boolean clientExistsByClientId(String clientId) {
        return itClientRepository.existsITClientByClientId(clientId);
    }

    public void addITClient(ITClient itClient) {
        itClientRepository.save(itClient);
    }
}
