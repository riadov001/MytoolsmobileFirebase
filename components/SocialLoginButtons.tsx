import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import { makeRedirectUri } from "expo-auth-session";
import {
  signInWithCredential,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { useTheme } from "@/lib/theme";

WebBrowser.maybeCompleteAuthSession();

interface SocialLoginButtonsProps {
  onIdToken: (idToken: string, provider: string) => Promise<void>;
  onError: (message: string) => void;
}

let AppleAuthentication: any = null;
if (Platform.OS === "ios") {
  try {
    AppleAuthentication = require("expo-apple-authentication");
  } catch {}
}

export function SocialLoginButtons({ onIdToken, onError }: SocialLoginButtonsProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState<string | null>(null);

  const redirectUri = makeRedirectUri({ scheme: "mytools", path: "auth/callback" });

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    redirectUri,
  });

  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
    redirectUri,
  });

  useEffect(() => {
    if (googleResponse?.type === "success") {
      handleGoogleResponse(
        googleResponse.authentication?.idToken ?? null,
        googleResponse.authentication?.accessToken ?? null
      );
    } else if (googleResponse?.type === "error" || googleResponse?.type === "dismiss") {
      setLoading(null);
    }
  }, [googleResponse]);

  useEffect(() => {
    if (fbResponse?.type === "success") {
      handleFacebookResponse(fbResponse.authentication?.accessToken ?? null);
    } else if (fbResponse?.type === "error" || fbResponse?.type === "dismiss") {
      setLoading(null);
    }
  }, [fbResponse]);

  const handleGoogleResponse = async (googleIdToken?: string | null, accessToken?: string | null) => {
    if (!googleIdToken && !accessToken) { setLoading(null); return; }
    try {
      const fbAuth = getFirebaseAuth();
      if (!fbAuth) throw new Error("Firebase non configuré");
      const credential = GoogleAuthProvider.credential(googleIdToken, accessToken);
      const result = await signInWithCredential(fbAuth, credential);
      const firebaseIdToken = await result.user.getIdToken();
      await onIdToken(firebaseIdToken, "google");
    } catch (err: any) {
      onError(err?.message || "Erreur Google Sign-In");
    } finally {
      setLoading(null);
    }
  };

  const handleFacebookResponse = async (fbAccessToken?: string | null) => {
    if (!fbAccessToken) { setLoading(null); return; }
    try {
      const fbAuth = getFirebaseAuth();
      if (!fbAuth) throw new Error("Firebase non configuré");
      const credential = FacebookAuthProvider.credential(fbAccessToken);
      const result = await signInWithCredential(fbAuth, credential);
      const firebaseIdToken = await result.user.getIdToken();
      await onIdToken(firebaseIdToken, "facebook");
    } catch (err: any) {
      onError(err?.message || "Erreur Facebook Sign-In");
    } finally {
      setLoading(null);
    }
  };

  const handleGoogle = async () => {
    if (!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) {
      onError("Google Sign-In non configuré. Ajoutez EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.");
      return;
    }
    setLoading("google");
    try {
      await googlePromptAsync();
    } catch (err: any) {
      onError(err?.message || "Erreur Google");
      setLoading(null);
    }
  };

  const handleApple = async () => {
    if (!AppleAuthentication) {
      onError("Apple Sign-In n'est disponible que sur iOS.");
      return;
    }
    setLoading("apple");
    try {
      const fbAuth = getFirebaseAuth();
      if (!fbAuth) throw new Error("Firebase non configuré");
      
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!appleCredential.identityToken) throw new Error("Aucun token Apple reçu");

      const provider = new OAuthProvider("apple.com");
      const firebaseCredential = provider.credential({
        idToken: appleCredential.identityToken,
      });
      const result = await signInWithCredential(fbAuth, firebaseCredential);
      const appleIdToken = await result.user.getIdToken();
      await onIdToken(appleIdToken, "apple");
    } catch (err: any) {
      if (err?.code !== "ERR_REQUEST_CANCELED") {
        onError(err?.message || "Erreur Apple Sign-In");
      }
    } finally {
      setLoading(null);
    }
  };

  const handleFacebook = async () => {
    if (!process.env.EXPO_PUBLIC_FACEBOOK_APP_ID) {
      onError("Facebook Sign-In non configuré. Ajoutez EXPO_PUBLIC_FACEBOOK_APP_ID.");
      return;
    }
    setLoading("facebook");
    try {
      await fbPromptAsync();
    } catch (err: any) {
      onError(err?.message || "Erreur Facebook");
      setLoading(null);
    }
  };

  const handleTwitter = async () => {
    if (!process.env.EXPO_PUBLIC_TWITTER_CLIENT_ID) {
      onError("Twitter Sign-In non configuré. Ajoutez EXPO_PUBLIC_TWITTER_CLIENT_ID.");
      return;
    }
    setLoading("twitter");
    try {
      const { startAsync } = await import("expo-auth-session");
      const twitterRedirect = makeRedirectUri({ scheme: "mytools", path: "auth/twitter" });
      const state = Math.random().toString(36).slice(2);

      const result = await startAsync({
        authUrl:
          `https://twitter.com/i/oauth2/authorize` +
          `?response_type=code` +
          `&client_id=${process.env.EXPO_PUBLIC_TWITTER_CLIENT_ID}` +
          `&redirect_uri=${encodeURIComponent(twitterRedirect)}` +
          `&scope=tweet.read%20users.read%20offline.access` +
          `&state=${state}` +
          `&code_challenge=challenge` +
          `&code_challenge_method=plain`,
      } as any);

      if ((result as any).type === "success") {
        const code = (result as any).params?.code;
        if (code) {
          await onIdToken(code, "twitter");
        }
      }
    } catch (err: any) {
      onError(err?.message || "Erreur Twitter Sign-In");
    } finally {
      setLoading(null);
    }
  };

  const configured = isFirebaseConfigured();

  const buttons = [
    {
      key: "google",
      label: "Google",
      icon: "logo-google" as const,
      color: "#4285F4",
      onPress: handleGoogle,
    },
    ...(Platform.OS === "ios"
      ? [{ key: "apple", label: "Apple", icon: "logo-apple" as const, color: "#000", onPress: handleApple }]
      : []),
    {
      key: "facebook",
      label: "Facebook",
      icon: "logo-facebook" as const,
      color: "#1877F2",
      onPress: handleFacebook,
    },
    {
      key: "twitter",
      label: "Twitter / X",
      icon: "logo-twitter" as const,
      color: "#1DA1F2",
      onPress: handleTwitter,
    },
  ];

  if (!configured) {
    return (
      <View style={styles.notConfigured}>
        <Ionicons name="information-circle-outline" size={14} color="#888" />
        <Text style={styles.notConfiguredText}>
          Authentification sociale non configurée (Firebase requis)
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>ou continuer avec</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.buttonsGrid}>
        {buttons.map((btn) => (
          <Pressable
            key={btn.key}
            testID={`social-btn-${btn.key}`}
            style={({ pressed }) => [
              styles.socialBtn,
              pressed && styles.socialBtnPressed,
              loading === btn.key && styles.socialBtnLoading,
            ]}
            onPress={btn.onPress}
            disabled={!!loading}
          >
            {loading === btn.key ? (
              <ActivityIndicator size="small" color={btn.color} />
            ) : (
              <Ionicons name={btn.icon} size={20} color={btn.color} />
            )}
            <Text style={[styles.socialBtnText, { color: btn.color }]}>{btn.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 4 },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  dividerText: {
    fontSize: 11,
    color: "#666",
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.3,
  },
  buttonsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.04)",
    minWidth: 130,
    flex: 1,
    justifyContent: "center",
  },
  socialBtnPressed: {
    opacity: 0.75,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  socialBtnLoading: {
    opacity: 0.6,
  },
  socialBtnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  notConfigured: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    opacity: 0.5,
  },
  notConfiguredText: {
    fontSize: 11,
    color: "#888",
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
});
