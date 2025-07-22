import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width } = Dimensions.get('window');

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    color: colors.foreground,
  },
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
    color: colors.foreground,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 29,
    color: colors.foreground,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
    color: colors.foreground,
  },
  h4: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    color: colors.foreground,
  },
  p: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.foreground,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: colors.foreground,
  },
  button: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    color: colors.primaryForeground,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    backgroundColor: colors.inputBackground,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    color: colors.foreground,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  glassStrong: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
  },
  // Responsive styles
  responsiveContainer: {
    maxWidth: width > 768 ? 400 : '100%',
    alignSelf: 'center',
  },
});
