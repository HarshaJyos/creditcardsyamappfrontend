import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchCards } from "../store/slices/cardSlice";
import CardItem from "../components/CardItem";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { AppDispatch, RootState } from "../store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define RootStackParamList or import it from your navigation types file
type RootStackParamList = {
  CardsList: undefined;
  CardDetails: { cardId: string };
  // Add other screens and their params here
};

const CardsListScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cards, loading, error } = useSelector(
    (state: RootState) => state.cards
  );
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    dispatch(fetchCards());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Credit Cards</Text>
      <FlatList
        data={cards}
        keyExtractor={(item) => item._id!.toString()}
        renderItem={({ item }) => (
          <CardItem
            card={item}
            onPress={() =>
              navigation.navigate("CardDetails", {
                cardId: item._id ? item._id.toString() : "",
              })
            }
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000", padding: 20 },
  title: { color: "#FFFFFF", fontSize: 24, marginBottom: 10 },
});

export default CardsListScreen;
