'use client';
import { motion, useReducedMotion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { site } from '@/config/site';
export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={{ opacity: reduce ? 1 : [.75, 1], y: reduce ? 0 : [22, 0] }} viewport={{ once: true, amount: .15 }} transition={{ duration: .65, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
export function StickyOffer() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => { const hero = document.getElementById('top'); const footer = document.querySelector('footer'); setVisible(!!hero && hero.getBoundingClientRect().bottom < 90 && (!footer || footer.getBoundingClientRect().top > window.innerHeight)); };
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return <aside className={`sticky-offer ${visible ? 'is-visible' : ''}`} aria-label="Explore the Comic Videos AI offer" inert={!visible}><div><strong>Your next story starts here.</strong><span>Explore Comic Videos AI</span></div><PurchaseLink>View offer</PurchaseLink></aside>;
}
export function PurchaseLink({ children = 'Create Comic Videos Now', className = '' }: { children?: React.ReactNode; className?: string }) { return <a className={`button primary ${className}`} href={site.affiliateUrl} target="_blank" rel="sponsored noopener noreferrer"><Sparkles size={17} />{children}</a>; }
export function Brand() { return <a className="brand" href="/#top" aria-label="Comic Videos AI home"><span className="brand-icon"><Sparkles size={22}/></span><span>comic<span className="brand-light">videos</span><span className="ai-tag">AI</span></span></a>; }
