import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { AddUserModal } from '../components/User/AddUserModal';
import { useCollaboration } from '../hooks/useCollaboration';
import { getCurrentUser } from '../services/firebase/auth';
import { UserList } from '../components/User/UserList';

interface CollaborationScreenProps {
  navigation: any;
}

export const CollaborationScreen: React.FC<CollaborationScreenProps> = ({ navigation }) => {
  const [sessionIdInput, setSessionIdInput] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const { createSession, joinSession, participants, isLoading, error } = useCollaboration();
  const user = getCurrentUser();

  const handleCreateSession = async () => {
    if (!user) {return;}
    try {
      const session = await createSession('demo-puzzle', user.id);
      navigation.navigate('Puzzle', { puzzleId: session.puzzleId, sessionId: session.id });
    } catch {
      // The hook exposes the user-facing error below.
    }
  };

  const handleJoinSession = async () => {
    if (!sessionIdInput.trim() || !user) {return;}
    try {
      const session = await joinSession(sessionIdInput.trim(), user.id);
      navigation.navigate('Puzzle', { puzzleId: session.puzzleId, sessionId: session.id });
    } catch {
      // The hook exposes the user-facing error below.
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create Session</Text>
        <Button
          title="Create New Puzzle Session"
          onPress={handleCreateSession}
          loading={isLoading}
          style={styles.button}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Join Session</Text>
        <Input
          placeholder="Enter session ID"
          value={sessionIdInput}
          onChangeText={setSessionIdInput}
          style={styles.input}
        />
        <Button
          title="Join"
          onPress={handleJoinSession}
          loading={isLoading}
          disabled={!sessionIdInput.trim()}
          variant="secondary"
          style={styles.button}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Collaborators</Text>
        <UserList users={participants} />
        <Button
          title="Add Collaborator"
          onPress={() => setShowAddUserModal(true)}
          variant="secondary"
          style={styles.button}
        />
      </View>

      <AddUserModal
        visible={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onAddUser={(userId) => {
          Alert.alert('Offline demo', `User ${userId} will be available when a session is open.`);
        }}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginBottom: 12,
  },
  error: {
    color: '#b00020',
    padding: 20,
  },
});
