import { StyleSheet } from 'react-native';

export const AddPostStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  postButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  postButtonText: {
    color: '#FF8C05',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonTextDisabled: {
    color: '#777',
  },
  content: {
    flex: 1,
  },
  imageSection: {
    width: '100%',
    height: 350,
  },
  imageSelectionContainer: {
    flex: 1,
    backgroundColor: '#111',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#777',
    fontSize: 16,
    marginTop: 10,
  },
  imageSourceButtons: {
    flexDirection: 'row',
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  imageSourceButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonDivider: {
    width: 1,
    backgroundColor: '#222',
  },
  sourceButtonText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10,
  },
  imagePreviewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlayButtons: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    flexDirection: 'row',
  },
  imageActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  inputSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  inputLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  captionInput: {
    color: '#FFF',
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 10,
  },
  locationInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  addTagButton: {
    backgroundColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addTagText: {
    color: '#FFF',
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#FFF',
    fontSize: 14,
    marginRight: 5,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  categoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#222',
    marginRight: 10,
  },
  categoryItemActive: {
    backgroundColor: '#FF8C05',
  },
  categoryText: {
    color: '#FFF',
    fontSize: 14,
  },
  categoryTextActive: {
    fontWeight: 'bold',
    color: '#FFF',
  },
  audienceContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  audienceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#222',
    marginRight: 10,
  },
  audienceOptionActive: {
    backgroundColor: 'rgba(255, 140, 5, 0.2)',
    borderWidth: 1,
    borderColor: '#FF8C05',
  },
  audienceText: {
    color: '#FFF',
    fontSize: 14,
    marginLeft: 5,
  },
  audienceTextActive: {
    fontWeight: 'bold',
    color: '#FF8C05',
  },
});
