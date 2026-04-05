import type {Post} from '../interfaces/Post';

export const PostCard = ({ post }: { post: Post }) => (
  <div className="border-b border-zinc-800 py-6 last:border-0 group cursor-default">
    <div className="flex justify-between items-start mb-2">
      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">{post.category}</span>
      <span className="font-mono text-[10px] text-zinc-600">{new Date(post.published_at).toLocaleDateString()}</span>
    </div>
    <h3 className="text-lg font-bold group-hover:text-blue-500 transition-colors mb-2">{post.title}</h3>
    <p className="text-zinc-400 text-sm leading-relaxed">{post.content}</p>
  </div>
);