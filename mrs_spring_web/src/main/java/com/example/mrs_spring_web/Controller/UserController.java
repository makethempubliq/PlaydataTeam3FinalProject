package com.example.mrs_spring_web.Controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.mrs_spring_web.Service.SpotifyService;
import com.example.mrs_spring_web.Service.UserService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import lombok.extern.slf4j.Slf4j;
import se.michaelthelin.spotify.model_objects.specification.User;

@Slf4j
@Controller
public class UserController {

    @Autowired
    public SpotifyService spotifyService;

    @Autowired
    public UserService userService;

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/main")
    public String main(Authentication authentication, @AuthenticationPrincipal UserDetails userDetailsObj, Model model)
            throws Exception {
        User currentUser = spotifyService.getUserProfile(userDetailsObj.getUsername());
        model.addAttribute("username", currentUser.getDisplayName());
        model.addAttribute("koreatoptrackart",
                spotifyService.getPlaylistArt(userDetailsObj.getUsername(), "37i9dQZEVXbNxXF4SkHj9F").getUrl());
        model.addAttribute("globaltoptrackart",
                spotifyService.getPlaylistArt(userDetailsObj.getUsername(), "37i9dQZEVXbMDoHDwVN2tF").getUrl());
        return "main";
    }

    @GetMapping("/musicplayer")
    public String musicplayer(@RequestParam("id") String playlistId, Authentication authentication,
            @AuthenticationPrincipal UserDetails userDetailsObj, Model model) throws Exception {
        List<String> playlistTracks = spotifyService.getTracklistByPlaylist(userDetailsObj.getUsername(), playlistId);
        String accesstoken = userService.getAccesstoken(userDetailsObj.getUsername());

        model.addAttribute("accesstoken", accesstoken);
        model.addAttribute("tracklist", playlistTracks);
        model.addAttribute("playlistTracks", playlistTracks.toString());
        return "musicplayer";
    }

    @GetMapping("/playlist")
    public String showplaylist(@RequestParam(value = "id", required = false) String playlistId,
            @RequestParam(value = "recommendedtracks", required = false) String recommendedtracks,
            @RequestParam(value = "tokenizedTheme", required = false) String themes, Authentication authentication,
            @AuthenticationPrincipal UserDetails userDetailsObj, Model model) throws Exception {

        String accesstoken = userService.getAccesstoken(userDetailsObj.getUsername());
        if (playlistId != null) {
            List<String> Tracks = spotifyService.getTracklistByPlaylist(userDetailsObj.getUsername(), playlistId);
            model.addAttribute("playlistArt",
                    spotifyService.getPlaylistArt(userDetailsObj.getUsername(), playlistId).getUrl());
            model.addAttribute("tracklist", Tracks);
            model.addAttribute("trackDataList", spotifyService.getTracksdata(userDetailsObj.getUsername(), Tracks));
        } else {
            List<String> Tracks = new Gson().fromJson(recommendedtracks, new TypeToken<List<String>>() {
            }.getType());
            model.addAttribute("tracklist", Tracks);
            model.addAttribute("trackDataList", spotifyService.getTracksdata(userDetailsObj.getUsername(), Tracks));
            model.addAttribute("themes", new Gson().fromJson(themes, new TypeToken<List<String>>() {
            }.getType()));
        }
        model.addAttribute("accesstoken", accesstoken);

        User currentUser = spotifyService.getUserProfile(userDetailsObj.getUsername());
        model.addAttribute("username", currentUser.getDisplayName());
        return "playlist";
    }

    @GetMapping("/playerbar")
    public String showplayerbar(@RequestParam String trackdata, Authentication authentication,
            @AuthenticationPrincipal UserDetails userDetailsObj, Model model) throws Exception {

        String accesstoken = userService.getAccesstoken(userDetailsObj.getUsername());
        spotifyService.getCurrentPlayState(userDetailsObj.getUsername());
        List<String> tracksList = new ArrayList<>();
        String[] tracksArray = trackdata.split(", ");

        // 문자열에서 "[", "]"를 제거하고 ", "을 구분자로 사용하여 분리
        // 분리된 각 문자열을 리스트에 추가
        for (String track : tracksArray) {
            tracksList.add(track);
        }
        log.info("show playerbar : trackdata : " + trackdata + accesstoken);
        model.addAttribute("accesstoken", accesstoken);
        model.addAttribute("tracklist", tracksList);
        model.addAttribute("trackDataList", spotifyService.getTracksdata(userDetailsObj.getUsername(), tracksList));
        return "playerbar";
    }

    @GetMapping("/makeplaylist")
    public String makeplaylist(Authentication authentication, @AuthenticationPrincipal UserDetails userDetailsObj,
            Model model) {
        log.info("[UserController] makeplaylist start!!");
        return "themeselect";
    }
}
