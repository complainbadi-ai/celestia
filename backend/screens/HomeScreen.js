"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomeScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const native_1 = require("@react-navigation/native");
const vector_icons_1 = require("@expo/vector-icons");
const HoroscopeCard_1 = __importDefault(require("../components/HoroscopeCard"));
const SafetyModal_1 = __importDefault(require("../components/SafetyModal"));
const api_1 = require("../services/api");
const react_i18next_1 = require("react-i18next");
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
function HomeScreen() {
    const { t } = (0, react_i18next_1.useTranslation)();
    const navigation = (0, native_1.useNavigation)();
    const [horoscope, setHoroscope] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [refreshing, setRefreshing] = (0, react_1.useState)(false);
    const [showSafetyModal, setShowSafetyModal] = (0, react_1.useState)(false);
    const [userSign, setUserSign] = (0, react_1.useState)('aries');
    (0, react_1.useEffect)(() => {
        loadUserSign();
        fetchTodayHoroscope();
    }, []);
    const loadUserSign = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const sign = yield async_storage_1.default.getItem('user_zodiac_sign');
            if (sign)
                setUserSign(sign);
        }
        catch (error) {
            console.error('Error loading user sign:', error);
        }
    });
    const fetchTodayHoroscope = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const response = yield api_1.api.get(`/horoscope/today?sign=${userSign}`);
            setHoroscope(response.data);
        }
        catch (error) {
            console.error('Error fetching horoscope:', error);
            // Show offline fallback or error state
        }
        finally {
            setLoading(false);
        }
    });
    const onRefresh = () => __awaiter(this, void 0, void 0, function* () {
        setRefreshing(true);
        yield fetchTodayHoroscope();
        setRefreshing(false);
    });
    const handleShare = () => __awaiter(this, void 0, void 0, function* () {
        if (!horoscope)
            return;
        try {
            yield react_native_1.Share.share({
                message: `${t('horoscope.sharePrefix')} ${userSign}: ${horoscope.content}`,
                title: t('horoscope.shareTitle'),
            });
        }
        catch (error) {
            console.error('Error sharing:', error);
        }
    });
    const handleJournal = () => {
        navigation.navigate('Journal', { horoscopeId: horoscope === null || horoscope === void 0 ? void 0 : horoscope.id });
    };
    const handleSave = () => __awaiter(this, void 0, void 0, function* () {
        if (!horoscope)
            return;
        try {
            const saved = yield async_storage_1.default.getItem('saved_horoscopes');
            const savedList = saved ? JSON.parse(saved) : [];
            savedList.push(horoscope);
            yield async_storage_1.default.setItem('saved_horoscopes', JSON.stringify(savedList));
            // Announce to screen readers
            react_native_1.AccessibilityInfo.announceForAccessibility(t('horoscope.saved'));
        }
        catch (error) {
            console.error('Error saving horoscope:', error);
        }
    });
    if (loading && !horoscope) {
        return (<react_native_1.View style={styles.loadingContainer}>
        <react_native_1.Text style={styles.loadingText}>{t('common.loading')}</react_native_1.Text>
      </react_native_1.View>);
    }
    return (<react_native_1.ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} refreshControl={<react_native_1.RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>} accessible={true} accessibilityLabel={t('horoscope.screenLabel')}>
      <react_native_1.View style={styles.header}>
        <react_native_1.Text style={styles.greeting} accessibilityRole="header">
          {t('horoscope.greeting')}
        </react_native_1.Text>
        <react_native_1.Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        })}
        </react_native_1.Text>
      </react_native_1.View>

      {horoscope && (<>
          <HoroscopeCard_1.default sign={userSign} content={horoscope.content} actionPrompt={horoscope.action_prompt} tags={horoscope.tags}/>

          <react_native_1.View style={styles.actionsContainer}>
            <react_native_1.TouchableOpacity style={styles.actionButton} onPress={handleJournal} accessible={true} accessibilityLabel={t('horoscope.actions.journal')} accessibilityHint={t('horoscope.actions.journalHint')}>
              <vector_icons_1.Feather name="edit-3" size={20} color="#6B4CE6"/>
              <react_native_1.Text style={styles.actionText}>{t('horoscope.actions.journal')}</react_native_1.Text>
            </react_native_1.TouchableOpacity>

            <react_native_1.TouchableOpacity style={styles.actionButton} onPress={handleShare} accessible={true} accessibilityLabel={t('horoscope.actions.share')} accessibilityHint={t('horoscope.actions.shareHint')}>
              <vector_icons_1.Feather name="share-2" size={20} color="#6B4CE6"/>
              <react_native_1.Text style={styles.actionText}>{t('horoscope.actions.share')}</react_native_1.Text>
            </react_native_1.TouchableOpacity>

            <react_native_1.TouchableOpacity style={styles.actionButton} onPress={handleSave} accessible={true} accessibilityLabel={t('horoscope.actions.save')} accessibilityHint={t('horoscope.actions.saveHint')}>
              <vector_icons_1.Feather name="bookmark" size={20} color="#6B4CE6"/>
              <react_native_1.Text style={styles.actionText}>{t('horoscope.actions.save')}</react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>

          <react_native_1.View style={styles.disclaimerContainer}>
            <vector_icons_1.Feather name="info" size={16} color="#757575"/>
            <react_native_1.Text style={styles.disclaimerText} accessibilityRole="text">
              {t('horoscope.disclaimer')}
            </react_native_1.Text>
          </react_native_1.View>

          <react_native_1.TouchableOpacity style={styles.safetyButton} onPress={() => setShowSafetyModal(true)} accessible={true} accessibilityLabel={t('safety.resourcesLabel')} accessibilityRole="button">
            <vector_icons_1.Feather name="heart" size={18} color="#E84855"/>
            <react_native_1.Text style={styles.safetyButtonText}>
              {t('safety.needSupport')}
            </react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </>)}

      <SafetyModal_1.default visible={showSafetyModal} onClose={() => setShowSafetyModal(false)}/>
    </react_native_1.ScrollView>);
}
const styles = react_native_1.StyleSheet.create({
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
