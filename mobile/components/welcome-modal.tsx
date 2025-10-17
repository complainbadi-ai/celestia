
import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/celestial-theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface WelcomeModalProps {
  visible: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ visible, onClose }) => {
  const { colorScheme = 'light' } = useColorScheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <ThemedView style={styles.modalView}>
          <ThemedText style={styles.modalText}>Welcome to Celestia!</ThemedText>
          <ThemedText style={styles.modalSubText}>
            We're so glad to have you here. Celestia is your personal guide to the stars, offering daily horoscopes, personalized chat, and much more.
          </ThemedText>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalSubText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default WelcomeModal;
