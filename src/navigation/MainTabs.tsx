import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import ShopStack from '@navigation/ShopStack';
import type { ShopStackParamList } from '@navigation/ShopStack';
import CartScreen from '@screens/CartScreen';
import MeScreen from '@screens/MeScreen';
import { useCartStore } from '@stores/cartStore';
import { VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';

export type MainTabParamList = {
  Shop: NavigatorScreenParams<ShopStackParamList> | undefined;
  Cart: undefined;
  Me: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  const quantity = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  const shopTab = (
    <Tab.Screen
      key="Shop"
      name="Shop"
      component={ShopStack}
      options={{
        title: 'Cửa hàng',
        tabBarIcon: () => <Text style={styles.icon}>🏪</Text>,
      }}
    />
  );

  const cartTab = (
    <Tab.Screen
      key="Cart"
      name="Cart"
      component={CartScreen}
      options={{
        title: 'Giỏ',
        tabBarBadge: quantity > 0 ? quantity : undefined,
        tabBarIcon: () => <Text style={styles.icon}>🛒</Text>,
      }}
    />
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: styles.tabBar,
        tabBarBadgeStyle: styles.badge,
      }}>
      {VARIANT.tabOrder === 'shopFirst'
        ? [shopTab, cartTab]
        : [cartTab, shopTab]}

      <Tab.Screen
        name="Me"
        component={MeScreen}
        options={{
          title: 'Tôi',
          tabBarIcon: () => <Text style={styles.icon}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 22,
  },
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
  },
  badge: {
    backgroundColor: COLORS.secondary,
    color: COLORS.surface,
  },
});
