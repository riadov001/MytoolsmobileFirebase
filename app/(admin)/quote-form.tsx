import React, { useState, useMemo, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput, Platform,
  ActivityIndicator, FlatList, Modal, Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { adminQuotes, adminClients, adminServices } from "@/lib/admin-api";
import { useTheme } from "@/lib/theme";
import { ThemeColors } from "@/constants/theme";
import { useCustomAlert } from "@/components/CustomAlert";

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente", color: "#F59E0B" },
  { value: "approved", label: "Approuvé", color: "#22C55E" },
  { value: "rejected", label: "Rejeté", color: "#EF4444" },
  { value: "converted", label: "Converti", color: "#3B82F6" },
];

export default function QuoteFormScreen() {
  const params = useLocalSearchParams();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : (typeof rawId === "string" ? rawId : "");
  const isEdit = id.length > 0;
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const { showAlert, AlertComponent } = useCustomAlert();
  const queryClient = useQueryClient();

  const [clientId, setClientId] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [showClientList, setShowClientList] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [showServiceList, setShowServiceList] = useState(false);
  const [status, setStatus] = useState("pending");
  const [priceExcludingTax, setPriceExcludingTax] = useState("");
  const [taxRate, setTaxRate] = useState("20");
  const [quoteAmount, setQuoteAmount] = useState("0.00");
  const [notes, setNotes] = useState("");
  const [vehicleRegistration, setVehicleRegistration] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [mediaUris, setMediaUris] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const { data: clients = [] } = useQuery({ queryKey: ["admin-clients"], queryFn: adminClients.getAll });
  const { data: services = [] } = useQuery({ queryKey: ["admin-services"], queryFn: adminServices.getAll });
  const { data: existing, isLoading: loadingExisting, error: loadingError } = useQuery({
    queryKey: ["admin-quote", id],
    queryFn: () => adminQuotes.getById(id),
    enabled: isEdit,
    retry: 1,
  });

  useEffect(() => {
    if (existing && isEdit) {
      setClientId(String(existing.clientId || existing.client?.id || ""));
      setServiceId(String(existing.serviceId || ""));
      setStatus(existing.status || "pending");
      setPriceExcludingTax(String(existing.priceExcludingTax || ""));
      setTaxRate(String(existing.taxRate || "20"));
      setNotes(existing.notes || "");
      setVehicleRegistration(existing.vehicleRegistration || "");
      setVehicleMake(existing.vehicleMake || "");
      setVehicleModel(existing.vehicleModel || "");
      const existingMedia = existing.requestDetails?.mediaUrls;
      if (Array.isArray(existingMedia) && existingMedia.length > 0) {
        setMediaUris(existingMedia);
      }
    }
  }, [existing]);

  useEffect(() => {
    const ht = parseFloat(priceExcludingTax) || 0;
    const rate = parseFloat(taxRate) || 0;
    setQuoteAmount((ht * (1 + rate / 100)).toFixed(2));
  }, [priceExcludingTax, taxRate]);

  const pickImage = async (fromCamera: boolean) => {
    if (mediaUris.length >= 5) {
      showAlert({ type: "error", title: "Limite atteinte", message: "Maximum 5 photos.", buttons: [{ text: "OK", style: "primary" }] });
      return;
    }
    try {
      let result;
      if (fromCamera) {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) return;
        result = await ImagePicker.launchCameraAsync({ quality: 0.5, base64: true, allowsEditing: true, aspect: [4, 3] });
      } else {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) return;
        result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5, base64: true, allowsEditing: false, mediaTypes: "images" as any });
      }
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const dataUri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        setMediaUris(prev => [...prev, dataUri]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (err: any) {
      showAlert({ type: "error", title: "Erreur", message: err.message || "Impossible d'accéder aux photos.", buttons: [{ text: "OK", style: "primary" }] });
    }
  };

  const removeMedia = (index: number) => {
    setMediaUris(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!clientId) {
      showAlert({ type: "error", title: "Erreur", message: "Veuillez sélectionner un client.", buttons: [{ text: "OK", style: "primary" }] });
      return;
    }
    if (!serviceId) {
      showAlert({ type: "error", title: "Erreur", message: "Veuillez sélectionner un service.", buttons: [{ text: "OK", style: "primary" }] });
      return;
    }
    setSaving(true);
    try {
      const ht = parseFloat(priceExcludingTax) || 0;
      const rate = parseFloat(taxRate) || 0;
      const taxAmount = ht * (rate / 100);
      const body: any = {
        clientId,
        serviceId,
        status,
        quoteAmount: ht + taxAmount,
        priceExcludingTax: ht,
        taxRate: rate,
        taxAmount,
        notes,
        vehicleRegistration,
        vehicleMake,
        vehicleModel,
        requestDetails: mediaUris.length > 0 ? { mediaUrls: mediaUris } : undefined,
      };
      if (isEdit) {
        await adminQuotes.update(id, body);
      } else {
        await adminQuotes.create(body);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ["admin-quotes"] });
      if (isEdit) queryClient.invalidateQueries({ queryKey: ["admin-quote", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      router.back();
    } catch (err: any) {
      showAlert({ type: "error", title: "Erreur", message: err?.message || "Impossible de sauvegarder le devis.", buttons: [{ text: "OK", style: "primary" }] });
    } finally {
      setSaving(false);
    }
  };

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 24 : insets.bottom + 24;
  const clientsArr = Array.isArray(clients) ? clients : [];
  const servicesArr = Array.isArray(services) ? services : [];
  const selectedClient = clientsArr.find((c: any) => String(c.id) === clientId);
  const selectedService = servicesArr.find((s: any) => String(s.id) === serviceId);
  const filteredClients = clientSearch
    ? clientsArr.filter((c: any) => {
        const fullName = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
        return fullName.includes(clientSearch.toLowerCase()) || (c.email || "").toLowerCase().includes(clientSearch.toLowerCase());
      })
    : clientsArr;
  const filteredServices = serviceSearch
    ? servicesArr.filter((s: any) => (s.name || "").toLowerCase().includes(serviceSearch.toLowerCase()))
    : servicesArr;

  if (isEdit && loadingExisting) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (isEdit && loadingError && !existing) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center", gap: 16 }]}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={{ fontSize: 16, color: theme.text, textAlign: "center", paddingHorizontal: 32 }}>
          Impossible de charger les données du devis.
        </Text>
        <Pressable style={{ paddingHorizontal: 24, paddingVertical: 12, backgroundColor: theme.primary, borderRadius: 12 }} onPress={() => router.back()}>
          <Text style={{ color: "#fff", fontFamily: "Inter_600SemiBold" }}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{isEdit ? "Modifier le devis" : "Nouveau devis"}</Text>
        <View style={{ width: 40 }} />
      </View>

      <Modal visible={showClientList} animationType="slide" onRequestClose={() => setShowClientList(false)}>
        <View style={[styles.container, { paddingTop: topPad }]}>
          <View style={styles.modalHeader}>
            <Pressable style={styles.backBtn} onPress={() => { setShowClientList(false); setClientSearch(""); }}>
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
            <Text style={styles.headerTitle}>Sélectionner un client</Text>
            <View style={{ width: 44 }} />
          </View>
          <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={16} color={theme.textTertiary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Nom, email..."
                placeholderTextColor={theme.textTertiary}
                value={clientSearch}
                onChangeText={setClientSearch}
                autoFocus
              />
              {clientSearch.length > 0 && (
                <Pressable onPress={() => setClientSearch("")}>
                  <Ionicons name="close-circle" size={16} color={theme.textTertiary} />
                </Pressable>
              )}
            </View>
          </View>
          <FlatList
            data={filteredClients}
            keyExtractor={(c: any) => String(c.id)}
            renderItem={({ item }: { item: any }) => {
              const selected = clientId === String(item.id);
              return (
                <Pressable
                  style={[styles.listRow, selected && { backgroundColor: theme.primary + "15", borderColor: theme.primary }]}
                  onPress={() => { setClientId(String(item.id)); setShowClientList(false); setClientSearch(""); }}
                >
                  <View style={[styles.avatar, { backgroundColor: selected ? theme.primary : theme.primary + "20" }]}>
                    <Text style={[styles.avatarText, { color: selected ? "#fff" : theme.primary }]}>
                      {(item.firstName?.[0] || "").toUpperCase()}{(item.lastName?.[0] || "").toUpperCase() || "?"}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.listRowName, selected && { color: theme.primary }]}>{item.firstName} {item.lastName}</Text>
                    <Text style={styles.listRowSub}>{item.email}</Text>
                  </View>
                  {selected && <Ionicons name="checkmark-circle" size={20} color={theme.primary} />}
                </Pressable>
              );
            }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomPad }}
            scrollEnabled={filteredClients.length > 0}
            ListEmptyComponent={
              <View style={{ alignItems: "center", paddingTop: 40 }}>
                <Ionicons name="people-outline" size={40} color={theme.textTertiary} />
                <Text style={{ color: theme.textTertiary, marginTop: 8 }}>Aucun client trouvé</Text>
              </View>
            }
          />
        </View>
      </Modal>

      <Modal visible={showServiceList} animationType="slide" onRequestClose={() => setShowServiceList(false)}>
        <View style={[styles.container, { paddingTop: topPad }]}>
          <View style={styles.modalHeader}>
            <Pressable style={styles.backBtn} onPress={() => { setShowServiceList(false); setServiceSearch(""); }}>
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
            <Text style={styles.headerTitle}>Sélectionner un service</Text>
            <View style={{ width: 44 }} />
          </View>
          <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={16} color={theme.textTertiary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Nom du service..."
                placeholderTextColor={theme.textTertiary}
                value={serviceSearch}
                onChangeText={setServiceSearch}
                autoFocus
              />
              {serviceSearch.length > 0 && (
                <Pressable onPress={() => setServiceSearch("")}>
                  <Ionicons name="close-circle" size={16} color={theme.textTertiary} />
                </Pressable>
              )}
            </View>
          </View>
          <FlatList
            data={filteredServices}
            keyExtractor={(s: any) => String(s.id)}
            renderItem={({ item }: { item: any }) => {
              const selected = serviceId === String(item.id);
              const price = item.basePrice ? parseFloat(item.basePrice).toFixed(2) + " €" : null;
              const duration = item.estimatedDuration ? item.estimatedDuration + " min" : null;
              return (
                <Pressable
                  style={[styles.listRow, selected && { backgroundColor: theme.primary + "15", borderColor: theme.primary }]}
                  onPress={() => {
                    setServiceId(String(item.id));
                    if (item.basePrice && !priceExcludingTax) setPriceExcludingTax(String(item.basePrice));
                    setShowServiceList(false);
                    setServiceSearch("");
                  }}
                >
                  <View style={[styles.avatar, { backgroundColor: selected ? theme.primary : "#8B5CF620" }]}>
                    <Ionicons name="construct" size={18} color={selected ? "#fff" : "#8B5CF6"} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.listRowName, selected && { color: theme.primary }]}>{item.name}</Text>
                    {item.description ? <Text style={styles.listRowSub} numberOfLines={1}>{item.description}</Text> : null}
                    <View style={{ flexDirection: "row", gap: 10, marginTop: 2 }}>
                      {price ? <Text style={[styles.listRowSub, { color: theme.primary }]}>{price}</Text> : null}
                      {duration ? <Text style={styles.listRowSub}>{duration}</Text> : null}
                    </View>
                  </View>
                  {selected && <Ionicons name="checkmark-circle" size={20} color={theme.primary} />}
                </Pressable>
              );
            }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomPad }}
            scrollEnabled={filteredServices.length > 0}
            ListEmptyComponent={
              <View style={{ alignItems: "center", paddingTop: 40 }}>
                <Ionicons name="construct-outline" size={40} color={theme.textTertiary} />
                <Text style={{ color: theme.textTertiary, marginTop: 8 }}>Aucun service trouvé</Text>
              </View>
            }
          />
        </View>
      </Modal>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Client *</Text>
        <Pressable
          style={[styles.selectorBtn, selectedClient && { borderColor: theme.primary }]}
          onPress={() => setShowClientList(true)}
        >
          {selectedClient ? (
            <View style={styles.selectorContent}>
              <View style={[styles.avatar, { width: 32, height: 32, borderRadius: 16, backgroundColor: theme.primary + "20" }]}>
                <Text style={[styles.avatarText, { fontSize: 12, color: theme.primary }]}>
                  {(selectedClient.firstName?.[0] || "").toUpperCase()}{(selectedClient.lastName?.[0] || "").toUpperCase()}
                </Text>
              </View>
              <Text style={styles.selectorText}>{selectedClient.firstName} {selectedClient.lastName}</Text>
            </View>
          ) : (
            <Text style={[styles.selectorText, { color: theme.textTertiary }]}>Sélectionner un client...</Text>
          )}
          <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
        </Pressable>

        <Text style={styles.label}>Service *</Text>
        <Pressable
          style={[styles.selectorBtn, selectedService && { borderColor: "#8B5CF6" }]}
          onPress={() => setShowServiceList(true)}
        >
          {selectedService ? (
            <View style={styles.selectorContent}>
              <View style={[styles.avatar, { width: 32, height: 32, borderRadius: 16, backgroundColor: "#8B5CF620" }]}>
                <Ionicons name="construct" size={16} color="#8B5CF6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.selectorText, { color: "#8B5CF6" }]}>{selectedService.name}</Text>
                {selectedService.basePrice ? (
                  <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: theme.textTertiary }}>
                    {parseFloat(selectedService.basePrice).toFixed(2)} €
                    {selectedService.estimatedDuration ? ` · ${selectedService.estimatedDuration} min` : ""}
                  </Text>
                ) : null}
              </View>
            </View>
          ) : (
            <Text style={[styles.selectorText, { color: theme.textTertiary }]}>Sélectionner un service...</Text>
          )}
          <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
        </Pressable>

        <Text style={styles.label}>Statut</Text>
        <View style={styles.chipRow}>
          {STATUS_OPTIONS.map(s => (
            <Pressable
              key={s.value}
              style={[styles.chip, status === s.value && { backgroundColor: s.color + "20", borderColor: s.color }]}
              onPress={() => setStatus(s.value)}
            >
              <Text style={[styles.chipText, status === s.value && { color: s.color }]}>{s.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Montant HT (€)</Text>
        <TextInput
          style={styles.input}
          value={priceExcludingTax}
          onChangeText={setPriceExcludingTax}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={theme.textTertiary}
        />

        <Text style={styles.label}>Taux TVA (%)</Text>
        <View style={styles.chipRow}>
          {["0", "5.5", "10", "20"].map(rate => (
            <Pressable
              key={rate}
              style={[styles.chip, taxRate === rate && { backgroundColor: theme.primary + "20", borderColor: theme.primary }]}
              onPress={() => setTaxRate(rate)}
            >
              <Text style={[styles.chipText, taxRate === rate && { color: theme.primary }]}>{rate}%</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.totalCard, { marginTop: 8 }]}>
          <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: theme.textSecondary }}>Total TTC</Text>
          <Text style={{ fontSize: 22, fontFamily: "Inter_700Bold", color: theme.primary }}>{quoteAmount} €</Text>
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>Véhicule</Text>
        <TextInput style={styles.input} value={vehicleRegistration} onChangeText={setVehicleRegistration} placeholder="Immatriculation (AA-123-BB)" placeholderTextColor={theme.textTertiary} autoCapitalize="characters" />
        <TextInput style={[styles.input, { marginTop: 8 }]} value={vehicleMake} onChangeText={setVehicleMake} placeholder="Marque (BMW, Audi...)" placeholderTextColor={theme.textTertiary} autoCapitalize="words" />
        <TextInput style={[styles.input, { marginTop: 8 }]} value={vehicleModel} onChangeText={setVehicleModel} placeholder="Modèle (Série 3, A4...)" placeholderTextColor={theme.textTertiary} autoCapitalize="words" />

        <View style={styles.mediaHeader}>
          <Text style={styles.label}>Photos du véhicule</Text>
          <View style={styles.mediaButtons}>
            {Platform.OS !== "web" && (
              <Pressable style={styles.mediaBtn} onPress={() => pickImage(true)} accessibilityLabel="Prendre une photo">
                <Ionicons name="camera" size={18} color={theme.primary} />
              </Pressable>
            )}
            <Pressable style={styles.mediaBtn} onPress={() => pickImage(false)} accessibilityLabel="Choisir depuis la galerie">
              <Ionicons name="image" size={18} color={theme.primary} />
            </Pressable>
          </View>
        </View>

        {mediaUris.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }}>
            <View style={{ flexDirection: "row", gap: 10, paddingVertical: 4 }}>
              {mediaUris.map((uri, idx) => (
                <View key={idx} style={styles.mediaThumb}>
                  <Image source={{ uri }} style={styles.mediaThumbImg} resizeMode="cover" />
                  <Pressable style={styles.mediaThumbDel} onPress={() => removeMedia(idx)} accessibilityLabel="Supprimer photo">
                    <Ionicons name="close-circle" size={22} color="#EF4444" />
                  </Pressable>
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <Pressable style={styles.mediaEmpty} onPress={() => pickImage(false)}>
            <Ionicons name="camera-outline" size={28} color={theme.textTertiary} />
            <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: theme.textTertiary, marginTop: 6 }}>
              Ajouter des photos
            </Text>
          </Pressable>
        )}

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: "top", paddingTop: 12 }]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes internes..."
          placeholderTextColor={theme.textTertiary}
          multiline
        />

        <Pressable style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>{isEdit ? "Mettre à jour" : "Créer le devis"}</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
      {AlertComponent}
    </View>
  );
}

