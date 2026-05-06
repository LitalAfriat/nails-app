import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useEmail } from "@/context/EmailContext"; 

export default function VerificationScreen() {


  const OTP_LENGTH = 6;   
  const RESEND_DELAY_SECONDS = 30;  

  const router = useRouter();
  const { email } = useEmail();
  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [resendTimer, setResendTimer] = useState(RESEND_DELAY_SECONDS);

  const inputs = useRef<(TextInput | null)[]>([]);


 useEffect(() => {
  if (resendTimer === 0) return; // early return, no uninitialized `timer`

  const timer = setTimeout(() => {
    setResendTimer((prev) => prev - 1);
  }, 1000);

  return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
   
  };


    const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
        inputs.current[index - 1]?.focus();
    } 
    }; 

  const handleVerify = async () => {
    const verificationCode = code.join("");

    Alert.alert("Verification Code", verificationCode);

   

await fetch("http://192.168.1.128:3000/sendCode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verificationCode, email }),
    });
  };




  const handleResend = async () => {
    if (resendTimer > 0) return;

    // 🔁 Call your API here
           
    
            try {
                const response = await fetch("http://192.168.1.128:3000/sendEmailCode", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                });
    
                if (!response.ok) {
                    throw new Error("Failed to send email code");
                }
    
                const data = await response.json(); 
                console.log("Success:", data);
    
                
            } catch (err) {
                const error = err instanceof Error ? err.message : "Unknown error";
                alert(`Something went wrong. Error: ${error}`);
            }
    
    
    Alert.alert("Code resent!", `Sent to: ${email}`);

    setResendTimer(RESEND_DELAY_SECONDS);
  };

  return (
    <View style={styles.container}>
      <View style={styles.back}>
        <TouchableOpacity onPress={() => router.back()} style={styles.buttonB}>
          <Text style={styles.text}>← Go Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Enter Verification Code</Text>

       {email ? (
        <Text style={styles.subtitle}>
          Code sent to { email }
        </Text>
      ) : null}

      <View style={styles.inputContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            ref={(ref) => {
            if (ref) {
            inputs.current[index] = ref;
            }
            }}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
           
  returnKeyType="send"
          />
        ))}
      </View>

      {/* 🔁 Resend Section */}
      <TouchableOpacity
        onPress={handleResend}
        disabled={resendTimer > 0}
      >
        <Text style={[styles.resendText, resendTimer > 0 && styles.disabledText]}>
          {resendTimer > 0
            ? `Resend code in ${resendTimer}s`
            : "Resend Code"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fdf2f8",
  },
  back: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 55,
    paddingLeft: 16,
    zIndex: 10,
  },
  buttonB: {
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 16,
    color: "#be185d",
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "600",
    color: "#be185d",
  },
   subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  emailText: {
    fontWeight: "600",
    color: "#be185d",
  },
  inputContainer: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 22,
    textAlign: "center",
  },
  resendText: {
    marginTop: 20,
    fontSize: 14,
    color: "#db2777",
    fontWeight: "500",
  },
  disabledText: {
    color: "#9ca3af",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#db2777",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});