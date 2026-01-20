import { StyleSheet } from 'react-native';
import COLORS from '../colorConstants';

export const AddButtonStyles = StyleSheet.create({
  AddClothingButton: {
    padding: 10,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    width: '13%',
    marginTop: 10,
    aspectRatio: 1,
    borderRadius: 10,
    elevation: 2,
  },
});
