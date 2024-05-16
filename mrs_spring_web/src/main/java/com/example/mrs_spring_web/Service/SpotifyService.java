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
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.neovisionaries.i18n.CountryCode;

import lombok.extern.slf4j.Slf4j;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.Playlist;
import se.michaelthelin.spotify.model_objects.specification.PlaylistTrack;
import se.michaelthelin.spotify.model_objects.specification.Recommendations;
import se.michaelthelin.spotify.model_objects.specification.Track;
import se.michaelthelin.spotify.model_objects.specification.User;
import se.michaelthelin.spotify.requests.data.browse.GetRecommendationsRequest;
import se.michaelthelin.spotify.requests.data.player.AddItemToUsersPlaybackQueueRequest;

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

    public List<String> getTracklistByPlaylist(String userName, String playlistId) throws IOException, ParseException, SpotifyWebApiException {
        UserEntity user = userRepository.findByUsername(userName);
        spotifyApi.setAccessToken(user.getAccessToken());
        PlaylistTrack[] playlistTracks = spotifyApi.getPlaylist(playlistId).build().execute().getTracks().getItems();
        List<String> trackLists = new ArrayList<>();
        for (PlaylistTrack playlistTrack : playlistTracks) {
            trackLists.add(playlistTrack.getTrack().getUri());
        }
        return trackLists;
    }

    public void addTracksToQueue(String userName, List<String> tracks) throws IOException, ParseException, SpotifyWebApiException {
        UserEntity user = userRepository.findByUsername(userName);
        spotifyApi.setAccessToken(user.getAccessToken());
        JsonArray trackUris = new JsonArray();
        for (String track : tracks) {
            trackUris.add(track);
        }
        log.info("[StartTracks]"+trackUris.toString());
        spotifyApi.startResumeUsersPlayback().uris(trackUris).device_id(user.getDeviceId()).build().execute();
        // for (String track : tracks) {
        //     AddItemToUsersPlaybackQueueRequest addItemToUsersPlaybackQueueRequest = spotifyApi.addItemToUsersPlaybackQueue(track).device_id(user.getDeviceId()).build();
        //     addItemToUsersPlaybackQueueRequest.execute();
        // }
    }

    public User getUserProfile(String userName) throws IOException, ParseException, SpotifyWebApiException {
        UserEntity user = userRepository.findByUsername(userName);
        spotifyApi.setAccessToken(user.getAccessToken());
        User userprofile = spotifyApi.getCurrentUsersProfile().build().execute();
        return userprofile;
    }

    public void makePlaylist(String userName, String[] trackList, String playlistName) throws IOException, ParseException, SpotifyWebApiException{
        UserEntity user = userRepository.findByUsername(userName);
        spotifyApi.setAccessToken(user.getAccessToken());
        Playlist newPlaylist = spotifyApi.createPlaylist(userName, playlistName).build().execute();
        spotifyApi.addItemsToPlaylist(newPlaylist.getId(), trackList).build().execute();
    }
    
    public String getAvaliableDevices(String userName) throws Exception {
        UserEntity user = userRepository.findByUsername(userName);
        spotifyApi.setAccessToken(user.getAccessToken());
        return spotifyApi.getUsersAvailableDevices().build().execute()[1].getId();
    }
    
    public void activateDevice(String userName, String deviceId) throws Exception {
        UserEntity user = userRepository.findByUsername(userName);
        spotifyApi.setAccessToken(user.getAccessToken());
        JsonArray deviceids = new JsonArray();
        deviceids.add(deviceId);
        log.info("[activateDevice]"+deviceids.toString());
        spotifyApi.transferUsersPlayback(deviceids).build().execute();
    }
}
