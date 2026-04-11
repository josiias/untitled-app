import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { token, functionsVersion, appBaseUrl } = appParams;

export const base44 = createClient({
  appId: "69da3a9676ce79c82b591c3e",
  token,
  functionsVersion,
  requiresAuth: false,
  appBaseUrl
});
