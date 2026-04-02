package com.shopsync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ShopSyncApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShopSyncApplication.class, args);
        System.out.println("====== ShopSync Backend Started Successfully ======");
    }

}
