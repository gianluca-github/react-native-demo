import React, { useCallback } from "react";
import { Alert, Text, Linking } from "react-native";


const Link = props => {
  const { url, text, textStyle } = props;

  const handlePress = useCallback(async () => {
    
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Impossibile eseguire il comando su questo link`);
    }
  }, [url]);

  return <Text style={{ ...textStyle }} onPress={handlePress}> {text} </Text>;
};

export default Link;