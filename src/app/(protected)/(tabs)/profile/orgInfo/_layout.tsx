import { Redirect, Stack } from 'expo-router';

export default function OrgInfoLayout() {

  return (
    <Stack>
        <Stack.Screen
        name='aboutUs'
        options={{
          title: 'AboutUs',
          // animation: 'slide_from_bottom',
        }}
      />
        <Stack.Screen
        name='termsCondition'
        options={{
          title: 'Terms and Condition',
          // animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  )
}