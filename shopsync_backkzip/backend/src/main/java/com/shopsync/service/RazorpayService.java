package com.shopsync.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;

@Service
public class RazorpayService {

    // Ideally injected from properties
    private final String keyId = "rzp_test_placeholderKey123";
    private final String keySecret = "rzp_test_placeholderSecret456";

    // Create a Razorpay Order
    public String createRazorpayOrder(BigDecimal amount) throws RazorpayException {
        // RazorpayClient requires valid keys to instantiate without error. 
        // For local development without real keys, we return a mock order ID
        // so the frontend can still proceed with the simulation.
        if (keyId.startsWith("rzp_test_placeholder")) {
            return "order_mock_" + System.currentTimeMillis();
        }

        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

        JSONObject orderRequest = new JSONObject();
        // Razorpay accepts amount in paise (multiply by 100)
        orderRequest.put("amount", amount.multiply(new BigDecimal(100)).intValue());
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

        Order order = razorpay.orders.create(orderRequest);
        return order.get("id");
    }

    // Verify Signature
    public boolean verifySignature(String orderId, String paymentId, String signature) {
        if (keySecret.startsWith("rzp_test_placeholder")) {
            return true; // Auto-verify for mock pipeline
        }

        try {
            String payload = orderId + "|" + paymentId;
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            
            byte[] bytes = sha256_HMAC.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder hash = new StringBuilder();
            for (byte b : bytes) {
                hash.append(String.format("%02x", b));
            }
            
            return hash.toString().equals(signature);
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getKeyId() {
        return keyId;
    }
}
