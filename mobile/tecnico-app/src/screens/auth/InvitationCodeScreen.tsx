import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Alert 
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/navigation.types';
import COLORS from '../../constants/colors';
import LAYOUT from '../../constants/layout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import AuthService from '../../api/auth';
import TecnicoService from '../../api/tecnico';
import { useAuthStore } from '../../store/authStore';

interface InvitationCodeScreenProps {
  navigation: StackNavigationProp<AuthStackParamList, 'InvitationCode'>;
}

export const InvitationCodeScreen: React.FC<InvitationCodeScreenProps> = ({ navigation }) => {
  const [mode, setMode] = useState<'code' | 'login'>('code');
  
  // Code verification state
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Direct login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { setTokens, setTecnico, enableDemoMode } = useAuthStore();

  const handleDemoAccess = async () => {
    try {
      await enableDemoMode();
    } catch (error) {
      Alert.alert('Error', 'No se pudo activar el modo de demostración.');
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setCodeError('Por favor, ingrese el código de invitación.');
      return;
    }
    setCodeError('');
    setIsVerifying(true);

    try {
      const result = await AuthService.verifyInvitationCode(code.trim());
      setIsVerifying(false);

      if (result.valido) {
        // Navigate to registration, passing the verified invitation code
        navigation.navigate('Register', { codigo: code.trim() });
      } else {
        // If it's already used or registered
        if (result.registrado) {
          Alert.alert(
            'Código Utilizado',
            'Este código ya ha sido utilizado para registrar un técnico. Si ya tiene cuenta, por favor inicie sesión.',
            [{ text: 'Iniciar Sesión', onPress: () => setMode('login') }]
          );
        } else {
          setCodeError(result.mensaje);
        }
      }
    } catch (error) {
      setIsVerifying(false);
      Alert.alert('Error', 'Hubo un error de conexión al verificar el código.');
    }
  };

  const handleLogin = async () => {
    let hasError = false;
    if (!username.trim()) {
      setUsernameError('Por favor, ingrese su usuario.');
      hasError = true;
    } else {
      setUsernameError('');
    }

    if (!password.trim()) {
      setPasswordError('Por favor, ingrese su contraseña.');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) return;

    setIsLoggingIn(true);
    try {
      // 1. Get simplejwt tokens
      const credentials = { username: username.trim(), password: password.trim() };
      const tokens = await AuthService.login(credentials);

      // 2. Decode user ID from access token
      // Simple base64 decoding of the JWT payload to avoid heavy dependency issues
      const tokenParts = tokens.access.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Formato de token no válido.');
      }
      
      const base64Url = tokenParts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      // Polyfill base64 decode for react native
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      const userId = decoded.user_id;

      if (!userId) {
        throw new Error('ID de usuario no encontrado en el token.');
      }

      // 3. Set tokens first to authorize subsequent request
      await setTokens(tokens.access, tokens.refresh);

      // 4. Fetch the associated technician profile
      const profile = await TecnicoService.getMyProfile(userId);
      await setTecnico(profile);

      setIsLoggingIn(false);
    } catch (error: any) {
      setIsLoggingIn(false);
      const status = error.response?.status;
      if (status === 401) {
        Alert.alert('Acceso Fallido', 'Credenciales incorrectas. Verifique e intente de nuevo.');
      } else {
        Alert.alert('Error', error.message || 'No se pudo iniciar sesión. Verifique su red.');
      }
    }
  };

  // Polyfill atob if not present (safeguard for React Native environments)
  const atob = (input: string): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let str = input.replace(/=+$/, '');
    let output = '';
    let bc = 0;
    let r1 = 0;
    let r2 = 0;
    let idx = 0;
    while (idx < str.length) {
      r2 = chars.indexOf(str.charAt(idx++));
      if (r2 === -1) continue;
      r1 = bc % 4 ? r1 * 64 + r2 : r2;
      if (bc++ % 4) {
        output += String.fromCharCode(255 & (r1 >> ((-2 * bc) & 6)));
      }
    }
    return output;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.logoContainer}>
            <Text style={styles.logoBadge}>🛠️</Text>
            <Text style={styles.logoText}>GyG</Text>
            <Text style={styles.logoSubtext}>PUERTAS AUTOMÁTICAS</Text>
            <View style={styles.divider} />
            <Text style={styles.appTitle}>TÉCNICOS DE CAMPO</Text>
          </View>

          {mode === 'code' ? (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Código de Invitación</Text>
              <Text style={styles.sectionDescription}>
                Ingrese el código único generado por administración para activar su cuenta.
              </Text>
              
              <Input
                label="Código de Acceso"
                placeholder="Ej. GYG-TEC-XXXX"
                value={code}
                onChangeText={(text) => {
                  setCode(text);
                  if (text) setCodeError('');
                }}
                error={codeError}
                autoCapitalize="characters"
                autoCorrect={false}
              />

              <Button
                title="Verificar Código"
                onPress={handleVerifyCode}
                loading={isVerifying}
                style={styles.actionBtn}
              />

              <Button
                title="Ya tengo una cuenta registrada"
                onPress={() => setMode('login')}
                variant="outline"
                style={styles.switchBtn}
              />

              <View style={styles.demoSeparatorContainer}>
                <View style={styles.demoLine} />
                <Text style={styles.demoSeparatorText}>O TAMBIÉN</Text>
                <View style={styles.demoLine} />
              </View>

              <Button
                title="Entrar como Invitado (Modo Demo) ✨"
                onPress={handleDemoAccess}
                variant="outline"
                style={styles.demoBtn}
              />
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Iniciar Sesión</Text>
              <Text style={styles.sectionDescription}>
                Ingrese su usuario y contraseña asignados durante el registro.
              </Text>

              <Input
                label="Nombre de Usuario"
                placeholder="Ingrese su usuario"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (text) setUsernameError('');
                }}
                error={usernameError}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Input
                label="Contraseña"
                placeholder="Ingrese su contraseña"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (text) setPasswordError('');
                }}
                error={passwordError}
                secureTextEntry
              />

              <Button
                title="Iniciar Sesión"
                onPress={handleLogin}
                loading={isLoggingIn}
                style={styles.actionBtn}
              />

              <Button
                title="Tengo un código de invitación"
                onPress={() => setMode('code')}
                variant="outline"
                style={styles.switchBtn}
              />

              <View style={styles.demoSeparatorContainer}>
                <View style={styles.demoLine} />
                <Text style={styles.demoSeparatorText}>O TAMBIÉN</Text>
                <View style={styles.demoLine} />
              </View>

              <Button
                title="Entrar como Invitado (Modo Demo) ✨"
                onPress={handleDemoAccess}
                variant="outline"
                style={styles.demoBtn}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DARK,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: LAYOUT.spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: LAYOUT.spacing.xxl,
  },
  logoBadge: {
    fontSize: 48,
    marginBottom: LAYOUT.spacing.sm,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.PRIMARY_GOLD,
    fontFamily: 'System',
    letterSpacing: 2,
  },
  logoSubtext: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'System',
    letterSpacing: 4,
    marginTop: -4,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: COLORS.PRIMARY_GOLD,
    marginVertical: LAYOUT.spacing.md,
  },
  appTitle: {
    fontSize: LAYOUT.typography.sizes.body,
    fontWeight: 'bold',
    color: COLORS.TEXT_SECONDARY,
    letterSpacing: 3,
    fontFamily: 'System',
  },
  formContainer: {
    backgroundColor: COLORS.CARD_DARK,
    padding: LAYOUT.spacing.lg,
    borderRadius: LAYOUT.borderRadius.xl,
    borderWidth: 1,
    borderColor: COLORS.BORDER_DARK,
    ...LAYOUT.shadows.md,
  },
  sectionTitle: {
    fontSize: LAYOUT.typography.sizes.h2,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GOLD,
    marginBottom: LAYOUT.spacing.xs,
    fontFamily: 'System',
  },
  sectionDescription: {
    fontSize: LAYOUT.typography.sizes.body,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: LAYOUT.typography.lineHeights.body,
    marginBottom: LAYOUT.spacing.md,
    fontFamily: 'System',
  },
  actionBtn: {
    marginTop: LAYOUT.spacing.md,
  },
  switchBtn: {
    marginTop: LAYOUT.spacing.md,
    borderColor: COLORS.BORDER_DARK,
  },
  demoSeparatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: LAYOUT.spacing.md,
  },
  demoLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BORDER_DARK,
  },
  demoSeparatorText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 10,
    fontWeight: 'bold',
    marginHorizontal: LAYOUT.spacing.sm,
    letterSpacing: 1,
  },
  demoBtn: {
    marginTop: 0,
    borderColor: COLORS.PRIMARY_GOLD,
    borderWidth: 1.5,
  },
});

export default InvitationCodeScreen;
