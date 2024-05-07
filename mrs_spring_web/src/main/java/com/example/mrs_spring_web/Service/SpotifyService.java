package com.example.mrs_spring_web.Service;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import org.apache.hc.core5.http.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.mrs_spring_web.Model.Entity.UserEntity;
import com.example.mrs_spring_web.Repository.UserRepository;
import com.neovisionaries.i18n.CountryCode;

import lombok.extern.slf4j.Slf4j;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.miscellaneous.Device;
import se.michaelthelin.spotify.model_objects.specification.Recommendations;
import se.michaelthelin.spotify.model_objects.specification.Track;
import se.michaelthelin.spotify.requests.data.browse.GetRecommendationsRequest;
import se.michaelthelin.spotify.requests.data.player.GetUsersAvailableDevicesRequest;
import se.michaelthelin.spotify.requests.data.player.StartResumeUsersPlaybackRequest;

@Slf4j
@Service
public class SpotifyService {
    @Autowired
    public UserRepository userRepository;

    private static final URI redirectUri = SpotifyHttpManager.makeUri("http://localhost:8080/login/oauth2/code/spotify");
    private static final String CLIENT_ID = "25d521b807f44fc19a8b202da4c88248";
    private static final String CLIENT_SECRET = "d06c3e35075f4c7cb28347e6620067cf";

    private static final SpotifyApi spotifyApi = new SpotifyApi.Builder()
                                                .setClientId(CLIENT_ID)
                                                .setClientSecret(CLIENT_SECRET)
                                                .setRedirectUri(redirectUri)
                                                .build();

    public String getRecommendation(String userName) throws IOException, ParseException, SpotifyWebApiException {
        UserEntity user = userRepository.findByUsername(userName);
        spotifyApi.setAccessToken(user.getAccessToken());
        log.info("getrecommdations");
        GetRecommendationsRequest getRecommendationsRequest = spotifyApi.getRecommendations()
                    .market(CountryCode.KR)
                    .max_popularity(50)
                    .min_popularity(10)
                    .seed_genres("0JQ5IMCbQBLlZMXMYUXUiW")
                    .build();
        log.info("excute");
        Recommendations recommendations = getRecommendationsRequest.execute();
        Track[] tracks = recommendations.getTracks();
        List<String> tracklist = new ArrayList<>();
        for (Track track : tracks) {
            String trackdata = track.getName()+" "+track.getArtists()[0].getName();
            tracklist.add(trackdata);
        }
        return tracklist.toString();
    }

    public String demoplay(String userName) throws IOException, ParseException, SpotifyWebApiException {
        UserEntity user = userRepository.findByUsername(userName);
        spotifyApi.setAccessToken(user.getAccessToken());
        GetUsersAvailableDevicesRequest availableDevices =  spotifyApi.getUsersAvailableDevices().build();
        Device[] device = availableDevices.execute();
        for (Device device2 : device) {
            try {
                StartResumeUsersPlaybackRequest startResumeUsersPlaybackRequest = spotifyApi.startResumeUsersPlayback().context_uri("spotify:playlist:37i9dQZF1DWT9uTRZAYj0c").device_id(device2.getId()).build();
                startResumeUsersPlaybackRequest.execute();
                log.info(device2.getId());
                log.info(device2.getType());
            }
            catch (Exception e) {
                return e.getMessage();
            }
            
        }
        
        return "success";
    }
}
