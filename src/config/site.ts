export type DemoVideo = { id: string; title: string; category: 'Comic stories' | 'Family animation'; src: string; poster: string; aspect: 'vertical' | 'horizontal'; description: string };
export const site = {
  productName: 'Comic Videos AI',
  affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_URL || 'https://jvz1.com/c/3615703/454633/',
  referenceUrl: 'https://comicvideosai.com/jv',
  salesUrl: 'https://sales.comicvideosai.com/fe/',
  heroVideo: { src: '/videos/comic-02.mp4', poster: '/images/comic-02.webp' },
  appDemoUrl: 'https://player.vimeo.com/video/1232486302?title=0&byline=0&portrait=0',
  demoVideos: [
    { id: 'comic-01', title: 'A story, brought to life', category: 'Comic stories', src: '/videos/comic-02.mp4', poster: '/images/comic-02.webp', aspect: 'horizontal', description: 'An original comic-style sample from the official affiliate showcase.' },
    { id: 'baby-06', title: 'The bath-time rebellion', category: 'Family animation', src: '/videos/baby-06.mp4', poster: '/images/baby-06.webp', aspect: 'vertical', description: 'A playful family animation with expressive characters and dialogue.' },
    { id: 'baby-07', title: 'A little mischief', category: 'Family animation', src: 'https://d1f5xajkt26gbd.cloudfront.net/comicvideosai/baby/baby-under-1-playing-with-mommys-hair-funny.mp4', poster: '/images/baby-07.webp', aspect: 'vertical', description: 'A playful moment from the official family animation collection.' },
    { id: 'baby-12', title: 'Little moments, big smiles', category: 'Family animation', src: 'https://d1f5xajkt26gbd.cloudfront.net/comicvideosai/baby/a-baby-and-mother-sharing-a-tender-peekaboo-moment-full-of-giggles.mp4', poster: '/images/baby-12.webp', aspect: 'vertical', description: 'A warm peekaboo story from the vendor’s family animation demos.' },
  ] as DemoVideo[],
  productImages: { logo: '/images/logo-h-negative.webp', mockup: '/images/mockup-duo-scene.webp', cover: '/images/cover-fe.webp', steps: ['/images/step-1.webp', '/images/step-2.webp', '/images/step-3.webp'] },
  offer: { name: 'Comic Videos AI Premium', price: '$36.95', verifiedOn: 'October 9, 2026', note: 'Listed on the official sales page. Current price, taxes, limits, and optional upgrades are confirmed at checkout.' },
};

