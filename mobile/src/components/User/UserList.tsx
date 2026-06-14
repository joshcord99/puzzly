import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

interface User {
  id?: string;
  userId?: string;
  displayName: string;
  avatar?: string;
  isOnline: boolean;
  isActive: boolean;
}

interface UserListProps {
  users: User[];
  onRemoveUser?: (userId: string) => void;
  currentUserId?: string;
}

export const UserList: React.FC<UserListProps> = ({ users, onRemoveUser, currentUserId }) => {
  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        {item.avatar && <View style={styles.avatar} />}
        <View>
          <Text style={styles.userName}>{item.displayName}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, item.isOnline && styles.statusOnline]} />
            <Text style={styles.statusText}>{item.isOnline ? 'Online' : 'Offline'}</Text>
          </View>
        </View>
      </View>
      {onRemoveUser && (item.id || item.userId) !== currentUserId && (
        <TouchableOpacity onPress={() => onRemoveUser(item.id || item.userId || '')}>
          <Text style={styles.removeButton}>Remove</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <FlatList
      data={users}
      renderItem={renderUser}
      keyExtractor={(item) => item.id || item.userId || item.displayName}
      ListEmptyComponent={<Text style={styles.empty}>No collaborators yet</Text>}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
    marginRight: 6,
  },
  statusOnline: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  removeButton: {
    color: '#dc3545',
    fontSize: 14,
  },
  empty: {
    color: '#666',
    padding: 16,
    textAlign: 'center',
  },
});
