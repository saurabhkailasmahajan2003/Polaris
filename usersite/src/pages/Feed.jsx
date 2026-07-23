import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import FeedPost from '../components/feed/FeedPost';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import { eventsApi, votesApi, casesApi } from '../lib/api';
import { CATEGORY_IMAGES } from '../lib/constants';
import { getSocket } from '../lib/socket';
import { useLanguage } from '../context/LanguageContext';

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

function FeedEmptyState({ deployed }) {
  const { t } = useLanguage();
  return (
    <div className="mx-4 my-8 md:mx-0 rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/10 to-transparent px-5 py-10 text-center">
      <p className="text-3xl mb-3" aria-hidden>🏛</p>
      <h2 className="font-heading text-lg font-bold mb-2">
        {deployed ? t.feedEmptyDeployedTitle : t.feedEmptyIdleTitle}
      </h2>
      <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto mb-6">
        {deployed ? t.feedEmptyDeployedBody : t.feedEmptyIdleBody}
      </p>
      {deployed && (
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            to="/city"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            {t.goToCity}
          </Link>
          <Link
            to="/cases"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/20 text-sm font-medium hover:border-primary/40 transition-colors"
          >
            {t.seeLiveCases}
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Feed() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deployedAway, setDeployedAway] = useState(false);
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [comments, setComments] = useState({});

  const applyEvents = useCallback((data) => {
    if (Array.isArray(data) && data.length) {
      const mapped = data.map((e, i) => toFeedPost(e, i));
      setPosts(mapped);
      setLikeCounts(Object.fromEntries(mapped.map((p) => [p.id, p.votes || 0])));
      setComments(Object.fromEntries(mapped.map((p) => [p.id, []])));
      setDeployedAway(false);
    } else {
      setPosts([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      eventsApi.list(),
      casesApi.list().catch(() => []),
    ]).then(([events, cases]) => {
      if (cancelled) return;
      applyEvents(events);
      const hasCityWork = Array.isArray(cases) && cases.some((c) =>
        ['pending', 'processing', 'completed'].includes(c.status)
      );
      if ((!Array.isArray(events) || events.length === 0) && hasCityWork) {
        setDeployedAway(true);
      }
    }).catch(() => {
      if (!cancelled) setPosts([]);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    const socket = getSocket();
    const onDeployed = () => {
      setPosts([]);
      setDeployedAway(true);
      setLoading(false);
    };
    const onStarted = () => {
      eventsApi.list().then((data) => {
        applyEvents(data);
        if (!Array.isArray(data) || data.length === 0) setDeployedAway(true);
      }).catch(() => {});
    };

    socket.on('cases:deployed', onDeployed);
    socket.on('case:started', onStarted);

    return () => {
      cancelled = true;
      socket.off('cases:deployed', onDeployed);
      socket.off('case:started', onStarted);
    };
  }, [applyEvents]);

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
        <div className="hidden md:flex md:items-end md:justify-between px-4 md:px-0 py-4 md:py-6 border-b border-white/[0.06] gap-4">
          <div>
            <h1 className="font-heading text-xl font-bold">{t.feedTitle}</h1>
            <p className="text-sm text-text-secondary mt-0.5">{t.feedSubtitle}</p>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="md:hidden flex justify-end px-3 pt-2">
          <LanguageSwitcher compact />
        </div>

        <div className="md:py-4 md:space-y-4">
          {loading && (
            <p className="px-4 py-8 text-sm text-text-muted text-center">{t.loadingFeed}</p>
          )}
          {!loading && posts.length === 0 && (
            <FeedEmptyState deployed={deployedAway} />
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
