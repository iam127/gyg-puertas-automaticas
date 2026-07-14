import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthStackParamList } from '../../types/navigation.types';
import COLORS from '../../constants/colors';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import AuthService from '../../api/auth';
import TecnicoService from '../../api/tecnico';
import { useAuthStore } from '../../store/authStore';

interface InvitationCodeScreenProps {
  navigation: StackNavigationProp<AuthStackParamList, 'InvitationCode'>;
}

type Mode = 'code' | 'login';

export const InvitationCodeScreen: React.FC<InvitationCodeScreenProps> = ({ navigation }) => {
  const [mode, setMode] = useState<Mode>('code');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { setTokens, setTecnico, enableDemoMode } = useAuthStore();

  const handleDemoAccess = async () => {
    try {
      await enableDemoMode();
    } catch {
      Alert.alert('Error', 'No se pudo activar el modo de demostración.');
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) { setCodeError('Por favor, ingrese el código de invitación.'); return; }
    setCodeError('');
    setIsVerifying(true);
    try {
      const result = await AuthService.verifyInvitationCode(code.trim());
      setIsVerifying(false);
      if (result.valido) {
        navigation.navigate('Register', { codigo: code.trim() });
      } else {
        if (result.registrado) {
          Alert.alert('Código ya utilizado', 'Este código fue usado previamente. Si ya tiene cuenta, inicie sesión.',
            [{ text: 'Iniciar sesión', onPress: () => setMode('login') }]);
        } else {
          setCodeError(result.mensaje);
        }
      }
    } catch {
      setIsVerifying(false);
      Alert.alert('Error de conexión', 'Verifique su red e intente nuevamente.');
    }
  };

  const handleLogin = async () => {
    let hasError = false;
    if (!username.trim()) { setUsernameError('Ingrese su usuario.'); hasError = true; } else setUsernameError('');
    if (!password.trim()) { setPasswordError('Ingrese su contraseña.'); hasError = true; } else setPasswordError('');
    if (hasError) return;
    setIsLoggingIn(true);
    try {
      const tokens = await AuthService.login({ username: username.trim(), password: password.trim() });
      const { user_id } = decodeJwtPayload(tokens.access);
      if (!user_id) throw new Error('ID de usuario no encontrado en el token.');
      await setTokens(tokens.access, tokens.refresh);
      const profile = await TecnicoService.getMyProfile(user_id);
      await setTecnico(profile);
      setIsLoggingIn(false);
    } catch (error: any) {
      setIsLoggingIn(false);
      if (error.response?.status === 401) {
        Alert.alert('Credenciales incorrectas', 'Verifique su usuario y contraseña.');
      } else {
        Alert.alert('Error', error.message || 'No se pudo iniciar sesión.');
      }
    }
  };

  // Decodifica el payload de un JWT sin dependencias externas.
  // Usa la técnica de escape/unescape que maneja UTF-8 correctamente en RN.
  const decodeJwtPayload = (token: string): any => {
    const part = token.split('.')[1];
    if (!part) throw new Error('Token JWT inválido.');
    // base64url → base64 estándar con padding correcto
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '=='.slice(0, (4 - (base64.length % 4)) % 4);
    // Decodificar: convertir cada byte a %XX y luego decodeURIComponent para UTF-8
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let binary = '';
    let i = 0;
    while (i < padded.length) {
      const c1 = chars.indexOf(padded[i++]);
      const c2 = chars.indexOf(padded[i++]);
      const c3 = chars.indexOf(padded[i++]);
      const c4 = chars.indexOf(padded[i++]);
      const b1 = (c1 << 2) | (c2 >> 4);
      const b2 = ((c2 & 15) << 4) | (c3 >> 2);
      const b3 = ((c3 & 3) << 6) | c4;
      binary += String.fromCharCode(b1);
      if (c3 !== 64) binary += String.fromCharCode(b2);
      if (c4 !== 64) binary += String.fromCharCode(b3);
    }
    // Convertir string de bytes a URI-encoded para manejar UTF-8
    const encoded = binary
      .split('')
      .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
    return JSON.parse(decodeURIComponent(encoded));
  };

  const isCodeMode = mode === 'code';

  return (
    <View style={styles.root}>
      <RNStatusBar barStyle="dark-content" backgroundColor={COLORS.BG_BASE} />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            {/* ── Logo ──────────────────────────────────────────────────── */}
            <View style={styles.logoSection}>
              <View style={styles.logoCard}>
                <Image
                  source={require('../../../assets/Logo-gyg.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.tagRow}>
                <View style={styles.tagLine} />
                <Text style={styles.tagText}>TÉCNICOS DE CAMPO</Text>
                <View style={styles.tagLine} />
              </View>
            </View>

            {/* ── Tabs ──────────────────────────────────────────────────── */}
            <View style={styles.tabRow}>
              <View style={[styles.tab, isCodeMode && styles.tabActive]}>
                <Text style={[styles.tabLabel, isCodeMode && styles.tabLabelActive]}>Código</Text>
              </View>
              <View style={[styles.tab, !isCodeMode && styles.tabActive]}>
                <Text style={[styles.tabLabel, !isCodeMode && styles.tabLabelActive]}>Iniciar sesión</Text>
              </View>
            </View>

            {/* ── Formulario ────────────────────────────────────────────── */}
            <View style={styles.formCard}>
              {isCodeMode ? (
                <>
                  <View style={styles.formHeader}>
                    <View style={styles.formIconBadge}>
                      <MaterialIcons name="vpn-key" size={20} color={COLORS.PRIMARY_GOLD_DARK} />
                    </View>
                    <View style={styles.formHeaderText}>
                      <Text style={styles.formTitle}>Código de invitación</Text>
                      <Text style={styles.formDesc}>Ingrese el código único generado por administración.</Text>
                    </View>
                  </View>
                  <Input label="Código de acceso" placeholder="Ingrese su código"
                    value={code} onChangeText={(t) => { setCode(t); if (t) setCodeError(''); }}
                    error={codeError} autoCapitalize="characters" autoCorrect={false} />
                  <Button title="Verificar código" onPress={handleVerifyCode} loading={isVerifying} style={styles.primaryAction} />
                  <Button title="Ya tengo cuenta registrada" onPress={() => setMode('login')} variant="ghost" style={styles.secondaryAction} />
                </>
              ) : (
                <>
                  <View style={styles.formHeader}>
                    <View style={styles.formIconBadge}>
                      <MaterialIcons name="person" size={20} color={COLORS.PRIMARY_GOLD_DARK} />
                    </View>
                    <View style={styles.formHeaderText}>
                      <Text style={styles.formTitle}>Iniciar sesión</Text>
                      <Text style={styles.formDesc}>Use sus credenciales asignadas durante el registro.</Text>
                    </View>
                  </View>
                  <Input label="Nombre de usuario" placeholder="Su nombre de usuario"
                    value={username} onChangeText={(t) => { setUsername(t); if (t) setUsernameError(''); }}
                    error={usernameError} autoCapitalize="none" autoCorrect={false} />
                  <Input label="Contraseña" placeholder="Su contraseña"
                    value={password} onChangeText={(t) => { setPassword(t); if (t) setPasswordError(''); }}
                    error={passwordError} secureTextEntry />
                  <Button title="Ingresar" onPress={handleLogin} loading={isLoggingIn} style={styles.primaryAction} />
                  <Button title="Tengo un código de invitación" onPress={() => setMode('code')} variant="ghost" style={styles.secondaryAction} />
                </>
              )}

              {/* ── Divisor demo ─────────────────────────────────────────── */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o también</Text>
                <View style={styles.dividerLine} />
              </View>
              <Button title="Entrar como invitado (Modo demo)" onPress={handleDemoAccess} variant="outline" />
            </View>

            <Text style={styles.footer}>GyG Puertas Automáticas © 2024</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.BG_BASE },
  safe: { flex: 1 },
  kav: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },

  // ── Logo ────────────────────────────────────────────────────────────────
  logoSection: { alignItems: 'center', marginBottom: 28 },
  logoCard: {
    backgroundColor: COLORS.BG_SURFACE,
    borderWidth: 1,
    borderColor: COLORS.BORDER_GOLD,
    borderRadius: 18,
    paddingHorizontal: 32,
    paddingVertical: 18,
    marginBottom: 18,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  logoImage: { width: 220, height: 58 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tagLine: { flex: 1, height: 1, backgroundColor: COLORS.BORDER_SUBTLE },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.TEXT_MUTED,
    letterSpacing: 3.5,
    fontFamily: 'System',
  },

  // ── Tabs ────────────────────────────────────────────────────────────────
  tabRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.BG_ELEVATED,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER_DARK,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' },
  tabActive: {
    backgroundColor: COLORS.BG_SURFACE,
    borderWidth: 1,
    borderColor: COLORS.BORDER_GOLD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabLabel: { fontSize: 13, fontWeight: '600', color: COLORS.TEXT_TERTIARY, fontFamily: 'System' },
  tabLabelActive: { color: COLORS.PRIMARY_GOLD_DARK },

  // ── Form Card ───────────────────────────────────────────────────────────
  formCard: {
    backgroundColor: COLORS.BG_SURFACE,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER_DARK,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  formHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 20 },
  formIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.PRIMARY_GOLD_MUTED,
    borderWidth: 1,
    borderColor: COLORS.BORDER_GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  formHeaderText: { flex: 1 },
  formTitle: { fontSize: 18, fontWeight: '700', color: COLORS.TEXT_PRIMARY, fontFamily: 'System', marginBottom: 4 },
  formDesc: { fontSize: 13, color: COLORS.TEXT_SECONDARY, lineHeight: 19, fontFamily: 'System' },

  primaryAction: { marginTop: 18 },
  secondaryAction: { marginTop: 10 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 18, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.BORDER_SUBTLE },
  dividerText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    fontFamily: 'System',
    textTransform: 'uppercase',
  },

  footer: { textAlign: 'center', color: COLORS.TEXT_MUTED, fontSize: 11, marginTop: 28, fontFamily: 'System' },
});

export default InvitationCodeScreen;