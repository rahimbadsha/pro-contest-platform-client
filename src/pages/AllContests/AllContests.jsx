import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { axiosPublic } from '../../hooks/useAxios';
import ContestCard from '../../components/ContestCard';
import Spinner from '../../components/Spinner';
import { FaSearch } from 'react-icons/fa';

const TYPES = ['all', 'image-design', 'article-writing', 'marketing-strategy', 'gaming-review', 'book-review', 'business-idea', 'other'];
const PAGE_SIZE = 9;

const AllContests = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['contests', { type, search, page }],
    queryFn: () => {
      const params = new URLSearchParams({ page, limit: PAGE_SIZE });
      if (type !== 'all') params.append('type', type);
      if (search) params.append('search', search);
      return axiosPublic.get(`/contests?${params}`).then((r) => r.data);
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchParams({ search, type: type !== 'all' ? type : '' });
  };

  const handleTypeChange = (t) => {
    setType(t);
    setPage(1);
    setSearchParams({ type: t !== 'all' ? t : '', search });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">All Contests</h1>
        <p className="text-base-content/60 mt-2">Find your next challenge</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-sm">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Search contests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
          <button type="submit" className="btn btn-primary">Go</button>
        </form>

        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => handleTypeChange(t)}
              className={`badge badge-outline cursor-pointer capitalize ${type === t ? 'badge-primary' : ''}`}
            >
              {t === 'all' ? 'All' : t.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.contests?.map((contest) => (
              <ContestCard key={contest._id} contest={contest} />
            ))}
          </div>

          {!data?.contests?.length && (
            <div className="text-center py-20 text-base-content/50">
              <p className="text-xl">No contests found</p>
            </div>
          )}

          {data?.totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              {Array.from({ length: data.totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllContests;
