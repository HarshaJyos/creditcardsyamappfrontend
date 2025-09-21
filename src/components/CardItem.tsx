// Update in CardItem.tsx
import React from "react";
import { Card, Title, Paragraph } from "react-native-paper";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { ICreditCard } from "../../shared/types";

const CardItem = ({
  card,
  onPress,
}: {
  card: ICreditCard;
  onPress?: () => void;
}) => (
  <TouchableOpacity onPress={onPress}>
    <Card style={styles.card}>
      <Card.Cover
        source={{ uri: card.imageUrl || "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <Card.Content>
        <Title style={styles.title}>{card.name}</Title>
        <Paragraph style={styles.description}>{card.description}</Paragraph>
        <Paragraph style={styles.fee}>Annual Fee: ${card.annualFee}</Paragraph>
        <Paragraph style={styles.apr}>APR: {card.apr}%</Paragraph>
      </Card.Content>
    </Card>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: { backgroundColor: "#1C1C1C", margin: 10, borderRadius: 10 },
  image: { height: 100, resizeMode: "contain" },
  title: { color: "#FFFFFF", fontSize: 18 },
  description: { color: "#AAAAAA", fontSize: 14 },
  fee: { color: "#FFFF00" },
  apr: { color: "#FF0000" },
});

export default CardItem;
