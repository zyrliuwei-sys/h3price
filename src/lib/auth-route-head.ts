import { tDynamic } from '@/core/i18n/dynamic';
import { envConfigs } from '@/config';

export function authRouteHead(page: string) {
  return {
    meta: [
      { title: `${tDynamic(`auth.meta.${page}`)} | ${envConfigs.app_name}` },
      { name: 'description', content: tDynamic('auth.meta.description') },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  };
}
