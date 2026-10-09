import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from '@navigation/AuthStack';
import MainTabs from '@navigation/MainTabs';
import { useAuthStore } from '@stores/authStore';

type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const token = useAuthStore(state => state.token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token === null ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="Main" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
}
