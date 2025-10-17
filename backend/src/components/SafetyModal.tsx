
import React from 'react';
import { View, Text } from 'react-native';

interface SafetyModalProps {
  visible: boolean;
  onClose: () => void;
}

const SafetyModal: React.FC<SafetyModalProps> = ({ visible, onClose }) => {
  if (!visible) {
    return null;
  }

  return (
    <View>
      <Text>Safety Modal</Text>
      <Text onPress={onClose}>Close</Text>
    </View>
  );
};

export default SafetyModal;
