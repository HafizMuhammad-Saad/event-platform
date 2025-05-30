import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';

function ProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    avatar_url: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles2')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || user.email || '',
        role: data.role || 'user',
        avatar_url: data.avatar_url ?? null // Use null if not set
      });
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      setMessage('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    let avatarUrl = profile.avatar_url ?? null;

    if(profile.avatar_url && typeof profile.avatar_url !== 'string') {
      const file = profile.avatar_url;
      const fileName = `${user.id}-${Date.now()}.${file.name}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData, error: urlError } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        if (urlError || !urlData?.publicUrl) {
          console.error('Error getting public URL:', urlError);
          throw new Error('Failed to get public URL');
        }

        avatarUrl = urlData?.publicUrl;
      } catch (error) {
        console.error('Error uploading avatar:', error.message);
        setMessage('Failed to upload avatar.');
        setLoading(false);
        return;
      }
    }

    console.log("Updating profile for user ID:", user.id);
    try {

      const { error } = await supabase
        .from('profiles2')
        .upsert({
          id: user.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          role: profile.role,
          avatar_url: avatarUrl, // Use the new or existing URL, or null
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setIsEditing(false);
      setMessage('Profile updated successfully!');
      await fetchProfile(); // Refresh with actual data from Supabase

    } catch (error) {
      console.error('Error updating profile:', error.message);
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    setUploading(true);
    setMessage('');
    let avatarUrl = profile.avatar_url ?? null;

    const file = e.target.files?.[0];
    if (!file) {
      setUploading(false);
      setMessage('No file selected.');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Use upsert: true to overwrite if file exists
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data, error } =  supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (error) {
  console.error('Error getting public URL:', error);
  throw error;
}

      avatarUrl = data.publicUrl;

      await supabase
        .from('profiles2')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      setProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
      setMessage('Avatar uploaded successfully!');
      await fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Avatar upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-lg font-medium">Loading your profile...</p>
      </div>
    </div>
  );
}

return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 mx-auto">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Success Message */}
      {message && (
        <div className="alert alert-success shadow-lg mb-6 transition-all duration-300">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="card bg-base-100 dark:bg-gray-800 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleUpdateProfile}>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="avatar relative">
                  <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={profile.avatar_url || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'}
                      alt="Profile"
                      className="object-cover"
                    />
                  </div>
                  <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-focus transition-all shadow-md">
                    <input
                      type="file"
                      className="hidden"
                      disabled={!isEditing}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                    />
                    {uploading ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </label>
                </div>
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-semibold">
                    {profile.first_name} {profile.last_name}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">{profile.role}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">First Name</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={profile.first_name}
                      onChange={handleChange}
                      placeholder="First Name"
                      disabled={!isEditing}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Last Name</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={profile.last_name}
                      onChange={handleChange}
                      placeholder="Last Name"
                      disabled={!isEditing}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="input input-bordered w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                  />
                </div>

                {/* <div>
                  <label className="label">
                    <span className="label-text">Role</span>
                  </label>
                  <select
                    name="role"
                    value={profile.role}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="select select-bordered w-full"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div> */}

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="btn btn-ghost"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="loading loading-spinner"></span>
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="btn btn-primary"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Account Security */}
        <div className="card bg-base-100 dark:bg-gray-800 shadow">
          <div className="card-body">
            <h2 className="card-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Account Security
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                </div>
                <button className="btn btn-sm btn-outline">Change</button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="card bg-base-100 dark:bg-gray-800 shadow">
          <div className="card-body">
            <h2 className="card-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Account Status
            </h2>
            <div className="flex items-center gap-2">
              <div className="badge badge-success gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Verified
              </div>
              <p className="text-sm text-gray-500">Your account is active and verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
}

export default ProfilePage;
