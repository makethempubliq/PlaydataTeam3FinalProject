package com.example.mrs_spring_web.Model.Entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity(name = "Playlist")
@Table(name = "playlist")
public class PlaylistEntity {
    @Id
    @GeneratedValue
    public Long playlistId;
    public String playlistName;
    public String playlisttracks;
    public String playlistduration;
    public String playlistUserId;
}
