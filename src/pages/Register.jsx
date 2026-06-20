import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { useToast } from '../components/ToastProvider';

const initialState = {
  username: '',
  password: '',
  role: '',
};

const initialErrors = {
  username: '',
  password: '',
  role: '',
};

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;

const Register = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const validate = () => {
    const validation = { ...initialErrors };

    if (!form.username.trim()) {
      validation.username = 'Username is required.';
    } else if (form.username.trim().length < 4) {
      validation.username = 'Username must be at least 4 characters.';
    }

    if (!form.password) {
      validation.password = 'Password is required.';
    } else if (!passwordPattern.test(form.password)) {
      validation.password = 'Password must contain uppercase, lowercase, number, and special character.';
    }

    if (!form.role) {
      validation.role = 'Please select a role.';
    }

    setErrors(validation);
    return Object.values(validation).every((value) => !value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await register({ username: form.username.trim(), password: form.password, role: form.role });
      showToast({ title: 'Registration completed successfully.', message: 'You can now sign in with your new credentials.', variant: 'success' });
      navigate('/login');
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to complete registration.';
      showToast({ title: 'Registration error', message, variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex align-items-center min-vh-100 bg-light">
      <div className="container py-5">
        <div className="row g-4 justify-content-center">
          <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center">
            <div className="auth-panel text-white p-5 rounded-4 shadow-lg w-100">
              <div className="mb-5">
                <div className="badge bg-white text-primary mb-3">ProcureManage</div>
                <h1 className="display-6 fw-bold">Vendor Management System</h1>
                <p className="opacity-85 mt-3">
                  Join the ProcureManage ecosystem to manage vendor registration, access controls, and procurement workflows with enterprise-grade security.
                </p>
              </div>
              <div className="illustration-box mt-5">
                <div className="illustration-card rounded-4 p-4">
                  <h5 className="mb-3">Create your account</h5>
                  <p className="mb-0 text-muted">Select the correct role and complete the secure registration process. Your account will be ready to use immediately.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-5">
                <div className="mb-4 text-center">
                  <h2 className="fw-bold">Register</h2>
                  <p className="text-muted mb-0">Create your ProcureManage account and choose your access role.</p>
                </div>
                <form noValidate onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                      placeholder="Enter a username"
                    />
                    {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Create a secure password"
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="role" className="form-label">Role</label>
                    <select
                      id="role"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                    >
                      <option value="">Select role</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="USER">USER</option>
                    </select>
                    {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                  </div>

                  <div className="d-grid gap-2 mb-4">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                      {loading ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      ) : null}
                      {loading ? 'Registering...' : 'Register'}
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="mb-0 text-muted">
                      Already have an account?{' '}
                      <Link to="/login" className="text-decoration-none">
                        Login now
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
