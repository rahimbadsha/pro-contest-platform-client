import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosSecure } from '../../../hooks/useAxios';
import { useAuth } from '../../../context/AuthContext';
import Spinner from '../../../components/Spinner';
import Swal from 'sweetalert2';
import { FaChartPie } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserProfile = () => {
  const { refreshDbUser } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => axiosSecure.get('/user/profile').then((r) => r.data),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    values: data?.user ? { name: data.user.name, photoUrl: data.user.photoUrl, bio: data.user.bio } : {},
  });

  const mutation = useMutation({
    mutationFn: (updates) => axiosSecure.patch('/user/profile', updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      refreshDbUser();
      Swal.fire({ icon: 'success', title: 'Profile updated!', timer: 1500, showConfirmButton: false });
    },
    onError: (err) => Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message }),
  });

  if (isLoading) return <Spinner />;

  const { user, stats } = data || {};
  const participated = stats?.participated || 0;
  const wins = stats?.wins || 0;
  const losses = participated - wins;
  const winPct = parseFloat(stats?.winPercentage || 0);

  const pieData = participated > 0
    ? [
        { name: 'Wins', value: wins },
        { name: 'Losses', value: losses > 0 ? losses : 0 },
      ]
    : [{ name: 'No contests yet', value: 1 }];

  const COLORS = participated > 0 ? ['#4ade80', '#f87171'] : ['#d1d5db'];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <div className="card bg-base-100 shadow mb-6">
        <div className="card-body">
          <div className="flex items-center gap-4 mb-4">
            <div className="avatar">
              <div className="w-16 rounded-full">
                <img src={user?.photoUrl || `https://ui-avatars.com/api/?name=${user?.name}`} alt={user?.name} />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg">{user?.name}</h3>
              <p className="text-sm text-base-content/60">{user?.email}</p>
              <span className="badge badge-primary badge-sm capitalize">{user?.role}</span>
            </div>
          </div>

          <div className="bg-base-200 rounded-box p-4">
            <div className="flex items-center gap-2 mb-3">
              <FaChartPie className="text-primary" />
              <span className="font-semibold">Performance</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div><p className="text-2xl font-bold text-primary">{participated}</p><p className="text-xs text-base-content/60">Participated</p></div>
              <div><p className="text-2xl font-bold text-success">{wins}</p><p className="text-xs text-base-content/60">Wins</p></div>
              <div><p className="text-2xl font-bold text-warning">{winPct}%</p><p className="text-xs text-base-content/60">Win Rate</p></div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  dataKey="value"
                  labelLine={false}
                  label={participated > 0 ? renderCustomLabel : false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                {participated > 0 && <Legend />}
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="font-bold text-lg mb-4">Edit Profile</h3>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Name</span></label>
              <input type="text" className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                {...register('name', { required: 'Name required' })} />
              {errors.name && <span className="text-error text-xs">{errors.name.message}</span>}
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Photo URL</span></label>
              <input type="url" className="input input-bordered" {...register('photoUrl')} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Bio</span></label>
              <textarea className="textarea textarea-bordered" rows={3} {...register('bio')} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={mutation.isPending || isSubmitting}>
              {mutation.isPending ? <span className="loading loading-spinner" /> : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
