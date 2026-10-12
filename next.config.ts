import type { NextConfig } from 'next';
import { site } from './src/config/site';

const config: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [{ source: '/', destination: site.affiliateUrl, permanent: false }];
  },
};
export default config;
