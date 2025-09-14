import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.gradient.end,
  },
  card: {
    backgroundColor: theme.colors.card.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.card.border,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.card.border,
    fontSize: 16,
    color: theme.colors.text.primary,
    ...theme.shadows.light,
  },
  button: {
    backgroundColor: theme.colors.button.primary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.medium,
  },
  buttonText: {
    color: theme.colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginVertical: theme.spacing.lg,
  },
});