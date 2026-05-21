import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Alert 
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import COLORS from '../../constants/colors';
import LAYOUT from '../../constants/layout';
import MantenimientoService from '../../api/mantenimientos';
import CotizacionService from '../../api/cotizaciones';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import Loader from '../../components/common/Loader';

export const ProfileScreen: React.FC = () => {
  const { tecnico, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  
  // Stats
  const [stats, setStats] = useState({
    totalCompleted: 0,
    monthCompleted: 0,
  });

  const fetchProfileStats = async () => {
    if (!tecnico) return;

    try {
      const [mantenimientos, cotizaciones] = await Promise.all([
        MantenimientoService.getMyMantenimientos(tecnico.id),
        CotizacionService.getMyCotizaciones(tecnico.id),
      ]);

      const completedMants = mantenimientos.filter((m) => m.estado === 'resuelto');
      const completedQuotes = cotizaciones.filter((c) => c.estado === 'completado');

      const allCompleted = [...completedMants, ...completedQuotes];
      const totalCount = allCompleted.length;

      // Filter month completed
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = String(today.getMonth() + 1).padStart(2, '0'); // YYYY-MM-DD
      const prefix = `${currentYear}-${currentMonth}`;

      const monthCount = allCompleted.filter((item) => {
        const visit = item.visitas && item.visitas.length > 0 ? item.visitas[0] : null;
        const dateStr = visit?.fecha || item.actualizado_en?.split('T')[0] || '';
        return dateStr.startsWith(prefix);
      }).length;

      setStats({
        totalCompleted: totalCount,
        monthCompleted: monthCount,
      });
    } catch (error) {
      // Siletly ignore stats loading failure, non-blocking
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileStats();
  }, [tecnico]);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Está seguro de que desea cerrar sesión en la aplicación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  if (loading) {
    return <Loader message="Cargando perfil..." />;
  }

  // Get Initials for Avatar
  const firstName = tecnico?.usuario.first_name || '';
  const lastName = tecnico?.usuario.last_name || '';
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'T';

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Mi Perfil" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Avatar Header section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.profileName}>{firstName} {lastName}</Text>
          <Text style={styles.profileUsername}>@{tecnico?.usuario.username}</Text>
          <View style={styles.activeBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>Técnico Homologado</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsRow}>
          <Card style={styles.statBox} hasBorder>
            <Text style={styles.statCount}>{stats.totalCompleted}</Text>
            <Text style={styles.statLabel}>Trabajos Históricos</Text>
          </Card>
          
          <Card style={styles.statBox} hasBorder>
            <Text style={styles.statCount}>{stats.monthCompleted}</Text>
            <Text style={styles.statLabel}>Trabajos este Mes</Text>
          </Card>
        </View>

        {/* Details Card */}
        <Card style={styles.card} hasBorder>
          <Text style={styles.cardTitle}>Datos de Cuenta</Text>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Correo de la empresa</Text>
            <Text style={styles.detailValue}>{tecnico?.usuario.email || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Número de Celular</Text>
            <Text style={styles.detailValue}>📱 {tecnico?.telefono}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Código de Invitación Autorizado</Text>
            <Text style={[styles.detailValue, styles.goldText]}>🔑 {tecnico?.codigo_invitacion}</Text>
          </View>

          <View style={[styles.detailItem, styles.lastDetailItem]}>
            <Text style={styles.detailLabel}>Fecha de Alta en GyG</Text>
            <Text style={styles.detailValue}>📅 {tecnico?.creado_en?.split('T')[0] || '2026-05-19'}</Text>
          </View>
        </Card>

        {/* Logout Button */}
        <Button
          title="Cerrar Sesión Técnica"
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutBtn}
        />
        
        <Text style={styles.appVersion}>GyG Puertas Automáticas v0.0.1 (Técnicos)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DARK,
  },
  scrollContent: {
    padding: LAYOUT.spacing.md,
    paddingBottom: LAYOUT.spacing.xl,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: LAYOUT.spacing.md,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: LAYOUT.borderRadius.round,
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY_GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: LAYOUT.spacing.sm,
    ...LAYOUT.shadows.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GOLD,
    fontFamily: 'System',
  },
  profileName: {
    fontSize: LAYOUT.typography.sizes.h1,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'System',
  },
  profileUsername: {
    fontSize: LAYOUT.typography.sizes.body,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
    fontFamily: 'System',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: COLORS.WARRANTY_GREEN,
    borderWidth: 1,
    paddingHorizontal: LAYOUT.spacing.sm,
    paddingVertical: 2,
    borderRadius: LAYOUT.borderRadius.round,
    marginTop: LAYOUT.spacing.sm,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: LAYOUT.borderRadius.round,
    backgroundColor: COLORS.WARRANTY_GREEN,
    marginRight: 6,
  },
  activeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.WARRANTY_GREEN,
    fontFamily: 'System',
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: LAYOUT.spacing.sm,
  },
  statBox: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    paddingVertical: LAYOUT.spacing.md,
  },
  statCount: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.PRIMARY_GOLD,
    fontFamily: 'System',
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'System',
  },
  card: {
    padding: LAYOUT.spacing.md,
    marginVertical: LAYOUT.spacing.sm,
  },
  cardTitle: {
    fontSize: LAYOUT.typography.sizes.h3,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GOLD,
    marginBottom: LAYOUT.spacing.md,
    fontFamily: 'System',
  },
  detailItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_DARK,
    paddingVertical: LAYOUT.spacing.sm,
  },
  lastDetailItem: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  detailLabel: {
    fontSize: LAYOUT.typography.sizes.small,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'System',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: LAYOUT.typography.sizes.bodyLarge,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
    marginTop: 2,
    fontFamily: 'System',
  },
  goldText: {
    color: COLORS.PRIMARY_GOLD,
  },
  logoutBtn: {
    marginTop: LAYOUT.spacing.lg,
  },
  appVersion: {
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: LAYOUT.spacing.xl,
    fontFamily: 'System',
  },
});

export default ProfileScreen;
