import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../store/slices/userSlice";
import { useAuth } from "../context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { AppDispatch, RootState } from "../store";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
});

const ProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { logout } = useAuth();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  const [updateError, setUpdateError] = React.useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setUpdateError(null);
        if (user && user._id) {
          await dispatch(
            updateUser({ userId: user._id.toString(), data: values })
          );
        } else {
          setUpdateError("User ID is missing");
        }
      } catch (err: any) {
        setUpdateError(err.message || "Failed to update profile");
      }
    },
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <ErrorMessage message="User not found" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.info}>Email: {user.email}</Text>
      <TextInput
        label="First Name"
        value={formik.values.firstName}
        onChangeText={formik.handleChange("firstName")}
        error={!!formik.errors.firstName}
        style={styles.input}
        theme={{
          colors: {
            text: "#FFFFFF",
            placeholder: "#AAAAAA",
            background: "#1C1C1C",
          },
        }}
      />
      {formik.errors.firstName && (
        <ErrorMessage message={formik.errors.firstName} />
      )}
      <TextInput
        label="Last Name"
        value={formik.values.lastName}
        onChangeText={formik.handleChange("lastName")}
        error={!!formik.errors.lastName}
        style={styles.input}
        theme={{
          colors: {
            text: "#FFFFFF",
            placeholder: "#AAAAAA",
            background: "#1C1C1C",
          },
        }}
      />
      {formik.errors.lastName && (
        <ErrorMessage message={formik.errors.lastName} />
      )}
      {updateError && <ErrorMessage message={updateError} />}
      <Button
        mode="contained"
        onPress={() => formik.handleSubmit}
        style={styles.button}
      >
        Update Profile
      </Button>
      <Button
        mode="contained"
        onPress={async () => {
          try {
            await logout();
          } catch (err: any) {
            setUpdateError(err.message || "Failed to logout");
          }
        }}
        style={styles.logoutButton}
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000", padding: 20 },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  info: { color: "#FFFFFF", fontSize: 16, marginBottom: 20 },
  input: { marginBottom: 10, backgroundColor: "#1C1C1C" },
  button: { backgroundColor: "#00FF00", marginTop: 20, marginBottom: 10 },
  logoutButton: { backgroundColor: "#FF0000" },
});

export default ProfileScreen;