const getStyles = (theme: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: theme.border,
  },
  modalHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 12, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: theme.border,
  },
  backBtn: { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold", color: theme.text },
  scroll: { paddingHorizontal: 16, paddingTop: 16, gap: 6 },
  label: {
    fontSize: 12, fontFamily: "Inter_600SemiBold", color: theme.textTertiary,
    textTransform: "uppercase", letterSpacing: 0.5, marginTop: 8,
  },
  input: {
    backgroundColor: theme.surface, borderRadius: 12, borderWidth: 1, borderColor: theme.border,
    paddingHorizontal: 14, height: 48, fontSize: 15, fontFamily: "Inter_400Regular", color: theme.text,
  },
  selectorBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: theme.surface, borderRadius: 12, borderWidth: 1, borderColor: theme.border,
    paddingHorizontal: 14, height: 56, marginTop: 4,
  },
  selectorContent: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  selectorText: { fontSize: 15, fontFamily: "Inter_500Medium", color: theme.text },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
    backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border,
  },
  chipText: { fontSize: 13, fontFamily: "Inter_500Medium", color: theme.textSecondary },
  totalCard: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: theme.primary + "10", borderRadius: 12, borderWidth: 1, borderColor: theme.primary + "30",
    paddingHorizontal: 16, paddingVertical: 12,
  },
  searchBox: {
    flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: theme.surface,
    borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 12, height: 44,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", color: theme.text },
  listRow: {
    flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: theme.surface,
    borderRadius: 12, borderWidth: 1, borderColor: theme.border, padding: 12, marginBottom: 8,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  listRowName: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: theme.text },
  listRowSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: theme.textTertiary, marginTop: 1 },
  mediaHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  mediaButtons: { flexDirection: "row", gap: 8 },
  mediaBtn: {
    width: 38, height: 38, borderRadius: 10, borderWidth: 1, borderColor: theme.primary + "40",
    backgroundColor: theme.primary + "10", justifyContent: "center", alignItems: "center",
  },
  mediaEmpty: {
    backgroundColor: theme.surface, borderRadius: 12, borderWidth: 1, borderColor: theme.border,
    borderStyle: "dashed", height: 90, justifyContent: "center", alignItems: "center", marginTop: 4,
  },
  mediaThumb: { width: 90, height: 90, borderRadius: 10, overflow: "visible" },
  mediaThumbImg: { width: 90, height: 90, borderRadius: 10, backgroundColor: theme.border },
  mediaThumbDel: { position: "absolute", top: -8, right: -8, backgroundColor: theme.background, borderRadius: 11 },
  saveBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: theme.primary, borderRadius: 14, height: 52, marginTop: 20,
  },
  saveBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
});
