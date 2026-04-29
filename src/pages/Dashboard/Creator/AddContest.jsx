import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosSecure } from '../../../hooks/useAxios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const TYPES = ['image-design', 'article-writing', 'marketing-strategy', 'gaming-review', 'book-review', 'business-idea', 'other'];

const AddContest = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => axiosSecure.post('/creator/contests', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creatorContests'] });
      reset();
      Swal.fire({ icon: 'success', title: 'Contest created!', text: 'Awaiting admin approval.', timer: 2000, showConfirmButton: false });
      navigate('/dashboard/creator/my-contests');
    },
    onError: (err) => Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message }),
  });

  const onSubmit = (data) => {
    mutation.mutate({ ...data, price: parseFloat(data.price), prize: parseFloat(data.prize) });
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Add New Contest</h2>
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
                <input type="date" className={`input input-bordered ${errors.deadline ? 'input-error' : ''}`}
                  min={new Date().toISOString().split('T')[0]}
                  {...register('deadline', { required: 'Deadline required' })} />
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

            <button type="submit" className="btn btn-primary w-full" disabled={mutation.isPending || isSubmitting}>
              {mutation.isPending ? <span className="loading loading-spinner" /> : 'Create Contest'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddContest;
