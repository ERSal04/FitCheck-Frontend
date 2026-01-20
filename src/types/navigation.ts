// types/navigation.ts

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
};

// You can add route params here if needed later:
// Login: { referrer?: string };
// Signup: { inviteCode?: string };

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AuthStackParamList {}
  }
}
