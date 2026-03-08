import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    borderBottom: "1 solid #eeeeee",
    paddingBottom: 4,
  },
  customerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  infoItem: {
    width: "48%",
  },
  infoLabel: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
  },
  table: {
    width: "100%",
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #eeeeee",
    paddingVertical: 8,
  },
  tableHeader: {
    fontWeight: "bold",
    fontSize: 12,
  },
  tableCell: {
    fontSize: 10,
  },
  colName: {
    width: "50%",
  },
  colQty: {
    width: "20%",
    textAlign: "right",
  },
  colPrice: {
    width: "30%",
    textAlign: "right",
  },
  totals: {
    marginTop: 15,
    borderTop: "1 solid #eeeeee",
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  grandTotal: {
    fontWeight: "bold",
    fontSize: 14,
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#666666",
  },
});

const OrderReceiptPDF = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Receipt</Text>
        <div className="text-2xl font-normal tracking-tight">
          <span className="font-normal">Deliveroo</span>
          <span className="font-bold" style={{ color: "rgba(255,88,35,1)" }}>
            Food{order.orderId}
          </span>
        </div>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.customerInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{order.customerName}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{order.customerEmail}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.colName, styles.tableCell]}>Item</Text>
            <Text style={[styles.colQty, styles.tableCell]}>Qty</Text>
            <Text style={[styles.colPrice, styles.tableCell]}>Price</Text>
          </View>
          {order.foodItems.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.colName, styles.tableCell]}>
                {item.name}
              </Text>
              <Text style={[styles.colQty, styles.tableCell]}>
                {item.quantity}
              </Text>
              <Text style={[styles.colPrice, styles.tableCell]}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text>Subtotal</Text>
          <Text>
            ${order.subtotal?.toFixed(2) || order.totalPrice.toFixed(2)}
          </Text>
        </View>
        {order.deliveryFee && (
          <View style={styles.totalRow}>
            <Text>Delivery Fee</Text>
            <Text>${order.deliveryFee.toFixed(2)}</Text>
          </View>
        )}
        {order.tax && (
          <View style={styles.totalRow}>
            <Text>Tax</Text>
            <Text>${order.tax.toFixed(2)}</Text>
          </View>
        )}
        <View style={[styles.totalRow, styles.grandTotal]}>
          <Text>Total</Text>
          <Text>${order.totalPrice.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Thank you for your order!</Text>
        <Text>Order placed on {new Date().toLocaleDateString()}</Text>
      </View>
    </Page>
  </Document>
);

export default OrderReceiptPDF;
