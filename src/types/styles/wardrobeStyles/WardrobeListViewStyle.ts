import { StyleSheet } from 'react-native';
import COLORS from '../colorConstants';

export const WardrobeListViewStyles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.secondary,
    borderWidth: 1,
    width: 200, // Default width, will be overridden
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: COLORS.primary,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#e74c3c',
    borderRadius: 15,
    padding: 5,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
