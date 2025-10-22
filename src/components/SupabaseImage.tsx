import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Image, Text, View } from 'react-native';

const downloadImage = async (
  bucket: string,
  path: string,
  transform: { width: number; height: number } | undefined
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path, { transform });
    if (error) {
      return reject(error);
    }
    const fr = new FileReader();
    fr.readAsDataURL(data);
    fr.onload = () => {
      resolve(fr.result as string);
    };
  });
};

export default function SupabaseImage({
  bucket,
  path,
  className,
  transform,
}: {
  bucket: string;
  path?: string | null;
  className: string;
  transform?: { width: number; height: number } | undefined;
}) {
  const finalPath = path || 'default-avatar.png';
  const { data, isLoading, error } = useQuery({
    queryKey: ['supabaseImage', { bucket, finalPath, transform }],
    queryFn: () => downloadImage(bucket, finalPath, transform),
    enabled: !!finalPath,

    staleTime: 1000 * 60 * 60 * 24,
  });

  // if (error) return <Text className='text-white'>Error: {error.message}</Text>;

  return (
    <Image
      source={{
        uri: data || undefined,
      }}
      className={`${className} bg-neutral-900`}
    />
  );
}