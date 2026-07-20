import { useEffect, useState, useCallback } from 'react';
import AppLayout from '../components/layout/AppLayout';
import FeedPost from '../components/feed/FeedPost';
import { eventsApi, votesApi } from '../lib/api';
import { CATEGORY_IMAGES } from '../lib/constants';

function toFeedPost(event, index) {
  return {
    id: event._id || event.id,
    title: event.title,
    description: event.description,
    category: event.category,
    image: event.image || CATEGORY_IMAGES[event.category] || CATEGORY_IMAGES.general,
    votes: event.voteCount ?? event.votes ?? 0,
    username: `polaris_${(event.category || 'news').replace(/\s/g, '_')}`,
    location: 'Public Square · Polaris',
    time: `${1 + (index % 12)}h ago`,
    live: index < 2,
  };
}

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    eventsApi.list().then((data) => {
      if (Array.isArray(data) && data.length) {
        const mapped = data.map((e, i) => toFeedPost(e, i));
        setPosts(mapped);
        setLikeCounts(Object.fromEntries(mapped.map((p) => [p.id, p.votes || 0])));
        setComments(Object.fromEntries(mapped.map((p) => [p.id, []])));
      } else {
        setPosts([]);
      }
    }).catch(() => {
      setPosts([]);
    }).finally(() => setLoading(false));
  }, []);

  const toggleLike = useCallback(async (postId) => {
    const wasLiked = liked[postId];
    setLiked((l) => ({ ...l, [postId]: !wasLiked }));
    setLikeCounts((c) => ({
      ...c,
      [postId]: (c[postId] || 0) + (wasLiked ? -1 : 1),
    }));
    if (!wasLiked) {
      try {
        await votesApi.vote(postId);
      } catch { /* offline */ }
    }
  }, [liked]);

  const toggleSave = useCallback((postId) => {
    setSaved((s) => ({ ...s, [postId]: !s[postId] }));
  }, []);

  const addComment = useCallback((postId, text) => {
    setComments((c) => ({
      ...c,
      [postId]: [...(c[postId] || []), { id: Date.now().toString(), user: 'you', text }],
    }));
  }, []);

  return (
    <AppLayout showWorldState={false} showTicker={false}>
      <div className="w-full min-w-0 max-w-[470px] mx-auto md:max-w-2xl lg:max-w-4xl">
        <div className="hidden md:block px-4 md:px-0 py-4 md:py-6 border-b border-white/[0.06]">
          <h1 className="font-heading text-xl font-bold">Feed</h1>
          <p className="text-sm text-text-secondary mt-0.5">Events the AI civilization is debating</p>
        </div>

        <div className="md:py-4 md:space-y-4">
          {loading && (
            <p className="px-4 py-8 text-sm text-text-muted text-center">Loading feed…</p>
          )}
          {!loading && posts.length === 0 && (
            <p className="px-4 py-8 text-sm text-text-muted text-center">
              No events yet. Create events in the admin panel.
            </p>
          )}
          {posts.map((post) => (
            <div key={post.id} className="md:rounded-xl md:border md:border-white/[0.08] md:overflow-hidden">
              <FeedPost
                post={post}
                liked={!!liked[post.id]}
                saved={!!saved[post.id]}
                likeCount={likeCounts[post.id] || 0}
                comments={comments[post.id] || []}
                onLike={() => toggleLike(post.id)}
                onSave={() => toggleSave(post.id)}
                onAddComment={(text) => addComment(post.id, text)}
              />
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
