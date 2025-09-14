export const theme = {
  colors: {
    primary: '#1a1a2e',  // Add direct primary color access
    secondary: '#16213e', // Add direct secondary color access
    background: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      gradient: {
        start: '#1a1a2e',
        end: '#16213e'
      }
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      accent: '#FFD700',
      dark: '#000000',
      light: '#FFFFFF'
    },
    input: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.2)',
      text: '#FFFFFF',
      placeholder: '#999999'
    },
    card: {
      background: 'rgba(27, 27, 58, 0.7)',
      border: 'rgba(255, 255, 255, 0.1)'
    },
    button: {  // Add button colors
      primary: '#FFD700',
      secondary: '#16213e',
      text: '#FFFFFF'
    },
    accent: '#FFD700',
    secondary: 'rgba(255, 215, 0, 0.15)'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12
  },
  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 2
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4
    },
    heavy: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 6,
      elevation: 8
    },
    gold: {
      shadowColor: '#FFD700',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    }
  }
};

// Add a default export
export default theme;