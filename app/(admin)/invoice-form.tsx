import React, { useState, useMemo, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput, Platform, ActivityIndicator, FlatList, Modal,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { adminInvoices, adminClients, adminServices } from "@/lib/admin-api";
import { useTheme } from "@/lib/theme";
import { ThemeColors } from "@/constants/theme";
import { useCustomAlert } from "@/components/CustomAlert";

const PAYMENT_MODES = ["Espèces", "Carte bancaire", "Virement", "Chèque", "Prélèvement"];

interface LineItem {
  key: string;
  description: string;
  quantity: string;
  unitPriceExcludingTax: string;
  taxRate: string;
}

function genKey() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export default function InvoiceFormScreen() {
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
  const [status, setStatus] = useState("pending");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { key: genKey(), description: "", quantity: "1", unitPriceExcludingTax: "", taxRate: "20" },
  ]);
  const [saving, setSaving] = useState(false);

  const [servicePickerItemKey, setServicePickerItemKey] = useState<string | null>(null);
  const [serviceSearch, setServiceSearch] = useState("");

  const { data: clients = [] } = useQuery({ queryKey: ["admin-clients"], queryFn: adminClients.getAll });
  const { data: services = [] } = useQuery({ queryKey: ["admin-services"], queryFn: adminServices.getAll });
  const { data: existing, isLoading: loadingExisting } = useQuery({
    queryKey: ["admin-invoice", id],
    queryFn: () => adminInvoices.getById(id),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing && isEdit) {
      setClientId(String(existing.clientId || existing.client?.id || ""));
      setStatus(existing.status || "pending");
      setPaymentMethod(existing.paymentMethod || "");
      setNotes(existing.notes || "");
      const rawItems = existing.items || existing.lines || existing.lineItems || existing.invoice_lines || [];
      if (rawItems.length) {
        setItems(
          rawItems.map((it: any) => ({
            key: genKey(),
            description: it.description || "",
            quantity: String(it.quantity || 1),
            unitPriceExcludingTax: String(it.unitPriceExcludingTax || it.unitPrice || it.unit_price || it.price || it.totalPrice || ""),
            taxRate: String(it.taxRate || it.tvaRate || it.tax_rate || 20),
          }))
        );
      }
    }
  }, [existing]);

  const calcItem = (it: LineItem) => {
    const qty = parseFloat(it.quantity) || 0;
    const price = parseFloat(it.unitPriceExcludingTax) || 0;
    const rate = parseFloat(it.taxRate) || 0;
    const totalHT = qty * price;
    const tax = totalHT * (rate / 100);
    return { totalHT, tax, totalTTC: totalHT + tax };
  };

  const totals = items.reduce(
    (acc, it) => {
      const c = calcItem(it);
      return { ht: acc.ht + c.totalHT, tax: acc.tax + c.tax, ttc: acc.ttc + c.totalTTC };
    },
    { ht: 0, tax: 0, ttc: 0 }
  );

  const updateItem = (key: string, field: keyof LineItem, value: string) => {
    setItems(prev => prev.map(it => (it.key === key ? { ...it, [field]: value } : it)));
  };

  const addItem = () =>
    setItems(prev => [
      ...prev,
      { key: genKey(), description: "", quantity: "1", unitPriceExcludingTax: "", taxRate: "20" },
    ]);

  const removeItem = (key: string) => setItems(prev => prev.filter(it => it.key !== key));

  const openServicePicker = (itemKey: string) => {
    setServicePickerItemKey(itemKey);
    setServiceSearch("");
  };

  const closeServicePicker = () => {
    setServicePickerItemKey(null);
    setServiceSearch("");
  };

  const selectServiceForItem = (svc: any) => {
    if (!servicePickerItemKey) return;
    setItems(prev => prev.map(it => {
      if (it.key !== servicePickerItemKey) return it;
      return {
        ...it,
        description: svc.description ? `${svc.name} — ${svc.description}` : (svc.name || it.description),
        unitPriceExcludingTax: svc.basePrice != null ? String(parseFloat(svc.basePrice)) : it.unitPriceExcludingTax,
      };
    }));
    Haptics.selectionAsync();
    closeServicePicker();
  };

  const handleSave = async () => {
    if (!clientId) {
      showAlert({ type: "error", title: "Erreur", message: "Veuillez sélectionner un client.", buttons: [{ text: "OK", style: "primary" }] });
      return;
    }
    setSaving(true);
    try {
      const builtItems = items.map(it => {
        const c = calcItem(it);
        return {
          description: it.description,
          quantity: parseFloat(it.quantity) || 0,
          unitPriceExcludingTax: parseFloat(it.unitPriceExcludingTax) || 0,
          totalExcludingTax: c.totalHT,
          taxRate: parseFloat(it.taxRate) || 0,
          taxAmount: c.tax,
          totalIncludingTax: c.totalTTC,
        };
      });
      const body: any = {
        clientId,
        status,
        amount: totals.ttc,
        priceExcludingTax: totals.ht,
        taxRate: items.length > 0 ? parseFloat(items[0].taxRate) || 20 : 20,
        taxAmount: totals.tax,
        paymentMethod,
        notes,
        items: builtItems,
      };
      if (isEdit) await adminInvoices.update(id, body);
      else await adminInvoices.create(body);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ["admin-invoices"] });
      if (isEdit) queryClient.invalidateQueries({ queryKey: ["admin-invoice", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      router.back();
    } catch (err: any) {
      showAlert({ type: "error", title: "Erreur", message: err.message || "Impossible de sauvegarder.", buttons: [{ text: "OK", style: "primary" }] });
    } finally {
      setSaving(false);
    }
  };

  const topPad = Platform.OS === "web" ? 67 + 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 34 + 24 : insets.bottom + 24;
  const clientsArr = Array.isArray(clients) ? clients : [];
  const servicesArr = Array.isArray(services) ? services : [];
  const selectedClient = clientsArr.find((c: any) => String(c.id) === clientId);
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

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityLabel="Retour">
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{isEdit ? "Modifier la facture" : "Nouvelle facture"}</Text>
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
                placeholder="Rechercher par nom ou email..."
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

      <Modal visible={servicePickerItemKey !== null} animationType="slide" onRequestClose={closeServicePicker}>
        <View style={[styles.container, { paddingTop: topPad }]}>
          <View style={styles.modalHeader}>
            <Pressable style={styles.backBtn} onPress={closeServicePicker}>
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
            <Text style={styles.headerTitle}>Choisir un service</Text>
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
              const price = item.basePrice != null ? parseFloat(item.basePrice).toFixed(2) + " € HT" : null;
              const dur = item.estimatedDuration != null
                ? (String(item.estimatedDuration).includes("min") ? item.estimatedDuration : item.estimatedDuration + " min")
                : null;
              return (
                <Pressable
                  style={styles.listRow}
                  onPress={() => selectServiceForItem(item)}
                >
                  <View style={[styles.avatar, { backgroundColor: theme.primary + "20" }]}>
                    <Ionicons name="construct" size={18} color={theme.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.listRowName}>{item.name}</Text>
                    {item.description ? <Text style={styles.listRowSub} numberOfLines={1}>{item.description}</Text> : null}
                    <View style={{ flexDirection: "row", gap: 10, marginTop: 2 }}>
                      {price ? <Text style={[styles.listRowSub, { color: theme.primary }]}>{price}</Text> : null}
                      {dur ? <Text style={styles.listRowSub}>{dur}</Text> : null}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={theme.textTertiary} />
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

        <Text style={styles.label}>Statut</Text>
        <View style={styles.chipRow}>
          {[
            { v: "pending", l: "En attente", color: "#F59E0B" },
            { v: "paid", l: "Payée", color: "#22C55E" },
            { v: "cancelled", l: "Annulée", color: "#EF4444" },
          ].map(s => (
            <Pressable
              key={s.v}
              style={[styles.chip, status === s.v && { backgroundColor: s.color + "20", borderColor: s.color }]}
              onPress={() => setStatus(s.v)}
            >
              <Text style={[styles.chipText, status === s.v && { color: s.color }]}>{s.l}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Moyen de paiement</Text>
        <View style={styles.chipRow}>
          {PAYMENT_MODES.map(mode => (
            <Pressable
              key={mode}
              style={[styles.chip, paymentMethod === mode && { backgroundColor: theme.primary + "20", borderColor: theme.primary }]}
              onPress={() => setPaymentMethod(mode)}
            >
              <Text style={[styles.chipText, paymentMethod === mode && { color: theme.primary }]}>{mode}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.itemsHeader}>
          <Text style={styles.sectionTitle}>Lignes de facture</Text>
          <Pressable style={styles.addItemBtn} onPress={addItem} accessibilityLabel="Ajouter une ligne">
            <Ionicons name="add" size={18} color={theme.primary} />
            <Text style={styles.addItemText}>Ajouter</Text>
          </Pressable>
        </View>

        {items.map((item, idx) => (
          <View key={item.key} style={styles.itemCard}>
            <View style={styles.itemHeaderRow}>
              <Text style={styles.itemNumber}>Ligne {idx + 1}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Pressable
                  style={styles.servicePickBtn}
                  onPress={() => openServicePicker(item.key)}
                  accessibilityLabel="Choisir un service"
                >
                  <Ionicons name="construct-outline" size={14} color={theme.primary} />
                  <Text style={styles.servicePickText}>Services</Text>
                </Pressable>
                {items.length > 1 && (
                  <Pressable onPress={() => removeItem(item.key)} accessibilityLabel="Supprimer la ligne">
                    <Ionicons name="close-circle" size={22} color="#EF4444" />
                  </Pressable>
                )}
              </View>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor={theme.textTertiary}
              value={item.description}
              onChangeText={v => updateItem(item.key, "description", v)}
            />
            <View style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.miniLabel}>Qté</Text>
                <TextInput style={styles.input} value={item.quantity} onChangeText={v => updateItem(item.key, "quantity", v)} keyboardType="decimal-pad" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.miniLabel}>Prix HT</Text>
                <TextInput style={styles.input} value={item.unitPriceExcludingTax} onChangeText={v => updateItem(item.key, "unitPriceExcludingTax", v)} keyboardType="decimal-pad" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.miniLabel}>TVA %</Text>
                <TextInput style={styles.input} value={item.taxRate} onChangeText={v => updateItem(item.key, "taxRate", v)} keyboardType="decimal-pad" />
              </View>
            </View>
            <Text style={styles.itemTotal}>
              {"TTC: " + calcItem(item).totalTTC.toFixed(2) + " \u20AC"}
            </Text>
          </View>
        ))}

        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total HT</Text>
            <Text style={styles.totalVal}>{totals.ht.toFixed(2) + " \u20AC"}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA</Text>
            <Text style={styles.totalVal}>{totals.tax.toFixed(2) + " \u20AC"}</Text>
          </View>
          <View style={[styles.totalRow, { borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 8, marginTop: 4 }]}>
            <Text style={styles.totalLabelBold}>Total TTC</Text>
            <Text style={styles.totalValBold}>{totals.ttc.toFixed(2) + " \u20AC"}</Text>
          </View>
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: "top", paddingTop: 12 }]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes..."
          placeholderTextColor={theme.textTertiary}
          multiline
        />

        <Pressable style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>{isEdit ? "Mettre à jour" : "Créer la facture"}</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
      {AlertComponent}
    </View>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
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
    miniLabel: { fontSize: 10, fontFamily: "Inter_500Medium", color: theme.textTertiary, marginBottom: 2 },
    input: {
      backgroundColor: theme.surface, borderRadius: 12, borderWidth: 1, borderColor: theme.border,
      paddingHorizontal: 14, height: 48, fontSize: 15, fontFamily: "Inter_400Regular", color: theme.text,
    },
    selectorBtn: {
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      backgroundColor: theme.surface, borderRadius: 12, borderWidth: 1, borderColor: theme.border,
      paddingHorizontal: 14, height: 52, marginTop: 4,
    },
    selectorContent: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
    selectorText: { fontSize: 15, fontFamily: "Inter_500Medium", color: theme.text },
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
    chip: {
      paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
      backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border,
    },
    chipText: { fontSize: 13, fontFamily: "Inter_500Medium", color: theme.textSecondary },
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
    sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold", color: theme.text },
    itemsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 16 },
    addItemBtn: {
      flexDirection: "row", alignItems: "center", gap: 4,
      paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, backgroundColor: theme.primary + "15",
    },
    addItemText: { fontSize: 13, fontFamily: "Inter_500Medium", color: theme.primary },
    itemCard: {
      backgroundColor: theme.surface, borderRadius: 14, borderWidth: 1,
      borderColor: theme.border, padding: 14, gap: 8, marginTop: 8,
    },
    itemHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    itemNumber: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: theme.textTertiary },
    servicePickBtn: {
      flexDirection: "row", alignItems: "center", gap: 4,
      paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8,
      backgroundColor: theme.primary + "15", borderWidth: 1, borderColor: theme.primary + "30",
    },
    servicePickText: { fontSize: 11, fontFamily: "Inter_500Medium", color: theme.primary },
    itemRow: { flexDirection: "row", gap: 8 },
    itemTotal: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: theme.primary, textAlign: "right" },
    totalCard: {
      backgroundColor: theme.surface, borderRadius: 14, borderWidth: 1,
      borderColor: theme.border, padding: 14, gap: 6, marginTop: 12,
    },
    totalRow: { flexDirection: "row", justifyContent: "space-between" },
    totalLabel: { fontSize: 14, fontFamily: "Inter_400Regular", color: theme.textSecondary },
    totalVal: { fontSize: 14, fontFamily: "Inter_500Medium", color: theme.text },
    totalLabelBold: { fontSize: 16, fontFamily: "Inter_700Bold", color: theme.text },
    totalValBold: { fontSize: 16, fontFamily: "Inter_700Bold", color: theme.primary },
    saveBtn: {
      flexDirection: "row", alignItems: "center", justifyContent: "center",
      gap: 8, backgroundColor: theme.primary, borderRadius: 14, height: 52, marginTop: 20,
    },
    saveBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
  });
