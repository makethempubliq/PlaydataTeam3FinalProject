package com.example.mrs_spring_web.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mrs_spring_web.Model.DTO.PlaylistDTO;
import com.example.mrs_spring_web.Service.PlaylistService;

import lombok.extern.slf4j.Slf4j;



@Slf4j
@RestController
@RequestMapping("/api/v1")
public class PlaylistController {

    @Autowired
    public PlaylistService playlistService;

    

    @PostMapping("/likeplaylist")
    public void saveplaylist(@RequestBody PlaylistDTO playlistDTO, Authentication authentication, @AuthenticationPrincipal UserDetails userDetailsObj) throws Exception{
        //TODO: process POST request
        log.info("savepltodb");
        playlistDTO.setPlaylistUserId(userDetailsObj.getUsername());
        playlistService.savePlaylist(playlistDTO);
    }

    @PostMapping("/deleteplaylist")
    public void deleteplaylist(@RequestBody PlaylistDTO playlistDTO, Authentication authentication, @AuthenticationPrincipal UserDetails userDetailsObj) throws Exception{
        //TODO: process POST request
        playlistService.deletePlaylist(playlistDTO.getPlaylistId());
    }
    
    
}
