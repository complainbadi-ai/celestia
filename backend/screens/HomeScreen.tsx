import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Share,
  AccessibilityInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import HoroscopeCard from '@components/HoroscopeCard';
import SafetyModal from '@components/SafetyModal';
import { api } from '@services/api';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Horoscope {
  id: string;
  zodiac_sign: string;
  date: string;
  content: string;
  tags: string[];
  action_prompt: string;
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [horoscope, setHoroscope] = useState<Horoscope | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [userSign, setUserSign] = useState<string>('aries');

  useEffect(() => {
    loadUserSign();
    fetchTodayHoroscope();
  }, []);

  const loadUserSign = async () => {
    try {
      const sign = await AsyncStorage.getItem('user_zodiac_sign');
      if (sign) setUserSign(sign);
    } catch (error) {
      console.error('Error loading user sign:', error);
    }
  };

  const fetchTodayHoroscope = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/horoscope/today?sign=${userSign}`);
      setHoroscope(response.data);
    } catch (error) {
      console.error('Error fetching horoscope:', error);
      // Show offline fallback or error state
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTodayHoroscope();
    setRefreshing(false);
  };

  const handleShare = async () => {
    if (!horoscope) return;
    
    try {
      await Share.share({
        message: `${t('horoscope.sharePrefix')} ${userSign}: ${horoscope.content}`,
        title: t('horoscope.shareTitle'),
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleJournal = () => {
    // navigation.navigate('Journal', { horoscopeId: horoscope?.id });
  };

  const handleSave = async () => {
    if (!horoscope) return;
    
    try {
      const saved = await AsyncStorage.getItem('saved_horoscopes');
      const savedList = saved ? JSON.parse(saved) : [];
      savedList.push(horoscope);
      await AsyncStorage.setItem('saved_horoscopes', JSON.stringify(savedList));
      
      // Announce to screen readers
      AccessibilityInfo.announceForAccessibility(t('horoscope.saved'));
    } catch (error) {
      console.error('Error saving horoscope:', error);
    }
  };

  if (loading && !horoscope) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      accessible={true}
      accessibilityLabel={t('horoscope.screenLabel')}
    >
      <View style={styles.header}>
        <Text style={styles.greeting} accessibilityRole="header">
          {t('horoscope.greeting')}
        </Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {horoscope && (
        <>
          <HoroscopeCard
            sign={userSign}
            content={horoscope.content}
            actionPrompt={horoscope.action_prompt}
            tags={horoscope.tags}
          />

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleJournal}
              accessible={true}
              accessibilityLabel={t('horoscope.actions.journal')}
              accessibilityHint={t('horoscope.actions.journalHint')}
            >
              <Feather name="edit-3" size={20} color="#6B4CE6" />
              <Text style={styles.actionText}>{t('horoscope.actions.journal')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
              accessible={true}
              accessibilityLabel={t('horoscope.actions.share')}
              accessibilityHint={t('horoscope.actions.shareHint')}
            >
              <Feather name="share-2" size={20} color="#6B4CE6" />
              <Text style={styles.actionText}>{t('horoscope.actions.share')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSave}
              accessible={true}
              accessibilityLabel={t('horoscope.actions.save')}
              accessibilityHint={t('horoscope.actions.saveHint')}
            >
              <Feather name="bookmark" size={20} color="#6B4CE6" />
              <Text style={styles.actionText}>{t('horoscope.actions.save')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.disclaimerContainer}>
            <Feather name="info" size={16} color="#757575" />
            <Text style={styles.disclaimerText} accessibilityRole="text">
              {t('horoscope.disclaimer')}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.safetyButton}
            onPress={() => setShowSafetyModal(true)}
            accessible={true}
            accessibilityLabel={t('safety.resourcesLabel')}
            accessibilityRole="button"
          >
            <Feather name="heart" size={18} color="#E84855" />
            <Text style={styles.safetyButtonText}>
              {t('safety.needSupport')}
            </Text>
          </TouchableOpacity>
        </>
      )}

      <SafetyModal
        visible={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    fontSize: 16,
    color: '#757575',
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#757575',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
    minWidth: 80,
  },
  actionText: {
    fontSize: 14,
    color: '#6B4CE6',
    marginTop: 6,
    fontWeight: '500',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    color: '#757575',
    marginLeft: 10,
    lineHeight: 18,
  },
  safetyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE5E8',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  safetyButtonText: {
    fontSize: 15,
    color: '#E84855',
    marginLeft: 8,
    fontWeight: '600',
  },
});