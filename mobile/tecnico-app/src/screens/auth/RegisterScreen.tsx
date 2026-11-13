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
  Image 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../types/navigation.types';
import COLORS from '../../constants/colors';
import LAYOUT from '../../constants/layout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import AuthService from '../../api/auth';
import TecnicoService from '../../api/tecnico';
import { useAuthStore } from '../../store/authStore';

interface RegisterScreenProps {
  navigation: StackNavigationProp<AuthStackParamList, 'Register'>;
  route: RouteProp<AuthStackParamList, 'Register'>;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation, route }) => {
  const { codigo } = route.params;

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Field Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRegistering, setIsRegistering] = useState(false);

  const { setTokens, setTecnico } = useAuthStore();

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    let isValid = true;

    if (!firstName.trim()) {
      tempErrors.firstName = 'El nombre es obligatorio.';
      isValid = false;
    }
    if (!lastName.trim()) {
      tempErrors.lastName = 'El apellido es obligatorio.';
      isValid = false;
    }
    if (!username.trim()) {
      tempErrors.username = 'El nombre de usuario es obligatorio.';
      isValid = false;
    } else if (username.trim().length < 4) {
      tempErrors.username = 'El usuario debe tener al menos 4 caracteres.';
      isValid = false;
    }
    
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      tempErrors.email = 'El correo electrónico es obligatorio.';
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      tempErrors.email = 'El correo ingresado no es válido.';
      isValid = false;
    }

    if (!telefono.trim()) {
      tempErrors.telefono = 'El teléfono es obligatorio.';
      isValid = false;
    } else if (telefono.trim().length < 9) {
      tempErrors.telefono = 'El teléfono debe tener al menos 9 dígitos.';
      isValid = false;
    }

    if (!password) {
      tempErrors.password = 'La contraseña es obligatoria.';
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
      isValid = false;
    }

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Las contraseñas no coinciden.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setIsRegistering(true);
    try {
      // 1. Submit Registration API call
      await AuthService.registerTechnician({
        username: username.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        codigo,
      });

      // 2. Automatically log in after registration
      const credentials = { username: username.trim(), password };
      const tokens = await AuthService.login(credentials);

      // 3. Parse JWT user_id payload
      const tokenParts = tokens.access.split('.');
      const base64Url = tokenParts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      const userId = decoded.user_id;

      // 4. Set credentials in store
      await setTokens(tokens.access, tokens.refresh);

      // 5. Fetch and bind profile
      const profile = await TecnicoService.getMyProfile(userId);
      await setTecnico(profile);

      setIsRegistering(false);
      Alert.alert('Registro Exitoso', 'Bienvenido al equipo técnico de GyG.');
    } catch (error: any) {
      setIsRegistering(false);
      const errorData = error.response?.data;
      if (errorData && typeof errorData === 'object') {
        const serverErrors: Record<string, string> = {};
        if (errorData.username) {
          serverErrors.username = errorData.username[0] || 'Este usuario ya existe.';
        }
        if (errorData.email) {
          serverErrors.email = errorData.email[0] || 'Este correo ya está registrado.';
        }
        if (errorData.telefono) {
          serverErrors.telefono = errorData.telefono[0] || 'Este teléfono ya está registrado.';
        }
        if (errorData.codigo_invitacion) {
          Alert.alert('Código Inválido', errorData.codigo_invitacion[0] || 'El código no es válido.');
        }
        setErrors(serverErrors);
      } else {
        Alert.alert('Error', error.message || 'No se pudo completar el registro.');
      }
    }
  };

  // Base64 decoding helper
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
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A1A1A', '#111111', '#0A0A0A']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Círculos decorativos */}
        <View style={styles.circleTop} />
        <View style={styles.circleBottom} />
        
        <SafeAreaView style={styles.safeArea}>
          <Header title="Registro de Técnico" onBack={() => navigation.goBack()} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
              {/* Logo */}
              <View style={styles.logoContainer}>
                <View style={styles.logoWrapper}>
                  <Image 
                    source={require('../../../assets/Logo-gyg.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Formulario */}
              <View style={styles.card}>
                <Text style={styles.instructions}>
                  Complete sus datos para asociar su cuenta con el código de invitación validado:{' '}
                  <Text style={styles.codeText}>{codigo}</Text>
                </Text>

                <Input
                  label="Nombre"
                  placeholder="Ingrese su nombre"
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    setErrors({ ...errors, firstName: '' });
                  }}
                  error={errors.firstName}
                />

                <Input
                  label="Apellidos"
                  placeholder="Ingrese sus apellidos"
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    setErrors({ ...errors, lastName: '' });
                  }}
                  error={errors.lastName}
                />

                <Input
                  label="Nombre de Usuario"
                  placeholder="Mínimo 4 caracteres"
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    setErrors({ ...errors, username: '' });
                  }}
                  error={errors.username}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <Input
                  label="Correo Electrónico"
                  placeholder="Ingrese su correo"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setErrors({ ...errors, email: '' });
                  }}
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <Input
                  label="Teléfono / Celular"
                  placeholder="Ingrese su teléfono"
                  value={telefono}
                  onChangeText={(text) => {
                    setTelefono(text);
                    setErrors({ ...errors, telefono: '' });
                  }}
                  error={errors.telefono}
                  keyboardType="phone-pad"
                />

                <Input
                  label="Contraseña"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrors({ ...errors, password: '' });
                  }}
                  error={errors.password}
                  secureTextEntry
                />

                <Input
                  label="Confirmar Contraseña"
                  placeholder="Repita su contraseña"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setErrors({ ...errors, confirmPassword: '' });
                  }}
                  error={errors.confirmPassword}
                  secureTextEntry
                />

                <Button
                  title="Registrar Cuenta"
                  onPress={handleRegister}
                  loading={isRegistering}
                  style={styles.btn}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DARK,
  },
  gradientBackground: {
    flex: 1,
    position: 'relative',
  },
  circleTop: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(250, 204, 21, 0.08)',
    opacity: 0.6,
  },
  circleBottom: {
    position: 'absolute',
    bottom: -120,
    left: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(59, 130, 246, 0.06)',
    opacity: 0.5,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: LAYOUT.spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: LAYOUT.spacing.xl,
    marginTop: LAYOUT.spacing.md,
  },
  logoWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: LAYOUT.spacing.xl,
    paddingVertical: LAYOUT.spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.15)',
    ...LAYOUT.shadows.md,
  },
  logoImage: {
    width: 200,
    height: 55,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: LAYOUT.spacing.xl,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.2)',
    ...LAYOUT.shadows.lg,
    marginBottom: LAYOUT.spacing.xxl,
  },
  instructions: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
    marginBottom: LAYOUT.spacing.lg,
    fontFamily: 'System',
    fontWeight: '400',
  },
  codeText: {
    color: COLORS.PRIMARY_GOLD,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  btn: {
    marginTop: LAYOUT.spacing.lg,
    ...LAYOUT.shadows.sm,
  },
});

export default RegisterScreen;