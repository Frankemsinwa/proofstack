import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutDashboard, PlusSquare, Users, Inbox } from 'lucide-react-native';

export default function ClientLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#9B3EFF',
        tabBarInactiveTintColor: '#C7C7C7',
        tabBarStyle: {
          backgroundColor: '#1A1A1E',
          borderTopWidth: 0,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="post-job"
        options={{
          title: 'Post Job',
          tabBarIcon: ({ color }) => <PlusSquare size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="applicants"
        options={{
          title: 'Applicants',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color }) => <Inbox size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="give-referral"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
