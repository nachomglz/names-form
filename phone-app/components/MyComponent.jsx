import React from "react";
import { View } from "react-native";
import { makeStyles, Text, Button, useThemeMode } from "@rneui/themed";

export default function App() {
  const styles = useStyles()

  return (
    <View style={styles.container} >
      <Button style={styles.button} title="Press on me"/>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginVertical: theme.spacing.lg,
  },
}));
