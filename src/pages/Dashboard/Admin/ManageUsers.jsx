import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosSecure } from '../../../hooks/useAxios';
import Spinner from '../../../components/Spinner';
import Swal from 'sweetalert2';

const PAGE_SIZE = 10;
const ROLES = ['user', 'creator', 'admin'];

const ManageUsers = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminUsers', page],
    queryFn: () => axiosSecure.get(`/admin/users?page=${page}&limit=${PAGE_SIZE}`).then((r) => r.data),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => axiosSecure.patch(`/admin/users/${id}/role`, { role }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminUsers'] }); Swal.fire({ icon: 'success', title: 'Role updated', timer: 1500, showConfirmButton: false }); },
    onError: (err) => Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/admin/users/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminUsers'] }); Swal.fire({ icon: 'success', title: 'User deleted', timer: 1500, showConfirmButton: false }); },
    onError: (err) => Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message }),
  });

  const handleRoleChange = (id, role) => roleMutation.mutate({ id, role });

  const handleDelete = (id, name) => {
    Swal.fire({ title: `Delete ${name}?`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Delete', confirmButtonColor: '#e74c3c' })
      .then((r) => { if (r.isConfirmed) deleteMutation.mutate(id); });
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
      <div className="overflow-x-auto bg-base-100 rounded-box shadow">
        <table className="table">
          <thead>
            <tr><th>#</th><th>User</th><th>Email</th><th>Role</th><th>Wins</th><th>Action</th></tr>
          </thead>
          <tbody>
            {data?.users?.map((u, i) => (
              <tr key={u._id}>
                <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="avatar"><div className="w-8 rounded-full"><img src={u.photoUrl || `https://ui-avatars.com/api/?name=${u.name}`} alt={u.name} /></div></div>
                    <span className="font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="text-sm">{u.email}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="select select-bordered select-sm"
                    disabled={roleMutation.isPending}
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td>{u.wins}</td>
                <td>
                  <button onClick={() => handleDelete(u._id, u.name)} className="btn btn-xs btn-error btn-outline" disabled={deleteMutation.isPending}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data?.users?.length && <p className="text-center py-10 text-base-content/50">No users found</p>}
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

export default ManageUsers;
