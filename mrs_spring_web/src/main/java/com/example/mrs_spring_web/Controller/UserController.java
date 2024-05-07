package com.example.mrs_spring_web.Controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class UserController {
    @GetMapping("/")
    public String index() {
        return "index";
    }
    // @GetMapping("/login")
    // public String loginpage() {
    //     return "login";
    // }
    @GetMapping("/user")
    public @ResponseBody String user() {
        log.info("[SecurityController] user start!!");
        return "user";
    }

    @GetMapping("/admin")
    public @ResponseBody String admin() {
        log.info("[SecurityController] admin start!!");
        return "admin";
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
}
