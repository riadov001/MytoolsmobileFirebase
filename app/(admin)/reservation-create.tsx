import React, { useState, useMemo } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, Platform,
  TextInput, ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { adminReservations, adminClients } from "@/lib/admin-api";
import { useTheme } from "@/lib/theme";
import { ThemeColors } from "@/constants/theme";
import { useCustomAlert } from "@/components/CustomAlert";

export default function ReservationCreateScreen() {
  const params = useLocalSearchParams();
  const clientId = Array.isArray(params.clientId) ? params.clientId[0] : (params.clientId as string || "");
  const quoteId = Array.isArray(params.quoteId) ? params.quoteId[0] : (params.quoteId as string || "");
  const quoteName = Array.isArray(params.quoteName) ? params.quoteName[0] : (params.quoteName as string || "");

  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const queryClient = useQueryClient();
  const { showAlert, AlertComponent } = useCustomAlert();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split("T")[0];
  const defaultTime = "09:00";

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [notes, setNotes] = useState(quoteName ? `Devis: ${quoteName}` : "");
  const [serviceType, setServiceType] = useState("");

  const { data: clients = [] } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: adminClients.getAll,
    staleTime: 5 * 60 * 1000,
  });

  const client = useMemo(() => {
    const arr = Array.isArray(clients) ? clients : [];
    return arr.find((c: any) => String(c.id) === String(clientId));
  }, [clients, clientId]);

  const clientName = client
    ? `${client.firstName || ""} ${client.lastName || ""}`.trim() || client.name || client.email || "Client"
    : clientId ? `Client #${clientId}` : "Client inconnu";

  const mutation = useMutation({
    mutationFn: () => {
      const scheduledDate = new Date(`${date}T${time}:00`);
      return adminReservations.create({
        clientId,
        quoteId: quoteId || undefined,
        scheduledDate: scheduledDate.toISOString(),
        serviceType: serviceType || undefined,
        notes,
        status: "pending",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showAlert({
        type: "success",
        title: "Rendez-vous créé",
        message: "Le rendez-vous a été planifié avec succès.",
        buttons: [{ text: "OK", style: "primary", onPress: () => router.back() }],
      });
    },
    onError: () => {
      showAlert({
        type: "error",
        title: "Erreur",
        message: "Impossible de créer le rendez-vous.",
        buttons: [{ text: "OK", style: "primary" }],
      });
    },
  });

  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const isValidTime = /^\d{2}:\d{2}$/.test(time);
  const canSubmit = isValidDate && isValidTime && !mutation.isPending;

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 24 : insets.bottom + 24;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={theme.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Nouveau rendez-vous</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomPad, gap: 14 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Client */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client</Text>
          <View style={styles.clientRow}>
            <View style={styles.clientAvatar}>
              <Ionicons name="person" size={18} color={theme.primary} />
            </View>
            <Text style={styles.clientName}>{clientName}</Text>
          </View>
          {quoteId ? (
            <View style={styles.quoteRef}>
              <Ionicons name="document-text-outline" size={14} color={theme.primary} />
              <Text style={styles.quoteRefText}>Devis lié : {quoteName || quoteId}</Text>
            </View>
          ) : null}
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date et heure *</Text>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Date</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textTertiary}
              keyboardType="numbers-and-punctuation"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Heure</Text>
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
              placeholder="HH:MM"
              placeholderTextColor={theme.textTertiary}
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </View>

        {/* Service */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service (optionnel)</Text>
          <TextInput
            style={styles.input}
            value={serviceType}
            onChangeText={setServiceType}
            placeholder="Ex: Vidange, Révision, Diagnostic..."
            placeholderTextColor={theme.textTertiary}
          />
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (optionnel)</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Informations complémentaires..."
            placeholderTextColor={theme.textTertiary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Submit */}
        <Pressable
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={() => mutation.mutate()}
          disabled={!canSubmit}
        >
          {mutation.isPending
            ? <ActivityIndicator color="#fff" />
            : <>
                <Ionicons name="calendar-outline" size={18} color="#fff" />
                <Text style={styles.submitBtnText}>Confirmer le rendez-vous</Text>
              </>
          }
        </Pressable>
      </ScrollView>
      {AlertComponent}
    </View>
  );
}

const getStyles = (theme: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 16, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: theme.border,
  },
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  headerTitle: { flex: 1, fontSize: 17, fontFamily: "Inter_600SemiBold", color: theme.text, textAlign: "center" },
  section: { backgroundColor: theme.surface, borderRadius: 14, borderWidth: 1, borderColor: theme.border, padding: 14, gap: 10 },
  sectionTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: theme.textTertiary, textTransform: "uppercase", letterSpacing: 0.8 },
  clientRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  clientAvatar: { width: 36, height: 36, borderRadius: 10, backgroundColor: theme.primary + "15", justifyContent: "center", alignItems: "center" },
  clientName: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: theme.text, flex: 1 },
  quoteRef: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  quoteRefText: { fontSize: 12, fontFamily: "Inter_400Regular", color: theme.primary },
  field: { gap: 4 },
  fieldLabel: { fontSize: 12, fontFamily: "Inter_500Medium", color: theme.textSecondary },
  input: {
    backgroundColor: theme.inputBg || theme.background, borderRadius: 10, borderWidth: 1,
    borderColor: theme.inputBorder || theme.border, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, fontFamily: "Inter_400Regular", color: theme.text,
  },
  textarea: { minHeight: 80, paddingTop: 10 },
  submitBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: theme.primary, borderRadius: 14, height: 54,
  },
  submitBtnDisabled: { backgroundColor: theme.border },
  submitBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },
});
