package com.example.mrs_spring_web.Controller;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import org.apache.hc.core5.http.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.mrs_spring_web.Model.Entity.UserEntity;
import com.example.mrs_spring_web.Repository.UserRepository;
import com.example.mrs_spring_web.Service.SpotifyService;
import com.neovisionaries.i18n.CountryCode;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.model_objects.specification.Recommendations;
import se.michaelthelin.spotify.model_objects.specification.Track;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import se.michaelthelin.spotify.requests.data.browse.GetRecommendationsRequest;

@Slf4j
@RestController
public class authController {

    @Autowired
    public UserRepository userRepository;

    @Autowired
    public SpotifyService spotifyService;

    private static final URI redirectUri = SpotifyHttpManager.makeUri("http://localhost:8080/login/oauth2/code/spotify");
    private String code = "";
    private static final String CLIENT_ID = "25d521b807f44fc19a8b202da4c88248";
    private static final String CLIENT_SECRET = "d06c3e35075f4c7cb28347e6620067cf";

    private static SpotifyApi spotifyApi = new SpotifyApi.Builder()
                                                .setClientId(CLIENT_ID)
                                                .setClientSecret(CLIENT_SECRET)
                                                .setRedirectUri(redirectUri)
                                                .build();
                                                
    @GetMapping("/test/login")
    @ResponseBody
    public String testLogin(
            Authentication authentication, @AuthenticationPrincipal UserDetails userDetailsObj
        ) throws IOException, SpotifyWebApiException, ParseException{
        return spotifyService.demoplay(userDetailsObj.getUsername());
    }

}
