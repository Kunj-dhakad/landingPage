'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Play, Video, ExternalLink } from 'lucide-react';
import { site, type DemoVideo } from '@/config/site';
export function VideoPlayer({ src, poster, title, className = '', priority = false, autoStart = false }: { src: string; poster: string; title: string; className?: string; priority?: boolean; autoStart?: boolean }) {
  const [active, setActive] = useState(autoStart);
  const [error, setError] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!active || !video.current) return;
    const current = video.current;
    document.querySelectorAll('video').forEach(other => { if (other !== current) other.pause(); });
    current.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
  }, [active]);
  return <div className={`video-player ${className}`}>
    {error ? <div className="media-fallback" role="status"><Video/><p>This sample could not load.</p><button className="button secondary" onClick={() => { setError(false); setActive(true); }}>Retry video</button><a href={src} target="_blank" rel="noopener noreferrer">Open video directly <ExternalLink size={14}/></a></div> : active ? <video ref={video} src={src} poster={poster} controls autoPlay playsInline preload="metadata" onPlay={e => document.querySelectorAll('video').forEach(other => { if (other !== e.currentTarget) other.pause(); })} onError={() => setError(true)} aria-label={title}/> : <button className="video-trigger" aria-label={`Play ${title}`} onClick={() => setActive(true)}><Image src={poster} alt="" fill sizes="(max-width: 768px) 100vw, 60vw" priority={priority} className="video-poster"/><span className="video-shade"/><span className="play-button"><Play size={24} fill="currentColor"/></span><span className="video-label"><span className="live-dot"/> ACTUAL PRODUCT SAMPLE</span></button>}
  </div>;
}
export function DemoShowcase() {
  const [tab, setTab] = useState<'App walkthrough' | 'Comic sample' | 'Family animation'>('Comic sample');
  const [load, setLoad] = useState(false);
  return <><div className="demo-tabs" role="tablist" aria-label="Demonstrations">{(['App walkthrough','Comic sample','Family animation'] as const).map(t => <button key={t} id={`tab-${t.replaceAll(' ','-')}`} role="tab" aria-selected={tab === t} aria-controls="demo-panel" tabIndex={tab === t ? 0 : -1} onKeyDown={e => { if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const all = ['App walkthrough','Comic sample','Family animation'] as const; const next = all[(all.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : 2)) % 3]; setTab(next); document.getElementById(`tab-${next.replaceAll(' ','-')}`)?.focus(); } }} onClick={() => {setTab(t);setLoad(false);}}>{t}</button>)}</div><div className="demo-frame" id="demo-panel" role="tabpanel" aria-labelledby={`tab-${tab.replaceAll(' ','-')}`}>
    {tab === 'App walkthrough' ? load ? <iframe src={`${site.appDemoUrl}&autoplay=1`} title="Official Comic Videos AI app walkthrough" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen/> : <div className="walkthrough-cover"><Image src={site.productImages.mockup} alt="Official Comic Videos AI promotional product mockup" fill sizes="(max-width: 768px) 100vw, 1000px"/><div className="walkthrough-content"><span className="eyebrow">INSIDE COMIC VIDEOS AI</span><h3>See the whole creative process.</h3><button className="button primary" onClick={() => setLoad(true)}><Play size={17}/> Play official walkthrough</button><small>Loads the official Vimeo player when you press play.</small></div></div> : <VideoPlayer key={tab} src={site.demoVideos[tab === 'Comic sample' ? 0 : 1].src} poster={site.demoVideos[tab === 'Comic sample' ? 0 : 1].poster} title={tab}/>}
  </div><p className="caption">Real product demonstrations. Explore the workflow before you choose.</p>{tab === 'App walkthrough' && <p className="caption">Vimeo may ask you to verify access. <a href={site.appDemoUrl} target="_blank" rel="noopener noreferrer">Open the official walkthrough in a new tab ↗</a> or select a sample above.</p>}</>;
}
export function Gallery() {
  const [filter, setFilter] = useState('All creations');
  const videos = site.demoVideos.filter(v => filter === 'All creations' || v.category === filter);
  return <><div className="filters" aria-label="Filter video samples">{['All creations','Comic stories','Family animation'].map(f => <button key={f} aria-pressed={filter === f} className={filter === f ? 'selected' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div><div className="gallery-grid">{videos.map((v: DemoVideo) => <article className={`gallery-card ${v.aspect}`} key={v.id}><VideoPlayer {...v}/><div className="gallery-copy"><span>{v.category}</span><h3>{v.title}</h3><p>{v.description}</p></div></article>)}</div></>;
}

export function WatchDemoButton({ compact = false }: { compact?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  return <><button className={compact ? 'demo-link' : 'button secondary'} onClick={() => { setOpen(true); dialog.current?.showModal(); }}>{!compact && <Play size={17}/>} {compact ? 'Watch demo' : 'Watch Demo'}</button><dialog ref={dialog} className="demo-dialog" aria-labelledby="demo-dialog-title" onClose={() => setOpen(false)} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}><div className="demo-dialog-content"><div className="demo-dialog-heading"><h2 id="demo-dialog-title">Comic Videos AI sample</h2><button className="button secondary" aria-label="Close demo" onClick={() => dialog.current?.close()}>Close ✕</button></div>{open && <VideoPlayer {...site.heroVideo} title="Comic Videos AI demo" autoStart/>}<p>Actual product output. Use the player controls for sound, seeking, and fullscreen.</p><a className="support-link" href="#demo" onClick={() => dialog.current?.close()}>Explore more samples &amp; the app walkthrough</a></div></dialog></>;
}

