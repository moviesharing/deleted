
import { Link } from 'react-router-dom';

export interface Video {
  id: string;
  title: string;
  duration: string;
  thumb: string;
  embed: string;
  tags: string[];
  actors: string[];
  category: string;
  quality: string;
  uploader: string;
  date: string;
}

interface VideoCardProps {
  video: Video;
}

function formatDuration(seconds: string) {
  const s = parseInt(seconds, 10);
  if (isNaN(s)) return seconds;
  const m = Math.floor(s / 60);
  const remaining = s % 60;
  return `${m}:${remaining.toString().padStart(2, '0')}`;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link to={`/video/${video.id}`} className="video-card">
      <div className="thumbnail-container">
        <img src={video.thumb} alt={video.title} className="thumbnail" loading="lazy" />
        <span className="duration-badge">{formatDuration(video.duration)}</span>
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <div className="video-meta">
          <span>{video.uploader}</span>
          <span>{video.quality}</span>
        </div>
      </div>
    </Link>
  );
}
