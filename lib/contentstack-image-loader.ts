import { ImageLoaderProps } from "next/image";

export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src);
  
  url.searchParams.set('width', width.toString());
  url.searchParams.set('dpr', '1'); 
  url.searchParams.set('quality', (quality || 75).toString());
  url.searchParams.set('format', 'webp');
  
  return url.href;
}