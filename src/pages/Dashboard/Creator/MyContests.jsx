import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosSecure } from '../../../hooks/useAxios';
import Spinner from '../../../components/Spinner';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const PAGE_SIZE = 10;

const MyContests = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['creatorContests', page],
    queryFn: () => axiosSecure.get(`/creator/my-contests?page=${page}&limit=${PAGE_SIZE}`).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/creator/contests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creatorContests'] });
      Swal.fire({ icon: 'success', title: 'Contest deleted', timer: 1500, showConfirmButton: false });
    },
    onError: (err) => Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message }),
  });

  const handleDelete = (id, name) => {
    Swal.fire({
      title: `Delete "${name}"?`,
      text: 'This will also delete all submissions.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#e74c3c',
    }).then((res) => { if (res.isConfirmed) deleteMutation.mutate(id); });
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Contests</h2>
        <Link to="/dashboard/creator/add-contest" className="btn btn-primary btn-sm">+ Add Contest</Link>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-box shadow">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Contest</th>
              <th>Type</th>
              <th>Participants</th>
              <th>Status</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.contests?.map((c, i) => (
              <tr key={c._id}>
                <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td className="font-medium max-w-xs truncate">{c.name}</td>
                <td><span className="badge badge-sm capitalize">{c.type?.replace(/-/g, ' ')}</span></td>
                <td>{c.participantsCount}</td>
                <td>
                  <span className={`badge badge-sm ${
                    c.status === 'approved' ? 'badge-success' :
                    c.status === 'rejected' ? 'badge-error' :
                    c.status === 'ended' ? 'badge-warning' : 'badge-ghost'
                  }`}>{c.status}</span>
                </td>
                <td>{new Date(c.deadline).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <Link to={`/dashboard/creator/submissions/${c._id}`} className="btn btn-xs btn-ghost">
                      <FaEye />
                    </Link>
                    {c.status !== 'approved' && (
                      <button onClick={() => handleDelete(c._id, c.name)} className="btn btn-xs btn-error btn-outline">
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data?.contests?.length && (
          <p className="text-center py-10 text-base-content/50">No contests yet. <Link to="/dashboard/creator/add-contest" className="link link-primary">Create one!</Link></p>
        )}
      </div>

      {data?.totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: data.totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => setPage(i + 1)} className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-ghost'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyContests;
