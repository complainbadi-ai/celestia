import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface SafetyModalProps {
  visible: boolean;
  onClose: () => void;
}

const SafetyModal: React.FC<SafetyModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();

  const resources = [
    {
      name: t('safety.resources.crisisTextLine'),
      description: t('safety.resources.crisisTextLineDescription'),
      phone: '741741',
      url: 'https://www.crisistextline.org/',
    },
    {
      name: t('safety.resources.suicideHotline'),
      description: t('safety.resources.suicideHotlineDescription'),
      phone: '988',
      url: 'https://988lifeline.org/',
    },
    {
      name: t('safety.resources.theTrevorProject'),
      description: t('safety.resources.theTrevorProjectDescription'),
      phone: '1-866-488-7386',
      url: 'https://www.thetrevorproject.org/',
    },
  ];

  const handleLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  const handleCall = (phone: string) => {
    const url = `${Platform.OS === 'ios' ? 'telprompt:' : 'tel:'}${phone}`;
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't make call", err)
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Feather name="shield" size={24} color="#4CAF50" />
            <Text style={styles.title}>{t('safety.title')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#757575" />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>{t('safety.description')}</Text>

          <ScrollView style={styles.resourcesContainer}>
            {resources.map((res, index) => (
              <View key={index} style={styles.resourceCard}>
                <Text style={styles.resourceName}>{res.name}</Text>
                <Text style={styles.resourceDescription}>{res.description}</Text>
                <View style={styles.contactContainer}>
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => handleCall(res.phone)}
                  >
                    <Feather name="phone" size={16} color="#FFFFFF" />
                    <Text style={styles.contactButtonText}>{res.phone}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => handleLink(res.url)}
                  >
                    <Feather name="globe" size={16} color="#FFFFFF" />
                    <Text style={styles.contactButtonText}>{t('common.website')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>{t('common.done')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 12,
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  description: {
    fontSize: 15,
    color: '#757575',
    lineHeight: 22,
    marginBottom: 20,
  },
  resourcesContainer: {
    maxHeight: '60%',
  },
  resourceCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  resourceName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
    marginBottom: 12,
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  doneButton: {
    backgroundColor: '#E8E8E8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '600',
  },
});

export default SafetyModal;
