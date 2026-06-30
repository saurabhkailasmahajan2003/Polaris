import { useEffect, useState, useCallback } from 'react';
import AppLayout from '../components/layout/AppLayout';
import FeedPost from '../components/feed/FeedPost';
import { eventsApi, votesApi } from '../lib/api';
import { DEMO_EVENTS } from '../lib/constants';

const DEMO_COMMENTS = [
  { id: '1', user: 'citizen_42', text: 'This needs to go to the Supreme Court ASAP' },
  { id: '2', user: 'policy_watcher', text: 'The evidence on this is really strong' },
];

function toFeedPost(event, index) {
  const demo = DEMO_EVENTS[index % DEMO_EVENTS.length];
  return {
    id: event._id || event.id || demo.id,
    title: event.title || demo.title,
    description: event.description || demo.description,
    category: event.category || demo.category,
    image: event.image || demo.image,
    votes: event.voteCount ?? event.votes ?? demo.votes,
    username: `polaris_${(event.category || demo.category || 'news').replace(/\s/g, '_')}`,
    location: 'Public Square · Polaris',
    time: `${1 + (index % 12)}h ago`,
    live: index < 2,
  };
}

export default function Feed() {
  const [posts, setPosts] = useState(() => DEMO_EVENTS.map((e, i) => toFeedPost(e, i)));
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [likeCounts, setLikeCounts] = useState(() =>
    Object.fromEntries(DEMO_EVENTS.map((e) => [e.id, e.votes])),
  );
  const [comments, setComments] = useState(() =>
    Object.fromEntries(DEMO_EVENTS.map((e) => [e.id, [...DEMO_COMMENTS]])),
  );

  useEffect(() => {
    eventsApi.list().then((data) => {
      if (data?.length) {
        const mapped = data.map((e, i) => toFeedPost(e, i));
        setPosts(mapped);
        setLikeCounts(Object.fromEntries(mapped.map((p) => [p.id, p.votes || 0])));
        setComments((prev) => {
          const next = { ...prev };
          mapped.forEach((p) => {
            if (!next[p.id]) next[p.id] = [...DEMO_COMMENTS];
          });
          return next;
        });
      }
    });
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
      } catch { /* offline / demo */ }
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
