import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../components/common/Button';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heroTitle}>Solve together, anywhere.</Text>
        <Text style={styles.heroText}>
          This offline demo includes a ready-to-play puzzle and local collaboration sessions.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <Button
          title="Create New Puzzle"
          onPress={() => navigation.navigate('Collaboration')}
          style={styles.button}
        />
        <Button
          title="View Profile"
          onPress={() => navigation.navigate('Profile')}
          variant="secondary"
          style={styles.button}
        />
        <Button
          title="Join a Session"
          onPress={() => navigation.navigate('Collaboration')}
          variant="secondary"
          style={styles.button}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Puzzles</Text>
        <Text style={styles.emptyText}>Create a session to start the demo puzzle.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Sessions</Text>
        <Text style={styles.emptyText}>No active sessions</Text>
      </View>
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
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0057b8',
  },
  heroText: {
    color: '#555',
    lineHeight: 21,
  },
  button: {
    marginBottom: 12,
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
});
