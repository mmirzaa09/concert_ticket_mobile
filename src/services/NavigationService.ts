import {createRef} from 'react';
import {NavigationContainerRef} from '@react-navigation/native';
import {RootStackParamList} from '../types';

export const navigationRef =
  createRef<NavigationContainerRef<RootStackParamList>>();

export const NavigationService = {
  navigate: (name: keyof RootStackParamList, params?: any) => {
    navigationRef.current?.navigate(name, params);
  },

  goBack: () => {
    navigationRef.current?.goBack();
  },

  reset: (routeName: keyof RootStackParamList) => {
    navigationRef.current?.reset({
      index: 0,
      routes: [{name: routeName}],
    });
  },

  getCurrentRoute: () => {
    return navigationRef.current?.getCurrentRoute();
  },
};
