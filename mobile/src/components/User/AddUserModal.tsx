import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { searchUsers } from '../../services/collaboration/userService';
import { UserProfile } from '../../utils/types';

interface AddUserModalProps {
  visible: boolean;
  onClose: () => void;
  onAddUser: (userId: string) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ visible, onClose, onAddUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {return;}

    setIsSearching(true);
    try {
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddUser = (userId: string) => {
    onAddUser(userId);
    setSearchQuery('');
    setSearchResults([]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Collaborator</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <Input
            placeholder="Search by name or unique ID"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />

          <Button
            title="Search"
            onPress={handleSearch}
            loading={isSearching}
            style={styles.searchButton}
          />

          {searchResults.length > 0 && (
            <View style={styles.resultsContainer}>
              {searchResults.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  style={styles.resultItem}
                  onPress={() => handleAddUser(user.id)}
                >
                  <Text style={styles.resultName}>{user.displayName}</Text>
                  <Text style={styles.resultId}>{user.uniqueId}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  searchInput: {
    marginBottom: 12,
  },
  searchButton: {
    marginBottom: 20,
  },
  resultsContainer: {
    maxHeight: 300,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultName: {
    fontSize: 16,
    fontWeight: '500',
  },
  resultId: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
