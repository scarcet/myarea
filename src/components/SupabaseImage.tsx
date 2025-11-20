// import { supabase } from '@/lib/supabase';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { Image } from 'react-native';

// interface SupabaseImageProps {
//   bucket: string;
//   path?: string | null;
//   className?: string;
//   transform?: { width: number; height: number };
// }

// const fetchImage = async (bucket: string, path: string): Promise<string> => {
//   // Get the public URL for the file
//   const { data, error } = supabase.storage.from(bucket).getPublicUrl(path);
//   if (error) throw error;

//   // Return just the URL string
//   return data.publicUrl;
// };

// export default function SupabaseImage({
//   bucket,
//   path,
//   className,
// }: SupabaseImageProps) {
//   const queryClient = useQueryClient();
//   const finalPath = path || 'default-avatar.png';

//   const { data: imageUrl } = useQuery({
//     queryKey: ['supabaseImage', bucket, finalPath],
//     queryFn: () => fetchImage(bucket, finalPath),
//     enabled: !!finalPath,
//     staleTime: 1000 * 60 * 60 * 24, // 1 day cache
//   });

//   return (
//     <Image
//       source={{ uri: imageUrl || undefined }}
//       className={`${className} bg-neutral-300`}
//       resizeMode="cover"
//     />
//   );
// }

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
