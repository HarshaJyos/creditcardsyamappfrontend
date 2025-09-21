import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendations } from "../store/slices/recommendationSlice";
import CardItem from "../components/CardItem";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { AppDispatch, RootState } from "../store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  CardsList: undefined;
  CardDetails: { cardId: string };
  // Add other screens and their params here
};
const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { recommendations, loading, error } = useSelector(
    (state: RootState) => state.recommendations
  );
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchRecommendations(user._id.toString()));
    }
  }, [dispatch, user]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Cards</Text>
      <FlatList
        data={recommendations?.recommendedCards || []}
        keyExtractor={(item) => item._id!.toString()}
        renderItem={({ item }) => (
          <CardItem
            card={item}
            onPress={() =>
              item._id &&
              navigation.navigate("CardDetails", {
                cardId: item._id.toString(),
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

export default HomeScreen;
