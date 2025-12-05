import { useState } from "react";
import { feedbackService } from "../services/feedbackService";

const Feedback = () => {
  const [form, setForm] = useState({ subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (submitted) setSubmitted(false);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await feedbackService.sendFeedback(form);
      setSubmitted(true);
      setForm({ subject: "", message: "" });
    } catch (err) {
      setError(err.message || "Failed to send feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-green-600 font-semibold uppercase tracking-wide">Feedback</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Share your feedback</h1>
          <p className="text-gray-600 mt-1">Help us improve waste collection with your suggestions.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Subject (optional)</label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            placeholder="Pick a topic"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
          <textarea
            rows="5"
            value={form.message}
            onChange={(e) => handleChange("message", e.target.value)}
            placeholder="Share your experience or suggestions..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send feedback"}
        </button>
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {submitted && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            Thanks for your feedback! We appreciate your time.
          </div>
        )}
      </form>
    </div>
  );
};

export default Feedback;

