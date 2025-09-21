import React from "react";
import { Card, Title, Paragraph } from "react-native-paper";
import { StyleSheet } from "react-native";
import { INotification } from "../../shared/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { markRead } from "../store/slices/notificationSlice";

const NotificationItem = ({
  notification,
}: {
  notification: INotification;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{notification.title}</Title>
        <Paragraph style={styles.message}>{notification.message}</Paragraph>
        <Paragraph
          style={styles.read}
          onPress={() =>
            !notification.isRead &&
            dispatch(markRead(notification._id!.toString()))
          }
        >
          {notification.isRead ? "Read" : "Mark as Read"}
        </Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: "#1C1C1C", margin: 10, borderRadius: 10 },
  title: { color: "#FFFFFF", fontSize: 16 },
  message: { color: "#AAAAAA", fontSize: 14 },
  read: { color: "#00FF00", fontSize: 14 },
});

export default NotificationItem;
