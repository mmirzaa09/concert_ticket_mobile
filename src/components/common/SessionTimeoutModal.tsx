import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import {COLORS} from '../../constants';
import {responsiveFontSize, spacing} from '../../utils';

interface SessionTimeoutModalProps {
  visible: boolean;
  onConfirm: () => void;
  remainingTime?: number;
}

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  visible,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>⚠️ Session Expired</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmButtonText}>Go to Login Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.error,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: COLORS.error,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  actions: {
    padding: spacing.lg,
    paddingTop: 10,
  },
  confirmButton: {
    backgroundColor: COLORS.gold,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: COLORS.background,
  },
});
