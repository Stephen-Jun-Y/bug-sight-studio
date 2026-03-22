import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bugsight.app',
  appName: 'BugSight',
  webDir: 'dist',
  server: {
    cleartext: true,
  },
};

export default config;
