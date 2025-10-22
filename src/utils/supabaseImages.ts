import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";

// export const downloadImage = async (
//   image: string,
//   supabase: SupabaseClient<Database>,
// ) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const { error, data } = await supabase.storage
//         .from("images")
//         .download(image);

//       if (error) {
//         return reject(error);
//       }

//       const fr = new FileReader();
//       fr.readAsDataURL(data);
//       fr.onload = () => {
//         resolve(fr.result as string);
//       };
//     } catch (error) {
//       reject(error);
//     }
//   });
// };


export const downloadImage = async (
  bucket: string,
  path: string,
  supabase: SupabaseClient<Database>,

): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path,);
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

export const uploadImage = async (
  localUri: string,
  supabase: SupabaseClient<Database>,
) => {
  const fileRes = await fetch(localUri);
  const arrayBuffer = await fileRes.arrayBuffer();

  const fileExt = localUri.split(".").pop()?.toLowerCase() ?? "jpeg";
  const path = `${Date.now()}.${fileExt}`;

  const { error, data } = await supabase.storage
    .from("images")
    .upload(path, arrayBuffer);

  if (error) {
    throw error;
  } else {
    return data.path;
  }
};