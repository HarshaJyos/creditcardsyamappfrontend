import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginScreen = ({ navigation }: any) => {
  const { login } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError(null);
        await login(values.email, values.password);
        navigation.navigate("Home");
      } catch (err: any) {
        setError(err.message || "Failed to login");
      }
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        label="Email"
        value={formik.values.email}
        onChangeText={formik.handleChange("email")}
        error={!!formik.errors.email}
        style={styles.input}
      />
      {formik.errors.email && <ErrorMessage message={formik.errors.email} />}
      <TextInput
        label="Password"
        secureTextEntry
        value={formik.values.password}
        onChangeText={formik.handleChange("password")}
        error={!!formik.errors.password}
        style={styles.input}
      />
      {formik.errors.password && (
        <ErrorMessage message={formik.errors.password} />
      )}
      {error && <ErrorMessage message={error} />}
      <Button
        mode="contained"
        onPress={() => formik.handleSubmit()}
        style={styles.button}
      >
        Login
      </Button>
      <Button onPress={() => navigation.navigate("SignUp")} style={styles.link}>
        No account? Sign Up
      </Button>
      <Button
        mode="outlined"
        onPress={async () => {
          try {
            setError(null);
            await useAuth().googleLogin();
            navigation.navigate("Survey");
          } catch (err: any) {
            setError(err.message || "Failed to login with Google");
          }
        }}
        style={styles.googleButton}
        icon={() => (
          <MaterialCommunityIcons name="google" size={24} color="#FFFFFF" />
        )}
      >
        Login with Google
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  input: { marginBottom: 10, backgroundColor: "#1C1C1C", color: "#FFFFFF" },
  button: { backgroundColor: "#00FF00", marginTop: 10 },
  googleButton: { borderColor: "#FFFFFF", marginTop: 10 },
  link: { color: "#FFFFFF", marginTop: 10 },
});

export default LoginScreen;
