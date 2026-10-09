'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Play, Video, ExternalLink } from 'lucide-react';
import { site, type DemoVideo } from '@/config/site';
export function VideoPlayer({ src, poster, title, className = '', priority = false }: { src: string; poster: string; title: string; className?: string; priority?: boolean }) {
  const [active, setActive] = useState(false);
  const [error, setError] = useState(false);
  return <div className={`video-player ${className}`}>
    {error ? <div className="media-fallback"><Video/><p>This sample is temporarily unavailable.</p><a href={site.referenceUrl} target="_blank" rel="noopener noreferrer">View the official showcase <ExternalLink size={14}/></a></div> : active ? <video src={src} poster={poster} controls autoPlay playsInline preload="metadata" onError={() => setError(true)} aria-label={title}/> : <><Image src={poster} alt={title} fill sizes="(max-width: 768px) 100vw, 60vw" priority={priority} className="video-poster"/><div className="video-shade"/><button className="play-button" aria-label={`Play ${title}`} onClick={() => setActive(true)}><Play size={24} fill="currentColor"/></button><span className="video-label"><span className="live-dot"/> ACTUAL PRODUCT SAMPLE</span></>}
  </div>;
}
export function DemoShowcase() {
  const [tab, setTab] = useState<'App walkthrough' | 'Comic sample' | 'Family animation'>('App walkthrough');
  const [load, setLoad] = useState(false);
  return <><div className="demo-tabs" role="tablist" aria-label="Demonstrations">{(['App walkthrough','Comic sample','Family animation'] as const).map(t => <button key={t} id={`tab-${t.replaceAll(' ','-')}`} role="tab" aria-selected={tab === t} aria-controls="demo-panel" tabIndex={tab === t ? 0 : -1} onKeyDown={e => { if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const all = ['App walkthrough','Comic sample','Family animation'] as const; const next = all[(all.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : 2)) % 3]; setTab(next); document.getElementById(`tab-${next.replaceAll(' ','-')}`)?.focus(); } }} onClick={() => {setTab(t);setLoad(false);}}>{t}</button>)}</div><div className="demo-frame" id="demo-panel" role="tabpanel" aria-labelledby={`tab-${tab.replaceAll(' ','-')}`}>
    {tab === 'App walkthrough' ? load ? <iframe src={site.appDemoUrl} title="Official Comic Videos AI app walkthrough" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen/> : <div className="walkthrough-cover"><Image src={site.productImages.mockup} alt="Official Comic Videos AI promotional product mockup" fill sizes="(max-width: 768px) 100vw, 1000px"/><div className="walkthrough-content"><span className="eyebrow">INSIDE COMIC VIDEOS AI</span><h3>See the whole creative process.</h3><button className="button primary" onClick={() => setLoad(true)}><Play size={17}/> Play official walkthrough</button><small>Loads the official Vimeo player when you press play.</small></div></div> : <VideoPlayer key={tab} src={site.demoVideos[tab === 'Comic sample' ? 0 : 1].src} poster={site.demoVideos[tab === 'Comic sample' ? 0 : 1].poster} title={tab}/>}
  </div><p className="caption">Real product demonstrations. Explore the workflow before you choose.</p></>;
}
export function Gallery() {
  const [filter, setFilter] = useState('All creations');
  const videos = site.demoVideos.filter(v => filter === 'All creations' || v.category === filter);
  return <><div className="filters" aria-label="Filter video samples">{['All creations','Comic stories','Family animation'].map(f => <button key={f} aria-pressed={filter === f} className={filter === f ? 'selected' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div><div className="gallery-grid">{videos.map((v: DemoVideo) => <article className={`gallery-card ${v.aspect}`} key={v.id}><VideoPlayer {...v}/><div className="gallery-copy"><span>{v.category}</span><h3>{v.title}</h3><p>{v.description}</p></div></article>)}</div></>;
}
