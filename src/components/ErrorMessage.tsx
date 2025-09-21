import React from "react";
import { Text, StyleSheet } from "react-native";

const ErrorMessage = ({ message }: { message: string }) => (
  <Text style={styles.error}>{message}</Text>
);

const styles = StyleSheet.create({
  error: { color: "#FF0000", textAlign: "center", margin: 10 },
});

export default ErrorMessage;
