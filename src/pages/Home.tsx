import { useEffect, useState } from 'react';
import type { Video } from '../components/VideoCard';
import { VideoCard } from '../components/VideoCard';

export function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const VIDEOS_PER_PAGE = 24;

  useEffect(() => {
    fetch('/data/videos.json')
      .then(res => res.json())
      .then((data: Video[]) => {
        setVideos(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return <div className="loading"><div className="loader"></div> Loading...</div>;
  }

  const startIdx = (page - 1) * VIDEOS_PER_PAGE;
  const currentVideos = videos.slice(startIdx, startIdx + VIDEOS_PER_PAGE);
  const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Featured Videos</h2>
      <div className="video-grid">
        {currentVideos.map(v => <VideoCard key={v.id} video={v} />)}
      </div>
      
      <div className="pagination">
        <button 
          className="btn" 
          disabled={page === 1} 
          onClick={() => setPage(p => p - 1)}
        >
          Previous
        </button>
        <span className="page-info">Page {page} of {totalPages}</span>
        <button 
          className="btn" 
          disabled={page >= totalPages} 
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
