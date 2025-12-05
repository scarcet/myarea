import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Image } from 'react-native';

type SupabaseImageProps = {
  bucket: string;
  path?: string | null;
  className?: string;
  transform?: {
    width?: number;
    height?: number;
  };
};

export default function SupabaseImage({
  bucket,
  path,
  className = '',
  transform,
}: SupabaseImageProps) {
  const [imageUri, setImageUri] = useState<string | undefined>();

  useEffect(() => {
    if (!path) {
      // Default avatar or placeholder
      setImageUri(
        Image.resolveAssetSource(require('@/assets/default-avatar.png')).uri
      );
      return;
    }

    // ✅ Get a public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    if (data?.publicUrl) {
      let url = data.publicUrl;

      // Optional: apply basic resize transform (Supabase CDN)
      if (transform?.width || transform?.height) {
        const params = new URLSearchParams();
        if (transform.width) params.append('width', transform.width.toString());
        if (transform.height)
          params.append('height', transform.height.toString());
        url += `?${params.toString()}`;
      }

      setImageUri(url);
    } else {
      setImageUri(
        Image.resolveAssetSource(require('@/assets/default-avatar.png')).uri
      );
    }
  }, [bucket, path, transform]);

  return (
    <Image
      source={{ uri: imageUri }}
      className={`${className} bg-neutral-300`}
      resizeMode="cover"
    />
  );
}
