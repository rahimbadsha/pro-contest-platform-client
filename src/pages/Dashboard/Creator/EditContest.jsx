import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosSecure } from '../../../hooks/useAxios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Spinner from '../../../components/Spinner';

const TYPES = ['image-design', 'article-writing', 'marketing-strategy', 'gaming-review', 'book-review', 'business-idea', 'other'];

const EditContest = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['creatorContest', id],
    queryFn: () => axiosSecure.get(`/creator/my-contests`).then((r) => r.data.contests.find((c) => c._id === id)),
  });

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        description: data.description,
        task: data.task || '',
        price: data.price,
        prize: data.prize || '',
        type: data.type,
        deadline: data.deadline ? new Date(data.deadline) : null,
        image: data.image || '',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '',
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (body) => axiosSecure.patch(`/creator/contests/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creatorContests'] });
      Swal.fire({ icon: 'success', title: 'Contest updated!', timer: 1500, showConfirmButton: false });
      navigate('/dashboard/creator/my-contests');
    },
    onError: (err) => Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message }),
  });

  const onSubmit = (data) => {
    const { deadline, ...rest } = data;
    mutation.mutate({
      ...rest,
      price: parseFloat(rest.price),
      prize: parseFloat(rest.prize),
      deadline: deadline ? deadline.toISOString() : '',
    });
  };

  if (isLoading) return <Spinner />;
  if (!data) return <div className="text-center py-20 text-error">Contest not found or not editable.</div>;
  if (data.status === 'approved') return (
    <div className="alert alert-warning max-w-xl">
      <span>Approved contests cannot be edited.</span>
    </div>
  );

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Edit Contest</h2>
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Contest Name *</span></label>
              <input type="text" className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                {...register('name', { required: 'Name is required' })} />
              {errors.name && <span className="text-error text-xs">{errors.name.message}</span>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Description *</span></label>
              <textarea rows={4} className={`textarea textarea-bordered ${errors.description ? 'textarea-error' : ''}`}
                {...register('description', { required: 'Description is required' })} />
              {errors.description && <span className="text-error text-xs">{errors.description.message}</span>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Task Instructions</span></label>
              <textarea rows={3} className="textarea textarea-bordered" {...register('task')} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Entry Fee ($) *</span></label>
                <input type="number" step="0.01" min="0" className={`input input-bordered ${errors.price ? 'input-error' : ''}`}
                  {...register('price', { required: 'Entry fee required', min: { value: 0, message: 'Must be >= 0' } })} />
                {errors.price && <span className="text-error text-xs">{errors.price.message}</span>}
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Prize ($)</span></label>
                <input type="number" step="0.01" min="0" className="input input-bordered" {...register('prize')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Type *</span></label>
                <select className={`select select-bordered ${errors.type ? 'select-error' : ''}`}
                  {...register('type', { required: 'Type required' })}>
                  <option value="">Select type</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t.replace(/-/g, ' ')}</option>)}
                </select>
                {errors.type && <span className="text-error text-xs">{errors.type.message}</span>}
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Deadline *</span></label>
                <Controller
                  control={control}
                  name="deadline"
                  rules={{ required: 'Deadline required' }}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      minDate={new Date()}
                      dateFormat="yyyy-MM-dd"
                      className={`input input-bordered w-full ${errors.deadline ? 'input-error' : ''}`}
                      placeholderText="Select deadline"
                    />
                  )}
                />
                {errors.deadline && <span className="text-error text-xs">{errors.deadline.message}</span>}
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Image URL</span></label>
              <input type="url" className="input input-bordered" {...register('image')} />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Tags (comma separated)</span></label>
              <input type="text" placeholder="design, logo, branding" className="input input-bordered" {...register('tags')} />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary flex-1" disabled={mutation.isPending || isSubmitting}>
                {mutation.isPending ? <span className="loading loading-spinner" /> : 'Update Contest'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/dashboard/creator/my-contests')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditContest;
