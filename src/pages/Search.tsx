import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Video } from '../components/VideoCard';
import { VideoCard } from '../components/VideoCard';

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const VIDEOS_PER_PAGE = 24;

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetch('/data/videos.json')
      .then(res => res.json())
      .then((data: Video[]) => {
        if (!query) {
          setVideos(data);
        } else {
          const filtered = data.filter(v => 
            v.title.toLowerCase().includes(query) ||
            v.tags.some(t => t.toLowerCase().includes(query)) ||
            v.actors.some(a => a.toLowerCase().includes(query)) ||
            v.category.toLowerCase().includes(query)
          );
          setVideos(filtered);
        }
        setLoading(false);
      })
      .catch(console.error);
  }, [query]);

  if (loading) {
    return <div className="loading"><div className="loader"></div> Searching...</div>;
  }

  const startIdx = (page - 1) * VIDEOS_PER_PAGE;
  const currentVideos = videos.slice(startIdx, startIdx + VIDEOS_PER_PAGE);
  const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>
        {query ? `Search Results for "${query}"` : 'All Videos'} ({videos.length})
      </h2>
      
      {videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          No videos found. Try a different search term.
        </div>
      ) : (
        <>
          <div className="video-grid">
            {currentVideos.map(v => <VideoCard key={v.id} video={v} />)}
          </div>
          
          {totalPages > 1 && (
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
          )}
        </>
      )}
    </div>
  );
}
