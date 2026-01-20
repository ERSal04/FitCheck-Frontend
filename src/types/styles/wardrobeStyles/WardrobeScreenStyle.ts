import { StyleSheet } from 'react-native';
import COLORS from '../colorConstants';

export const WardrobeStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.primary,
    paddingTop: 80,
  },
  multiIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondIcon: {
    marginLeft: 4,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: COLORS.secondary,
    borderRadius: 30,
    padding: 10,
    elevation: 5,
    zIndex: 10,
  },
  chatButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: COLORS.secondary,
    borderRadius: 30,
    padding: 10,
    elevation: 5,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.light,
    marginBottom: 20,
    marginTop: -50,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 15,
  },
  filterButton: {
    padding: 10,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    marginHorizontal: 5,
    alignItems: 'center',
    width: '20%',
    borderRadius: 20,
  },
  activeFilterButton: {
    backgroundColor: COLORS.accent,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.light,
  },
  activeFilterText: {
    color: COLORS.light,
    fontWeight: 'bold',
  },
  wardrobeContainer: {
    marginTop: 20,
    elevation: 3,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  editButton: {
    padding: 12,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    width: '77.75%',
    marginTop: 10,
    marginRight: 5,
    borderRadius: 10,
  },
  editButtonActive: {
    backgroundColor: COLORS.accent,
  },
  editButtonText: {
    fontSize: 16,
    color: COLORS.light,
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 15,
  },
});

export default WardrobeStyles;
