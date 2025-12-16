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
    body: `${data?.posts?.content}`,
    data: { postId: data.posts.id },
  };

  await sendPushNotification(message);
}

export async function sendPostNotification(postId: string) {
  // 1. Fetch the post and its author
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("id, content, area, city, country,profiles(username, id)")
    .eq("id", postId)
    .single();

  if (postError || !post) return;

  const { area, city, country } = post;
  const authorId = post.profiles?.id;

  if (!area || !city || !country || !authorId) return;

  // 2. Fetch users in same area (excluding author)
const { data: users, error: usersError } = await supabase
.from("profiles")
.select("id, push_token")
.eq("area", area)
.eq("city", city)
.eq("country", country)
.neq("id", authorId)
.not("push_token", "is", null);

if (usersError || !users || users.length === 0) return;

// 3. Deduplicate push tokens
const uniquePushTokens = [...new Set(users.map(u => u.push_token))];

// 4. Build messages
const messages = uniquePushTokens.map(token => ({
to: token!,
sound: "default",
title: `${post.profiles?.username} posted in ${area}`,
body: post.content || "New post in your area",
data: { postId: post.id },
}));

if (messages.length === 0) return;

// 5. Send in batches
const batchSize = 30;
for (let i = 0; i < messages.length; i += batchSize) {
await sendPushNotification(messages.slice(i, i + batchSize));
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