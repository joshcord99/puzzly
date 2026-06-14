import React, { useState } from 'react';
import { View, StyleSheet, Share } from 'react-native';
import { UserProfile } from '../components/User/UserProfile';
import { Button } from '../components/common/Button';
import { getCurrentUser, signOut } from '../services/firebase/auth';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState(getCurrentUser());

  const handleEdit = () => {
  };

  const handleShareId = () => {
    if (user) {Share.share({ message: `Join me on Puzzly. My ID is ${user.uniqueId}.` });}
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Button title="Return Home" onPress={() => navigation.navigate('Home')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserProfile
        displayName={user.displayName || 'User'}
        email={user.email || ''}
        uniqueId={user.uniqueId || ''}
        onEdit={handleEdit}
        onShareId={handleShareId}
      />
      <Button
        title="Logout"
        onPress={handleLogout}
        variant="danger"
        style={styles.logoutButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoutButton: {
    margin: 20,
  },
});
