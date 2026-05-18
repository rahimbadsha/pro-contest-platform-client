import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { FaGoogle, FaTrophy } from 'react-icons/fa';

const friendlyError = (err) => {
  const msg = err?.response?.data?.message || err?.message || '';
  if (msg.includes('Invalid credentials') || msg.includes('invalid-credential') || msg.includes('invalid-login')) return 'Wrong email or password.';
  if (msg.includes('too-many-requests')) return 'Too many attempts. Please wait a few minutes and try again.';
  if (msg.includes('network') || msg.includes('Network')) return 'Network error. Check your internet connection.';
  if (msg.includes('user-not-found')) return 'No account found with this email.';
  if (msg.includes('wrong-password')) return 'Incorrect password.';
  if (msg.includes('unauthorized-domain')) return 'Login not allowed from this domain. Contact support.';
  return msg || 'Something went wrong. Please try again.';
};

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
      Swal.fire({ icon: 'success', title: 'Welcome back!', timer: 1500, showConfirmButton: false });
      navigate(from, { replace: true });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Login failed', text: friendlyError(err) });
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      Swal.fire({ icon: 'success', title: 'Welcome!', timer: 1500, showConfirmButton: false });
      navigate(from, { replace: true });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Google login failed', text: friendlyError(err) });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-center mb-4">
            <FaTrophy className="text-primary text-4xl mx-auto mb-2" />
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-base-content/60 text-sm">Sign in to ContestHub</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input
                type="email"
                placeholder="you@example.com"
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <span className="text-error text-xs mt-1">{errors.email.message}</span>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Password</span></label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
              />
              {errors.password && <span className="text-error text-xs mt-1">{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? <span className="loading loading-spinner" /> : 'Login'}
            </button>
          </form>

          <div className="divider">OR</div>

          <button onClick={handleGoogle} className="btn btn-outline w-full gap-2">
            <FaGoogle /> Continue with Google
          </button>

          <p className="text-center text-sm mt-4">
            No account?{' '}
            <Link to="/register" className="link link-primary">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
