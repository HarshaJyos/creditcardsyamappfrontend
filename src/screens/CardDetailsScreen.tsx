import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button, Paragraph } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { fetchCard } from "../store/slices/cardSlice";
import { AppDispatch, RootState } from "../store";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { applyForCard } from "../store/slices/applicationSlice";
type RootStackParamList = {
  CardDetails: { cardId: string };
  Applications: undefined;
  Compare: { card1: string; card2: string | null };
  Main: undefined; // Added for nested nav
};

const CardDetailsScreen = ({ route }: any) => {
  const { cardId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { card, loading, error } = useSelector(
    (state: RootState) => state.cards
  );
  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchCard(cardId));
  }, [dispatch, cardId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!card) return <Text style={styles.error}>Card not found</Text>;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: card.imageUrl || "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <Text style={styles.title}>{card.name}</Text>
      <Paragraph style={styles.description}>{card.description}</Paragraph>
      <Paragraph style={styles.fee}>Annual Fee: ${card.annualFee}</Paragraph>
      <Paragraph style={styles.apr}>APR: {card.apr}%</Paragraph>
      <Paragraph style={styles.offer}>
        Intro Offer: {card.introOffer || "None"}
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => {
          if (user && user._id) {
            dispatch(applyForCard({ userId: user._id.toString(), cardId }));
            navigation.navigate("Main"); // Navigate to Main without params
          }
        }}
        style={styles.button}
      >
        Apply Now
      </Button>
      <Button
        onPress={() =>
          navigation.navigate("Compare", { card1: cardId, card2: null })
        }
        style={styles.link}
      >
        Compare with Another Card
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000", padding: 20 },
  image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 10 },
  title: { color: "#FFFFFF", fontSize: 24, marginBottom: 10 },
  description: { color: "#AAAAAA", fontSize: 14 },
  fee: { color: "#FFFF00", fontSize: 14 },
  apr: { color: "#FF0000", fontSize: 14 },
  offer: { color: "#00FF00", fontSize: 14 },
  button: { backgroundColor: "#00FF00", marginTop: 20 },
  link: { color: "#FFFFFF", marginTop: 10 },
  error: { color: "#FF0000", textAlign: "center" },
});

export default CardDetailsScreen;
