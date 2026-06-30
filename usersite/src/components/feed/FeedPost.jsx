import { useState } from 'react';
import CategoryBadge from '../ui/CategoryBadge';

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-6 h-6 ${filled ? 'text-red-500' : ''}`} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.543l-.75 2.848 2.933-.77c1.333.89 2.92 1.375 4.544 1.375Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
  );
}

function BookmarkIcon({ saved }) {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
  );
}

function formatCount(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default function FeedPost({
  post,
  liked,
  saved,
  likeCount,
  comments,
  onLike,
  onSave,
  onAddComment,
}) {
  const [draft, setDraft] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const visibleComments = showAllComments ? comments : comments.slice(0, 2);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onAddComment(text);
    setDraft('');
  };

  const username = post.username || `polaris_${post.category || 'news'}`;

  return (
    <article className="bg-night border-b border-white/[0.08]">
      {/* Post header */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 py-2.5 flex-wrap">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold shrink-0">
          P
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight truncate">{username}</p>
          <p className="text-[11px] text-text-muted truncate">{post.location || 'Public Square'}</p>
        </div>
        <CategoryBadge category={post.category} className="shrink-0 max-w-[40%] truncate" />
        <button type="button" className="text-text-primary p-1" aria-label="More options">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-surface-deep">
        <img src={post.image} alt="" className="w-full h-full object-cover" />
        {post.live && (
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white uppercase tracking-wide">
            Live
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="px-3 pt-2.5 pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button type="button" onClick={onLike} aria-label={liked ? 'Unlike' : 'Like'} className="hover:opacity-70 transition-opacity">
              <HeartIcon filled={liked} />
            </button>
            <button type="button" aria-label="Comment" className="hover:opacity-70 transition-opacity">
              <CommentIcon />
            </button>
            <button type="button" aria-label="Share" className="hover:opacity-70 transition-opacity">
              <ShareIcon />
            </button>
          </div>
          <button type="button" onClick={onSave} aria-label={saved ? 'Unsave' : 'Save'} className="hover:opacity-70 transition-opacity">
            <BookmarkIcon saved={saved} />
          </button>
        </div>

        <p className="text-sm font-semibold mt-2">{formatCount(likeCount)} likes</p>

        <p className="text-sm mt-1 leading-snug">
          <span className="font-semibold mr-1.5">{username}</span>
          {post.caption || post.description || post.title}
        </p>

        {comments.length > 2 && !showAllComments && (
          <button
            type="button"
            onClick={() => setShowAllComments(true)}
            className="text-sm text-text-muted mt-1"
          >
            View all {comments.length} comments
          </button>
        )}

        {visibleComments.map((c) => (
          <p key={c.id} className="text-sm mt-1 leading-snug">
            <span className="font-semibold mr-1.5">{c.user}</span>
            {c.text}
          </p>
        ))}

        {post.time && (
          <p className="text-[10px] text-text-muted uppercase mt-2 tracking-wide">{post.time}</p>
        )}
      </div>

      {/* Comment box */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-2.5 border-t border-white/[0.06]">
        <div className="w-6 h-6 rounded-full bg-white/10 shrink-0" />
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-transparent text-sm placeholder:text-text-muted outline-none min-w-0"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="text-sm font-semibold text-primary disabled:opacity-30 shrink-0"
        >
          Post
        </button>
      </form>
    </article>
  );
}
