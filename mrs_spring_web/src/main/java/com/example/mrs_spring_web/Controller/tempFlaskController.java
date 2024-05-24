package com.example.mrs_spring_web.Controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/api/v1/flask")
public class tempFlaskController {
    @PostMapping("/themeselect")
    public ResponseEntity<Map<String, Object>> themeSelect(@RequestBody Map<String, String> payload) {
        //TODO: process POST request
        String inputText = payload.get("inputText");
        String totalDuration = payload.get("totalDuration");
        log.info("tokenizing..........");
        String[] tokenizedTheme = {"바다", "여행", "잔잔한"}; //입력값 토큰화 할 함수 들어갈 자리
        int trackCounts = 10; //duration으로 음원 수 정하기
        Map<String, Object> response = new HashMap<>();
        response.put("tokenizedTheme", tokenizedTheme);
        response.put("trackCounts", trackCounts);

        return ResponseEntity.ok(response); 
    }
    
    @PostMapping("/gettracks")
    public ResponseEntity<Map<String, Object>>getRecommendedTracks(@RequestBody Map<String, Object> payload){
        List<String> tokenizedTheme = (List<String>) payload.get("tokenizedTheme");
        int trackCounts = (int) payload.get("trackCounts");
        log.info("recommending..........");
        List<String> trackuris = new ArrayList<>();
        trackuris.add("spotify:track:5ZVQpRGq9eBpaCvUXkZUmP");
        Map<String, Object> response = new HashMap<>();
        response.put("tokenizedTheme", tokenizedTheme);
        response.put("trackUris", trackuris);
        return ResponseEntity.ok(response);
    }
}
