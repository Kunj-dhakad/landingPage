"use client";
import { useEffect } from "react";
import { track, type EventName } from "@/lib/events";
export function TrackView({ name, slug }: { name: EventName; slug: string }) {
  useEffect(() => {
    track(name, slug);
  }, [name, slug]);
  return null;
}
