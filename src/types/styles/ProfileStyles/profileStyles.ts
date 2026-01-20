import { StyleSheet, Platform, Dimensions } from 'react-native';
import COLORS from '../colorConstants';

// Get screen dimensions for responsive layout
const { width } = Dimensions.get('window');
const numColumns = 2; // Using 3 columns for profile posts
const gap = 2;
const itemWidth = (width - gap * (numColumns + 1)) / numColumns;

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: COLORS.light,
    fontSize: 14,
    fontWeight: '600',
  },
  headerContainer: {
    height: 150,
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 15,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLeftButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 60, // Position it to the right of where back button would be
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Style for wardrobe button when on own profile (moves to left edge)
  ownProfileWardrobe: {
    left: 15, // Move to the left edge where back button would be
  },
  topRightButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 15,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    marginTop: -50,
  },
  scrollViewContent: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
    paddingBottom: 30,
  },
  profileInfoContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  socialStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  statContainer: {
    // height: '',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCount: {
    color: COLORS.light,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: COLORS.light,
    fontSize: 14,
    marginTop: 5,
  },
  profilePicContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#333',
    overflow: 'hidden',
    position: 'relative',
  },
  profilePic: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.accent,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'black',
  },
  userName: {
    color: COLORS.light,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userBio: {
    color: COLORS.light,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  followButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  followButtonText: {
    color: COLORS.light,
    fontSize: 14,
    fontWeight: '600',
  },
  contentSection: {
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    color: COLORS.light,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionToggle: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: COLORS.light,
    fontSize: 14,
  },
  contentText: {
    color: '#888',
    fontSize: 14,
  },
  postsGrid: {
    width: '100%',
    paddingHorizontal: 0,
  },
  postLikes: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  postLikesText: {
    color: COLORS.light,
    fontSize: 10,
    marginLeft: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,1)',
  },
  modalView: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  fullScreenImage: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4, // Make it perfectly circular
    borderWidth: 4,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.primary,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  editModalView: {
    width: '80%',
    backgroundColor: COLORS.darkBg,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    color: COLORS.light,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.accent,
  },
  modalButtonIcon: {
    marginRight: 10,
  },
  modalButtonText: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  cancelButtonText: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: '500',
  },

  // Edit Profile Modal Styles
  editProfileModalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'Black',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bioInput: {
    color: COLORS.light,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
  },
  inputHelper: {
    color: '#777',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: COLORS.accent,
  },
  saveButtonText: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: '600',
  },

  // Grid layout for posts
  gridPostItem: {
    width: itemWidth,
    height: itemWidth * 1.2,
    margin: gap / 2,
    position: 'relative',
  },
  gridPostImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },

  // Empty state styling
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  emptyStateSubText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  emptyStateButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 15,
  },
  emptyStateButtonText: {
    color: COLORS.light,
    fontSize: 14,
    fontWeight: '600',
  },
  postItem: {
    width: itemWidth,
    height: itemWidth * 1.2,
    margin: gap / 2,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
});
