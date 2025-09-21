import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplications } from "../store/slices/applicationSlice";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { RootState, AppDispatch } from "../store";
import { IApplication } from "../../shared/types";

const ApplicationsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { applications, loading, error } = useSelector(
    (state: RootState) => state.applications
  );
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user && user._id) dispatch(fetchApplications(user._id.toString()));
  }, [dispatch, user]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Applications</Text>
      <FlatList
        data={applications}
        keyExtractor={(item) => item._id!.toString()}
        renderItem={({ item }: { item: IApplication }) => (
          <View style={styles.item}>
            <Text style={styles.cardName}>
              {typeof item.cardId === "object" && "name" in item.cardId
                ? (item.cardId as { name: string }).name
                : item.cardId.toString()}
            </Text>
            <Text
              style={[
                styles.status,
                {
                  color:
                    item.status === "approved"
                      ? "#00FF00"
                      : item.status === "rejected"
                      ? "#FF0000"
                      : "#FFFF00",
                },
              ]}
            >
              Status: {item.status}
            </Text>
            <Text style={styles.date}>
              Applied: {new Date(item.appliedAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000", padding: 20 },
  title: { color: "#FFFFFF", fontSize: 24, marginBottom: 10 },
  item: {
    backgroundColor: "#1C1C1C",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  cardName: { color: "#FFFFFF", fontSize: 16 },
  status: { fontSize: 14 },
  date: { color: "#AAAAAA", fontSize: 12 },
});

export default ApplicationsScreen;
