'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PAGE_QUERYResult } from '@/sanity/types';
import { PlayIcon } from 'lucide-react';

type VideoProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>['content']>[number],
  { _type: 'video' }
>;

const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

export function Video({ url, title, alt }: VideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  if (!url) return null;
  
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
  
  const handlePlay = () => {
    setIsPlaying(true);
  };
  
  return (
    <section className="container px-4 sm:px-6 md:px-8 xl:px-10 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        {title && (
          <h2 className="font-sans text-3xl lg:text-4xl xl:text-5xl leading-tight mb-8 text-center">
            {title}
          </h2>
        )}
        
        {/* Video Container */}
        <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg">
          {!isPlaying ? (
            <div className="absolute inset-0 cursor-pointer group" onClick={handlePlay}>
              {/* Thumbnail */}
              <Image
                src={thumbnailUrl}
                alt={alt || `Video thumbnail${title ? ` for ${title}` : ''}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center group-hover:bg-opacity-40 transition-all duration-300 pointer-events-none">
                <div className="bg-secondary-700 rounded-full p-4 group-hover:scale-110 transition-transform duration-300 pointer-events-auto">
                  <PlayIcon 
                    className="w-8 h-8 text-white ml-1" 
                    aria-label="Play video"
                  />
                </div>
              </div>
              
              {/* YouTube Logo */}
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm font-medium">
                YouTube
              </div>
            </div>
          ) : (
            <iframe
              src={embedUrl}
              title={title || 'YouTube video player'}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              aria-label={title ? `Playing video: ${title}` : 'Playing YouTube video'}
            />
          )}
        </div>
      </div>
    </section>
  );
}
