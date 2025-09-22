import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../store/slices/notificationSlice";
import NotificationItem from "../components/NotificationItem";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { AppDispatch, RootState } from "../store";
import { useAuth } from "../context/AuthContext"; // Added

const NotificationsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, loading, error } = useSelector(
    (state: RootState) => state.notifications
  );
  const { user } = useAuth(); // Fixed: Use context

  useEffect(() => {
    if (user && user._id) dispatch(fetchNotifications(user._id.toString()));
  }, [dispatch, user]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id!.toString()}
        renderItem={({ item }) => <NotificationItem notification={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000", padding: 20 },
  title: { color: "#FFFFFF", fontSize: 24, marginBottom: 10 },
});

export default NotificationsScreen;
