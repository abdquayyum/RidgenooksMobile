import "../global.css";
import { Stack } from "expo-router";
import { GlobalStateProvider } from "../context/GlobalStateContext";
import { StripeProvider } from "@stripe/stripe-react-native";
import { PaystackProvider } from "react-native-paystack-webview";
import GlobalModals from "../components/GlobalModals";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GlobalStateProvider>
        <PaystackProvider publicKey="pk_test_314dccd680068de3e230b7714972b3637607fbfb">
          <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_your_key_here"}>
            <Stack screenOptions={{ headerShown: false }} />
          </StripeProvider>
          <GlobalModals />
        </PaystackProvider>
      </GlobalStateProvider>
    </SafeAreaProvider>
  );
}
