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
    { id: 'baby-07', title: 'A little mischief', category: 'Family animation', src: '/videos/baby-07.mp4', poster: '/images/baby-07.webp', aspect: 'vertical', description: 'A playful moment from the official family animation collection.' },
    { id: 'baby-12', title: 'Little moments, big smiles', category: 'Family animation', src: '/videos/baby-12.mp4', poster: '/images/baby-12.webp', aspect: 'vertical', description: 'A warm peekaboo story from the vendor’s family animation demos.' },
  ] as DemoVideo[],
  productImages: { logo: '/images/logo-h-negative.webp', mockup: '/images/mockup-duo-scene.webp', cover: '/images/cover-fe.webp', steps: ['/images/step-1.webp', '/images/step-2.webp', '/images/step-3.webp'] },
  offer: { name: 'Comic Videos AI offer', price: 'View pricing', note: 'The purchase link opens the vendor’s bundle offer. Review its current price, included plans, taxes, and terms before buying.' },
};



