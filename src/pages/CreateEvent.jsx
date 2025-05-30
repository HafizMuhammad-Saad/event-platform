import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEvents } from "../hooks/useEvent";
import { supabase } from "../services/supabase.js";

export const CreateEvent = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { addEvent } = useEvents();
    const [loading, setLoading] = useState(false);

     const [form, setForm] = useState({
    title: '',
    description: '',
    date_time: '',
    location: '',
    category: '',
    image_url: '',
    status: 'pending',
  });

   const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let imageUrl = '';
        setLoading(true);

  // Upload image to Supabase Storage
if (form.image_url && typeof form.image_url !== 'string') {
    const file = form.image_url;
    const fileName = `${user.id}-${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from('event-images') // your storage bucket name
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error.message);
      return;
    }

    // Get public URL
    const { data: urlData, error: urlError } = supabase
  .storage
  .from('event-images')
  .getPublicUrl(fileName);

if (urlError || !urlData?.publicUrl) {
  console.error('Failed to get public URL:', urlError);
  return;
}

imageUrl = urlData.publicUrl;
  }
        const payload = {
            ...form,
            image_url: imageUrl || form.image_url, // Use uploaded image URL or existing one
            created_by: user.id,
            created_at: new Date().toISOString(),
        };
        
        try {
         setLoading(true);
      await addEvent(payload);
      setForm({
        title: '',
        description: '',
        date_time: '',
        location: '',
        category: '',
        image_url: '',
        status: 'pending',
      });
      toast.success('Event created successfully!');
      setTimeout(() => {
        navigate('/events'); // Redirect to events page after creation
        
      }, 2000);
    } catch (error) {
  toast.error(`Error creating event: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

    return (
       <div className="p-6 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
  <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Create New Event</h1>
  
  <form onSubmit={handleSubmit} className="space-y-6">
    {/* Title */}
    <div className="form-control">
      <label className="label">
        <span className="label-text text-gray-700 dark:text-gray-300">Event Title*</span>
      </label>
      <input
        name="title"
        placeholder="Enter event title"
        value={form.title}
        onChange={handleChange}
        required
        className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>

    {/* Description */}
    <div className="form-control">
      <label className="label">
        <span className="label-text text-gray-700 dark:text-gray-300">Description</span>
      </label>
      <textarea
        name="description"
        placeholder="Describe your event"
        value={form.description}
        onChange={handleChange}
        rows={4}
        className="textarea textarea-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>

    {/* Date & Time */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text text-gray-700 dark:text-gray-300">Date & Time*</span>
        </label>
        <input
          type="datetime-local"
          name="date_time"
          value={form.date_time}
          onChange={handleChange}
          required
          className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Location */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-gray-700 dark:text-gray-300">Location</span>
        </label>
        <input
          name="location"
          placeholder="Event location"
          value={form.location}
          onChange={handleChange}
          className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
    </div>

    {/* Category and Image */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Category */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-gray-700 dark:text-gray-300">Category</span>
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="select select-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Select a category</option>
          <option value="concert">Concert</option>
          <option value="conference">Conference</option>
          <option value="workshop">Workshop</option>
          <option value="sports">Sports</option>
          <option value="exhibition">Exhibition</option>
        </select>
      </div>

      {/* Image Upload */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-gray-700 dark:text-gray-300">Event Image</span>
        </label>
        <div className="flex items-center gap-4">
          {form.image_url ? (
            <div className="relative">
              <img 
                src={typeof form.image_url === 'string' ? form.image_url : URL.createObjectURL(form.image_url)} 
                alt="Event preview" 
                className="w-16 h-16 rounded-lg object-cover"
              />
              <button 
                type="button" 
                onClick={() => handleChange({ target: { name: 'image_url', value: '' } })}
                className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG (MAX. 5MB)</p>
              </div>
              <input 
                type="file" 
                name="image_url" 
                accept="image/*" 
                onChange={(e) => handleChange({ 
                  target: { 
                    name: 'image_url', 
                    value: e.target.files?.[0] || '' 
                  } 
                })} 
                className="hidden" 
              />
            </label>
          )}
        </div>
      </div>
    </div>

    {/* Submit Button */}
    <div className="pt-4">
      <button 
        type="submit" 
        disabled={loading}
        className="btn btn-primary w-full py-3 px-6 rounded-lg transition-all hover:shadow-lg"
      >
        {loading ? (
          <>
            <span className="loading loading-spinner"></span>
            Creating Event...
          </>
        ) : (
          'Create Event'
        )}
      </button>
    </div>
  </form>
</div>
    );
}