import { StyleSheet } from "@react-pdf/renderer";

export const pageStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 50,
    paddingRight: 50,
    lineHeight: 1.5,
    flexDirection: "column",
  },
});

export const headerStyles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  companyLine: {
    fontSize: 10,
  },
});

export const titleStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  invoiceInfo: {
    textAlign: "right",
    fontSize: 11,
  },
});

export const billToStyles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
  },
  customerLine: {
    fontSize: 11,
  },
});

export const tableStyles = StyleSheet.create({
  tableContainer: {
    marginTop: 20,
    borderTop: "1pt solid #000",
    borderBottom: "1pt solid #000",
    paddingVertical: 8,
  },
  headerRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #000",
    paddingBottom: 4,
  },
  cellDescription: {
    flex: 3,
    fontSize: 12,
    fontWeight: 700,
  },
  cellTotal: {
    flex: 1,
    textAlign: "right",
    fontSize: 12,
    fontWeight: 700,
  },
  row: {
    flexDirection: "row",
    marginTop: 8,
  },
  descriptionContainer: {
    flex: 3,
    paddingRight: 10,
  },
  descriptionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 4,
    marginTop: 6,
  },
  descriptionLine: {
    fontSize: 11,
    marginTop: 2,
  },
  totalContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  totalText: {
    fontSize: 12,
    fontWeight: 600,
  },
});

export const totalsStyles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginLeft: "auto",
    width: "40%",
    fontSize: 11,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
});

export const footerStyles = StyleSheet.create({
  footer: {
    marginTop: 40,
    fontSize: 10,
    textAlign: "center",
    color: "#666",
  },
});
