import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { supabase, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, onAuthStateChange } from '../services/supabase';
import { useCryptoStore } from '../store/cryptoStore';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      if (session?.user) {
        onAuthSuccess();
      }
    });

    checkUser();
    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      onAuthSuccess();
    }
    setInitialized(true);
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        Alert.alert('Success', 'Check your email for confirmation link!');
      } else {
        await signInWithEmail(email, password);
        onAuthSuccess();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('Error', error.message);
      setLoading(false);
    }
  };

  if (!initialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>CoinWatch</Text>
        <ActivityIndicator size="large" color="#1E3A5F" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={styles.title}>CoinWatch</Text>
        <Text style={styles.subtitle}>{isSignUp ? 'Create an account' : 'Welcome back'}</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleEmailAuth}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn} disabled={loading}>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={styles.switchButton}>
          <Text style={styles.switchText}>
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

import { ActivityIndicator } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E3A5F' },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 36, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 40 },
  form: { gap: 16 },
  input: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, fontSize: 16, color: '#1A1A2E' },
  button: { backgroundColor: '#FFD700', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: 18, fontWeight: '700', color: '#1A1A2E' },
  googleButton: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  googleButtonText: { fontSize: 16, fontWeight: '600', color: '#1A1A2E' },
  switchButton: { marginTop: 24, alignItems: 'center' },
  switchText: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
});

export default AuthScreen;
