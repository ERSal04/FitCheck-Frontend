import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4C3A3A',
  },
  messagesButton: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  scrollView: {
    marginHorizontal: 8,
  },
  postContainer: {
    backgroundColor: '4C3A3A',
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  username: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  avgText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 4,
  },
  notificationBubble: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#4C3A3A',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default styles;
