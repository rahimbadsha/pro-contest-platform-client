import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosSecure } from '../../../hooks/useAxios';
import Spinner from '../../../components/Spinner';
import Swal from 'sweetalert2';

const PAGE_SIZE = 10;

const ManageContests = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminContests', page],
    queryFn: () => axiosSecure.get(`/admin/contests?page=${page}&limit=${PAGE_SIZE}`).then((r) => r.data),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => axiosSecure.patch(`/admin/contests/${id}/status`, { status }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminContests'] }); Swal.fire({ icon: 'success', title: 'Status updated', timer: 1500, showConfirmButton: false }); },
    onError: (err) => Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/admin/contests/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminContests'] }); Swal.fire({ icon: 'success', title: 'Contest deleted', timer: 1500, showConfirmButton: false }); },
    onError: (err) => Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message }),
  });

  const handleDelete = (id, name) => {
    Swal.fire({ title: `Delete "${name}"?`, text: 'All submissions will be deleted too.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Delete', confirmButtonColor: '#e74c3c' })
      .then((r) => { if (r.isConfirmed) deleteMutation.mutate(id); });
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Contests</h2>
      <div className="overflow-x-auto bg-base-100 rounded-box shadow">
        <table className="table">
          <thead>
            <tr><th>#</th><th>Contest</th><th>Creator</th><th>Type</th><th>Participants</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {data?.contests?.map((c, i) => (
              <tr key={c._id}>
                <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td className="font-medium max-w-xs truncate">{c.name}</td>
                <td className="text-sm">{c.creator?.name}</td>
                <td><span className="badge badge-sm capitalize">{c.type?.replace(/-/g, ' ')}</span></td>
                <td>{c.participantsCount}</td>
                <td>
                  <span className={`badge badge-sm ${
                    c.status === 'approved' ? 'badge-success' :
                    c.status === 'rejected' ? 'badge-error' :
                    c.status === 'ended' ? 'badge-warning' : 'badge-ghost'
                  }`}>{c.status}</span>
                </td>
                <td>
                  <div className="flex gap-1">
                    {c.status === 'pending' && (
                      <>
                        <button onClick={() => statusMutation.mutate({ id: c._id, status: 'approved' })} className="btn btn-xs btn-success" disabled={statusMutation.isPending}>Approve</button>
                        <button onClick={() => statusMutation.mutate({ id: c._id, status: 'rejected' })} className="btn btn-xs btn-warning" disabled={statusMutation.isPending}>Reject</button>
                      </>
                    )}
                    <button onClick={() => handleDelete(c._id, c.name)} className="btn btn-xs btn-error btn-outline" disabled={deleteMutation.isPending}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data?.contests?.length && <p className="text-center py-10 text-base-content/50">No contests found</p>}
      </div>
      {data?.totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: data.totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => setPage(i + 1)} className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-ghost'}`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageContests;
