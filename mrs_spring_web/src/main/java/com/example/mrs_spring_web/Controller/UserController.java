package com.example.mrs_spring_web.Controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.mrs_spring_web.Model.Entity.UserEntity;
import com.example.mrs_spring_web.Service.SpotifyService;
import com.example.mrs_spring_web.Service.UserService;

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
    public String main(Authentication authentication, @AuthenticationPrincipal UserDetails userDetailsObj, Model model) throws Exception{
        User currentUser = spotifyService.getUserProfile(userDetailsObj.getUsername());
        model.addAttribute("username", currentUser.getDisplayName());
        model.addAttribute("koreatoptrackart", spotifyService.getPlaylistArt(userDetailsObj.getUsername(), "37i9dQZEVXbNxXF4SkHj9F").getUrl());
        model.addAttribute("globaltoptrackart", spotifyService.getPlaylistArt(userDetailsObj.getUsername(), "37i9dQZEVXbMDoHDwVN2tF").getUrl());
        return "main";
    }

    @GetMapping("/musicplayer")
    public String musicplayer(@RequestParam("id") String playlistId, Authentication authentication, @AuthenticationPrincipal UserDetails userDetailsObj, Model model) throws Exception{
        List<String> playlistTracks = spotifyService.getTracklistByPlaylist(userDetailsObj.getUsername(), playlistId);
        String accesstoken = userService.getAccesstoken(userDetailsObj.getUsername());
        
        model.addAttribute("accesstoken", accesstoken);
        model.addAttribute("tracklist", playlistTracks);
        model.addAttribute("playlistTracks", playlistTracks.toString());
        return "musicplayer";
    }

    @GetMapping("/playlist")
    public String showplaylist(@RequestParam("id") String playlistId, Authentication authentication, @AuthenticationPrincipal UserDetails userDetailsObj, Model model) throws Exception{
        List<String> playlistTracks = spotifyService.getTracklistByPlaylist(userDetailsObj.getUsername(), playlistId);
        String accesstoken = userService.getAccesstoken(userDetailsObj.getUsername());
        if (playlistId != null){
            model.addAttribute("playlistArt", spotifyService.getPlaylistArt(userDetailsObj.getUsername(), playlistId).getUrl());
        }
        model.addAttribute("accesstoken", accesstoken);
        model.addAttribute("tracklist", playlistTracks);
        model.addAttribute("trackDataList", spotifyService.getTracksdata(userDetailsObj.getUsername(), playlistTracks));
        return "playlist";
    }

    @GetMapping("/manager")
    public @ResponseBody String manager() {
        log.info("[SecurityController] manager start!!");
        return "manager";
    }

    @GetMapping("/loginForm")
    public String loginForm() {
        log.info("[SecurityController] loginForm start!!");
        return "loginForm";
    }

    @GetMapping("/test")
    public String testpage() {
        return "test";
    }
    

}
