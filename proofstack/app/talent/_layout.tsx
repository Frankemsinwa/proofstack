import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutDashboard, Briefcase, User, Trophy } from 'lucide-react-native';

export default function TalentLayout() {
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
        name="jobs"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color }) => <Briefcase size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="challenge"
        options={{
          title: 'Challenge',
          tabBarIcon: ({ color }) => <Trophy size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="edit-profile"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="submit-peer-referral"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="upload-portfolio-project"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="job-detail/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
