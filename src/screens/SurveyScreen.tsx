import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Text, Checkbox } from "react-native-paper";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { submitSurvey } from "../store/slices/userSlice";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import { ISurvey } from "../../shared/types";
import { AppDispatch } from "../store";

const validationSchema = Yup.object().shape({
  annualIncome: Yup.number()
    .min(0, "Invalid income")
    .required("Annual income is required"),
  creditScore: Yup.number()
    .min(300, "Invalid credit score")
    .max(850)
    .required("Credit score is required"),
  spendingHabits: Yup.object().shape({
    travel: Yup.number().min(0).required(),
    dining: Yup.number().min(0).required(),
    shopping: Yup.number().min(0).required(),
    groceries: Yup.number().min(0).required(),
    other: Yup.number().min(0).required(),
  }),
  preferredRewards: Yup.array()
    .min(1, "Select at least one reward type")
    .required(),
});

const SurveyScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      annualIncome: 0,
      creditScore: 0,
      spendingHabits: {
        travel: 0,
        dining: 0,
        shopping: 0,
        groceries: 0,
        other: 0,
      },
      preferredRewards: [] as string[],
      currentCards: [] as string[],
    },
    validationSchema,
    onSubmit: async (values: ISurvey) => {
      try {
        setError(null);
        if (user && user._id) {
          await dispatch(
            submitSurvey({ userId: user._id.toString(), survey: values })
          );
          navigation.navigate("Home");
        } else {
          setError("User information is missing. Please log in again.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to submit survey");
      }
    },
  });

  const toggleReward = (reward: string) => {
    const rewards = formik.values.preferredRewards.includes(reward)
      ? formik.values.preferredRewards.filter((r) => r !== reward)
      : [...formik.values.preferredRewards, reward];
    formik.setFieldValue("preferredRewards", rewards);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding Survey</Text>
      <TextInput
        label="Annual Income ($)"
        keyboardType="numeric"
        value={formik.values.annualIncome.toString()}
        onChangeText={(text) =>
          formik.setFieldValue("annualIncome", parseInt(text) || 0)
        }
        style={styles.input}
        error={!!formik.errors.annualIncome}
      />
      {formik.errors.annualIncome && (
        <ErrorMessage message={formik.errors.annualIncome} />
      )}
      <TextInput
        label="Credit Score"
        keyboardType="numeric"
        value={formik.values.creditScore.toString()}
        onChangeText={(text) =>
          formik.setFieldValue("creditScore", parseInt(text) || 0)
        }
        style={styles.input}
        error={!!formik.errors.creditScore}
      />
      {formik.errors.creditScore && (
        <ErrorMessage message={formik.errors.creditScore} />
      )}
      <Text style={styles.subtitle}>Monthly Spending ($)</Text>
      <TextInput
        label="Travel"
        keyboardType="numeric"
        value={formik.values.spendingHabits.travel.toString()}
        onChangeText={(text) =>
          formik.setFieldValue("spendingHabits.travel", parseInt(text) || 0)
        }
        style={styles.input}
      />
      <TextInput
        label="Dining"
        keyboardType="numeric"
        value={formik.values.spendingHabits.dining.toString()}
        onChangeText={(text) =>
          formik.setFieldValue("spendingHabits.dining", parseInt(text) || 0)
        }
        style={styles.input}
      />
      <TextInput
        label="Shopping"
        keyboardType="numeric"
        value={formik.values.spendingHabits.shopping.toString()}
        onChangeText={(text) =>
          formik.setFieldValue("spendingHabits.shopping", parseInt(text) || 0)
        }
        style={styles.input}
      />
      <TextInput
        label="Groceries"
        keyboardType="numeric"
        value={formik.values.spendingHabits.groceries.toString()}
        onChangeText={(text) =>
          formik.setFieldValue("spendingHabits.groceries", parseInt(text) || 0)
        }
        style={styles.input}
      />
      <TextInput
        label="Other"
        keyboardType="numeric"
        value={formik.values.spendingHabits.other.toString()}
        onChangeText={(text) =>
          formik.setFieldValue("spendingHabits.other", parseInt(text) || 0)
        }
        style={styles.input}
      />
      <Text style={styles.subtitle}>Preferred Rewards</Text>
      {["cashback", "points", "miles"].map((reward) => (
        <Checkbox.Item
          key={reward}
          label={reward.charAt(0).toUpperCase() + reward.slice(1)}
          status={
            formik.values.preferredRewards.includes(reward)
              ? "checked"
              : "unchecked"
          }
          onPress={() => toggleReward(reward)}
          labelStyle={styles.checkboxLabel}
          style={styles.checkbox}
        />
      ))}
      {formik.errors.preferredRewards && (
        <ErrorMessage
          message={
            Array.isArray(formik.errors.preferredRewards)
              ? formik.errors.preferredRewards.join(", ")
              : formik.errors.preferredRewards
          }
        />
      )}
      {error && <ErrorMessage message={error} />}
      <Button
        mode="contained"
        onPress={() => formik.handleSubmit}
        style={styles.button}
      >
        Submit Survey
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000", padding: 20 },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: { color: "#FFFFFF", fontSize: 18, marginTop: 10, marginBottom: 5 },
  input: { marginBottom: 10, backgroundColor: "#1C1C1C", color: "#FFFFFF" },
  button: { backgroundColor: "#00FF00", marginTop: 20 },
  checkbox: { backgroundColor: "#1C1C1C", marginBottom: 5 },
  checkboxLabel: { color: "#FFFFFF" },
});

export default SurveyScreen;
