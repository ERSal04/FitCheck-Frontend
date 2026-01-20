import { StyleSheet } from 'react-native';
import COLORS from '../colorConstants';

const VWContentStyles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    flex: 1,
  },
  square: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  flatListWrapper: {
    height: 150,
    width: '100%',
    flex: 1,
  },
  addOutfitContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 15,
  },
  addOutfitText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.light,
    marginBottom: 10,
  },
});

export default VWContentStyles;
