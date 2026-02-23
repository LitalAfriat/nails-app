import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    NativeSyntheticEvent,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TextInputKeyPressEventData,
    TouchableOpacity,
    View,
} from 'react-native';

interface VerificationCodeProps {
  length?: number;
  onComplete?: (code: string) => void;
  onResend?: () => void;
  email?: string;
}

const VerificationCode: React.FC<VerificationCodeProps> = ({
  length = 6,
  onComplete,
  onResend,
  email = 'user@example.com',
}) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Mask email address for privacy
  const maskEmail = (emailAddress: string): string => {
    const [username, domain] = emailAddress.split('@');
    if (!username || !domain) return emailAddress;
    const visibleChars = Math.min(2, Math.floor(username.length / 2));
    const maskedUsername = username.substring(0, visibleChars) + '***';
    return `${maskedUsername}@${domain}`;
  };

  // Timer for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Shake animation for errors
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  // Handle input change
  const handleChange = (index: number, value: string) => {
    // Only allow single digit numbers
    const digit = value.replace(/[^0-9]/g, '').slice(-1);

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError('');

    // Move to next input if value is entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    // Submission is handled by the Verify button, not auto-triggered here
  };

  // Handle backspace key
  const handleKeyPress = (
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // Move to previous input if current is empty
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  // Verify code
  const handleVerify = async (verificationCode: string) => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call — replace with your actual verification logic
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate random success/failure for demo
      const isValid = Math.random() > 0.3;

      if (isValid) {
        if (onComplete) {
          onComplete(verificationCode);
        }
      } else {
        setError('Invalid verification code. Please try again.');
        setCode(Array(length).fill(''));
        triggerShake();
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setCode(Array(length).fill(''));
      triggerShake();
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend
  const handleResendClick = () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(60);
    setCode(Array(length).fill(''));
    setError('');
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
    if (onResend) onResend();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {/* Lock icon using Unicode as a simple substitute */}
            <Text style={styles.iconText}>🔐</Text>
          </View>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a verification code to your email address
          </Text>
          <Text style={styles.emailText}>{maskEmail(email)}</Text>
        </View>

        {/* Code Input */}
        <Animated.View
          style={[styles.codeContainer, { transform: [{ translateX: shakeAnim }] }]}
        >
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={el => (inputRefs.current[index] = el)}
              style={[
                styles.input,
                error ? styles.inputError : null,
                isLoading ? styles.inputDisabled : null,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={value => handleChange(index, value)}
              onKeyPress={e => handleKeyPress(index, e)}
              editable={!isLoading}
              autoFocus={index === 0}
              selectTextOnFocus
              caretHidden
              textContentType="oneTimeCode" // iOS autofill support
            />
          ))}
        </Animated.View>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            (!code.every(d => d !== '') || isLoading) ? styles.verifyButtonDisabled : null,
          ]}
          onPress={() => handleVerify(code.join(''))}
          disabled={!code.every(d => d !== '') || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify</Text>
          )}
        </TouchableOpacity>

        {/* Resend Section */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Didn't receive the code?{' '}
          </Text>
          <TouchableOpacity onPress={handleResendClick} disabled={!canResend}>
            <Text
              style={[
                styles.resendButton,
                canResend ? styles.resendButtonActive : styles.resendButtonDisabled,
              ]}
            >
              {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F7',
    padding: 20,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 48,
    maxWidth: 480,
    width: '100%',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10, // Android shadow
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#FFE5EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 14,
    color: '#FF6B9D',
    fontWeight: '600',
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 24,
  },
  input: {
    width: 48,
    height: 64,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputDisabled: {
    opacity: 0.6,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
    flexShrink: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  verifyButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyButtonDisabled: {
    backgroundColor: '#FFC0D6',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  resendText: {
    fontSize: 14,
    color: '#6B7280',
  },
  resendButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  resendButtonActive: {
    color: '#FF6B9D',
  },
  resendButtonDisabled: {
    color: '#9CA3AF',
  },
});

export default VerificationCode;