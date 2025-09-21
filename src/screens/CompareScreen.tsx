import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchCards, compareCards } from "../store/slices/cardSlice";
import CardItem from "../components/CardItem";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { AppDispatch, RootState } from "../store";
import { Button } from "react-native-paper";

const CompareScreen = ({ route }: any) => {
  const { card1, card2 } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { cards, comparison, loading, error } = useSelector(
    (state: RootState) => state.cards
  );
  const [selectedCard2, setSelectedCard2] = useState<string | null>(card2);

  useEffect(() => {
    dispatch(fetchCards());
    if (card1 && selectedCard2) {
      dispatch(compareCards({ card1, card2: selectedCard2 }));
    }
  }, [dispatch, card1, selectedCard2]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Card Comparison</Text>
      {comparison ? (
        <View style={styles.row}>
          <CardItem card={comparison.card1} />
          <CardItem card={comparison.card2} />
        </View>
      ) : (
        <View>
          <Text style={styles.subtitle}>Select Second Card to Compare</Text>
          <FlatList
            data={cards.filter((card) => card._id!.toString() !== card1)}
            keyExtractor={(item) => item._id!.toString()}
            renderItem={({ item }) => (
              <Button
                mode="outlined"
                style={styles.cardButton}
                onPress={() => setSelectedCard2(item._id!.toString())}
              >
                {item.name}
              </Button>
            )}
          />
        </View>
      )}
      {comparison && (
        <View style={styles.differences}>
          <Text style={styles.diff}>
            Annual Fee Diff: ${comparison.differences.annualFeeDiff}
          </Text>
          <Text style={styles.diff}>
            APR Diff: {comparison.differences.aprDiff}%
          </Text>
          <Text style={styles.diff}>
            Rewards Diff: {JSON.stringify(comparison.differences.rewardsDiff)}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000", padding: 20 },
  title: { color: "#FFFFFF", fontSize: 24, marginBottom: 10 },
  subtitle: { color: "#FFFFFF", fontSize: 18, marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-around" },
  differences: { marginTop: 20 },
  diff: { color: "#FFFF00", fontSize: 14, marginBottom: 5 },
  cardButton: { marginBottom: 10, borderColor: "#FFFFFF" },
});

export default CompareScreen;
