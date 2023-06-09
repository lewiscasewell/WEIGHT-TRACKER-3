/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-get-random-values';
import {
  CompositeNavigationProp,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {
  LogBox,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {LoginScreen} from './src/screens/login';
import {supabase} from './src/supabase';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import {database} from './src/watermelondb';

import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {HomeScreen} from './src/screens/home';
import {ProfileScreen} from './src/screens/profile';
import CaloriesScreen from './src/screens/calories';
import AddWeightScreen from './src/screens/addWeight';

import {useAtom} from 'jotai';
import {sessionAtom} from './src/atoms/session.atom';
import {useSyncDatabase} from './src/watermelondb/sync/use-sync';

import {colors, theme} from './src/styles/theme';
import {MaterialIcon} from './src/icons/material-icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import EditProfileScreen from './src/screens/editProfile';
import {appLoadingAtom} from './src/atoms/appLoading.atom';
import {UpdateEmailAddressScreen} from './src/screens/updateEmailAddress';
import Animated, {FadeInDown, Layout} from 'react-native-reanimated';

dayjs.extend(utc);

LogBox.ignoreLogs([
  'useSharedValueEffect()',
  'Overriding previous layout animation',
]);

// database.write(async () => {
//   await database.unsafeResetDatabase();
// });

export type TabStackParamList = {
  Weights: {id: string};
  Calories: {id: string};
  Profile: undefined;
};

export type ProfileAttribute =
  | 'height'
  | 'name'
  | 'gender'
  | 'age'
  | 'activityLevel'
  | 'targetWeight'
  | 'targetCalories';

export type AuthStackParamList = {
  index: undefined;
  AddWeight: {dateToPass: string; id: string};
  EditProfile: {
    id: string;
  };
  UpdateEmailAddress: undefined;
};

export type NoAuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type NoAuthStackNavigationProps =
  NativeStackNavigationProp<NoAuthStackParamList>;

export type TabStackNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList>,
  NativeStackNavigationProp<AuthStackParamList>
>;

const NoAuthStack = createNativeStackNavigator<NoAuthStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const TabStack = createBottomTabNavigator<TabStackParamList>();

const Tabs = () => {
  const navigation = useNavigation<TabStackNavigationProps>();
  const {isSyncing, error} = useSyncDatabase();
  const [session] = useAtom(sessionAtom);

  if (isSyncing || error) {
    console.log('isSyncing', isSyncing);
    console.log('error', error);
  }

  return (
    <>
      <TabStack.Navigator screenOptions={{headerShown: false}}>
        <TabStack.Screen
          name="Weights"
          initialParams={{id: session?.user.id}}
          component={HomeScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialIcon name="scale-bathroom" color={color} size={size} />
            ),
          }}
        />
        <TabStack.Screen
          name="Calories"
          initialParams={{id: session?.user.id}}
          component={CaloriesScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialIcon name="fire-circle" color={color} size={size} />
            ),
          }}
        />
        <TabStack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialIcon name="account-circle" color={color} size={size} />
            ),
          }}
        />
      </TabStack.Navigator>
      {session && (
        <Animated.View
          entering={FadeInDown}
          layout={Layout.duration(200).delay(200).springify()}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('AddWeight', {
                dateToPass: dayjs().format('YYYY-MM-DD'),
                id: session.user.id,
              });
            }}
            style={styles.addButton}>
            <MaterialIcon name="plus" color={colors.grey['100']} size={40} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
};

function App(): JSX.Element {
  const [userSession, setSession] = useAtom(sessionAtom);
  const [isAppLoading] = useAtom(appLoadingAtom);

  useEffect(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        database.write(async () => {
          await database.unsafeResetDatabase();
        });
      }

      setSession(session);
    });
  }, [setSession]);

  return (
    <NavigationContainer theme={theme}>
      <DatabaseProvider database={database}>
        <SafeAreaProvider>
          <StatusBar barStyle="light-content" />
          {isAppLoading.isAppLoading && (
            <View
              style={{
                flex: 1,
                minHeight: Dimensions.get('screen').height,
                backgroundColor: colors.black,
              }}>
              <Text
                style={{
                  padding: 100,
                  color: colors.grey['100'],
                  textAlign: 'center',
                  fontSize: 22,
                }}>
                Loading your profile
              </Text>
            </View>
          )}
          {userSession && (
            <AuthStack.Navigator
              screenOptions={() => {
                return {
                  headerShown: false,
                };
              }}>
              <AuthStack.Screen name="index" component={Tabs} />
              <AuthStack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{
                  headerShown: true,
                }}
              />
              <AuthStack.Screen
                name="UpdateEmailAddress"
                component={UpdateEmailAddressScreen}
                options={{
                  headerShown: true,
                }}
              />
              <AuthStack.Screen
                name="AddWeight"
                component={AddWeightScreen}
                options={{
                  presentation: 'modal',
                }}
              />
            </AuthStack.Navigator>
          )}

          {!userSession && (
            <NoAuthStack.Navigator>
              <NoAuthStack.Screen
                name="Login"
                component={LoginScreen}
                options={{headerShown: false}}
              />
            </NoAuthStack.Navigator>
          )}
        </SafeAreaProvider>
      </DatabaseProvider>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: colors['picton-blue'][400],
    height: 60,
    width: 60,
    position: 'absolute',
    right: 20,
    bottom: 100,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.grey[200],
  },
});
