import { Platform, StyleSheet } from 'react-native';
import COLORS from '../colorConstants'; // Import the COLORS constant

const PopUpStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 25, 25, 0.7)', // Using primary color with opacity
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    width: 320,
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    maxHeight: '90%', // This is good, but consider making it more flexible
    borderWidth: 1,
    borderColor: COLORS.secondary,
    marginVertical: Platform.OS === 'ios' ? 30 : 10, // Add some margin for better positioning
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent, // Using accent color from constants
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.light, // Using light color from constants
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  detailsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: COLORS.secondary, // Using secondary color from constants
    padding: 12,
    marginVertical: 8,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  confirmButton: {
    backgroundColor: COLORS.accent, // Using accent color from constants
    padding: 12,
    marginVertical: 8,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  removeButton: {
    backgroundColor: '#e74c3c', // Kept this color as it's a special "danger" color
    padding: 12,
    marginVertical: 8,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: COLORS.light, // Using light color from constants
    fontSize: 16,
    fontWeight: '500',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.secondary, // Using secondary color from constants
  },
  input: {
    width: 260,
    borderWidth: 1,
    borderColor: COLORS.secondary, // Using secondary color from constants
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    textAlign: 'left',
    minHeight: 80,
    backgroundColor: COLORS.secondary, // Using secondary color from constants
    color: COLORS.light, // Using light color from constants
  },
  categoryLabel: {
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.light, // Using light color from constants
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 15,
  },
  categoryButton: {
    backgroundColor: COLORS.secondary, // Using secondary color from constants
    padding: 8,
    marginVertical: 5,
    width: '48%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333', // Subtle border - could use a darkened version of secondary
  },
  selectedCategoryButton: {
    backgroundColor: COLORS.accent, // Using accent color from constants
    borderColor: COLORS.accent, // Using accent color from constants
  },
  categoryButtonText: {
    color: COLORS.light, // Using light color from constants
    fontSize: 14,
  },
  selectedCategoryText: {
    color: COLORS.light, // Using light color from constants
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  container: {
    flex: 1,
  },
});

export default PopUpStyles;
