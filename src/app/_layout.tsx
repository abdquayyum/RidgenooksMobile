import "../global.css";
import { Stack, router, usePathname } from "expo-router";
import { GlobalStateProvider, useGlobalState } from "../context/GlobalStateContext";
import { StripeProvider } from "@stripe/stripe-react-native";
import { PaystackProvider } from "react-native-paystack-webview";
import GlobalModals from "../components/GlobalModals";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isReady, isAuthenticated } = useGlobalState();
  const pathname = usePathname();

  useEffect(() => {
    if (!isReady) return;
    
    // Slight delay to prevent navigation state conflicts during re-renders
    const timer = setTimeout(() => {
      if (!isAuthenticated && pathname !== '/login') {
        router.replace('/login');
      } else if (isAuthenticated && pathname === '/login') {
        router.replace('/');
      }
    }, 10);
    return () => clearTimeout(timer);
  }, [isReady, isAuthenticated, pathname]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GlobalStateProvider>
        <PaystackProvider publicKey="pk_test_314dccd680068de3e230b7714972b3637607fbfb">
          <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51Ser79BkXz3IrSREgfolHBSyAuugOH8NtlC7rLkaEB8OALbIiTd54G6IgMym6FRwH8Oc25Wcq7x7cUpHDFs01diz00sPYiWTOH"}>
            <AuthGuard>
              <Stack screenOptions={{ headerShown: false }} />
              <GlobalModals />
            </AuthGuard>
          </StripeProvider>
        </PaystackProvider>
      </GlobalStateProvider>
    </SafeAreaProvider>
  );
}
