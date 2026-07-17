import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Video } from '../components/VideoCard';

export function Watch() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app we'd fetch just this video or use a context, 
    // but for static setup with 1 file we fetch and filter
    fetch('/data/videos.json')
      .then(res => res.json())
      .then((data: Video[]) => {
        const found = data.find(v => v.id === id);
        setVideo(found || null);
        setLoading(false);
      })
      .catch(console.error);
  }, [id]);

  if (loading) {
    return <div className="loading"><div className="loader"></div> Loading video...</div>;
  }

  if (!video) {
    return <div className="loading">Video not found.</div>;
  }

  return (
    <div className="watch-container">
      <div className="watch-main">
        <div className="player-wrapper" dangerouslySetInnerHTML={{ __html: video.embed }}>
        </div>
        
        <div className="watch-info">
          <h1 className="watch-title">{video.title}</h1>
          <div className="watch-meta">
            <span>By <strong>{video.uploader}</strong></span>
            <span>{video.quality}</span>
            <span>{video.date}</span>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Tags</h3>
            <div>
              {video.tags.map(tag => (
                <Link key={tag} to={`/search?q=${encodeURIComponent(tag)}`} className="tag">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          
          {video.actors.length > 0 && (
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Actors</h3>
              <div>
                {video.actors.map(actor => (
                  <Link key={actor} to={`/search?q=${encodeURIComponent(actor)}`} className="tag">
                    {actor}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="watch-sidebar">
        {/* Recommended videos could go here */}
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>More from this category</h3>
        <Link to={`/search?q=${encodeURIComponent(video.category)}`} className="btn">
          Explore {video.category}
        </Link>
      </div>
    </div>
  );
}
