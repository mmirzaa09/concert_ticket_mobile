import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
// import QRCode from 'react-native-qr-svg';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types';
import {COLORS} from '../../constants';
import {responsiveFontSize, spacing} from '../../utils';

type QrCodeScreenRouteProp = RouteProp<RootStackParamList, 'QrCode'>;

const QrCodeScreen: React.FC = () => {
  const route = useRoute<QrCodeScreenRouteProp>();
  const {orderId} = route.params;
  const {qrState, setQrState} = useState<string>(
    'http://facebook.github.io/react-native/',
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Ticket QR Code</Text>
        <Text style={styles.subtitle}>
          Present this code at the event entrance
        </Text>
        <View style={styles.qrContainer}>
          {/* {orderId ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <QRCode
                value="https://yourwebsite.com/your-data"
                size={200}
                color="black"
                backgroundColor="white"
              />
            </View>
          ) : (
            <Text style={styles.errorText}>
              No Order ID found to generate QR Code.
            </Text>
          )} */}
        </View>
        <Text style={styles.orderIdText}>Order ID: {orderId}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: responsiveFontSize(24),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: responsiveFontSize(16),
    color: COLORS.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  qrContainer: {
    padding: spacing.md,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: spacing.xl,
  },
  orderIdText: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textMuted,
    marginTop: spacing.md,
  },
  errorText: {
    fontSize: responsiveFontSize(16),
    color: COLORS.error,
    textAlign: 'center',
  },
});

export default QrCodeScreen;
