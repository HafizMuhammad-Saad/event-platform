import { useState, useEffect } from "react";
import { useParticipantStore } from "../stores/useParticipantStore";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const ParticipantsList = () => {
    const { eventId } = useParams();
    const { user } = useAuth();
    const { participants, loading, fetchParticipants, deleteParticipant, addParticipant } = useParticipantStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [form, setForm] = useState({
        participant_name: '',
        participant_email: '',
        added_at: '',
        added_by: '',
      });

      const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
      };

    
    useEffect(() => {
        // console.log(`Fetching participants for event ID: ${eventId}`);
        
        fetchParticipants(eventId);
    }, [eventId, fetchParticipants]);

    const handleDeleteParticipant = async (id) => {
        try {
          window.confirm("Are you sure you want to delete this participant?")
            await deleteParticipant(id);
        } catch (error) {
            console.error("Error deleting participant:", error);
            toast.error("Failed to delete participant.");
        }
    }
    
    // const filteredParticipants = participants.filter(participant =>
    //     participant.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );
    const handleAddParticipant = async (e) => {
        e.preventDefault();
        const formData = {
            participant_name: form.participant_name,
            participant_email: form.participant_email,
            added_at: new Date().toISOString(),
            event_id: eventId,
            added_by: user.id, // Replace with actual user ID
        };

        try {
            await addParticipant({ ...formData, event_id: eventId });
            setForm({
                participant_name: '',
                participant_email: '',
                added_at: '',
                added_by: '',
            });
        } catch (error) {
            console.error("Error adding participant:", error);
        }
    }
    
    
    return (
       <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
  <div className="max-w-6xl mx-auto">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Participants</h1>
      <div className="relative w-64">
        <input
          type="text"
          placeholder="Search participants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    {loading ? (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    ) : (
      <>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium uppercase tracking-wider">
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Added At</div>
            <div className="col-span-2">Added By</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          
          {participants.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {participants.map(participant => (
                <li key={participant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                    <div className="col-span-3 font-medium">{participant.participant_name}</div>
                    <div className="col-span-3 text-gray-600 dark:text-gray-300">{participant.participant_email}</div>
                    <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(participant.added_at).toLocaleString()}
                    </div>
                    <div className="col-span-2 text-sm">{participant.added_by}</div>
                    <div className="col-span-2 flex justify-end">
                      <button
                        onClick={() => handleDeleteParticipant(participant.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Delete"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No participants</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by adding a new participant.</p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Add New Participant</h2>
          <form onSubmit={handleAddParticipant} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="participant_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="participant_name"
                  name="participant_name"
                  onChange={handleChange}
                  value={form.participant_name}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="participant_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="participant_email"
                  name="participant_email"
                  onChange={handleChange}
                  value={form.participant_email}
                  placeholder="john@example.com"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="added_at" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date Added
                </label>
                <input
                  type="datetime-local"
                  id="added_at"
                  name="added_at"
                  onChange={handleChange}
                  value={form.added_at}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="added_by" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Added By
                </label>
                <input
                  type="text"
                  id="added_by"
                  name="added_by"
                  onChange={handleChange}
                  value={form.added_by}
                  placeholder="Admin"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Participant
              </button>
            </div>
          </form>
        </div>
      </>
    )}
  </div>
</div>
    );
}

export default ParticipantsList;