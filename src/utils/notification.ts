import { supabase } from "../lib/supabase";

export async function sendLikeNotification(like: { id: string }) {
  const { data, error } = await supabase
    .from("likes")
    .select("*, posts(*, profiles(*))")
    .eq("id", like.id)
    .single();

  if (error || !data) return;

  const pushToken = data.posts?.profiles?.push_token;
  if (!pushToken) return;

  const message = {
    to: pushToken,
    sound: "default",
    title: "Someone liked your post ❤️",
    body: `${data?.posts?.profiles.username} liked your post!`,
    data: { postId: data.posts.id },
  };

  await sendPushNotification(message);
}

export async function sendPostNotification(postId: string) {
  // 1. Fetch the post and its author
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("id, content, area, profiles(username, id)")
    .eq("id", postId)
    .single();

  if (postError || !post) return;

  const area = post.area;
  if (!area) return;

  // 2. Fetch all users in the same area that are NOT the author
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id, username, push_token, area")
    .eq("area", area);

  if (usersError || !users) return;

  // Filter valid push tokens and exclude the post creator
  const pushTokens = users
    .filter(
      (u) => u.push_token && u.id !== post.profiles?.id // Do not notify the creator
    )
    .map((u) => ({
      to: u.push_token as string,
      sound: "default",
      title: `${post.profiles?.username} posted in ${area}`,
      body: post.content || "New post in your area",
      data: { postId: post.id },
    }));

  if (pushTokens.length === 0) return;

  // 3. Send notifications in batches of 30 (Expo limit)
  const batchSize = 30;
  for (let i = 0; i < pushTokens.length; i += batchSize) {
    const chunk = pushTokens.slice(i, i + batchSize);
    await sendPushNotification(chunk);
  }
}

async function sendPushNotification(message: { [key: string]: any }) {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
