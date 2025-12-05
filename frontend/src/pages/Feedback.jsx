import { useState, useEffect } from "react";
import { feedbackService } from "../services/feedbackService";

const Feedback = () => {
  const [form, setForm] = useState({ subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    loadFeedbackHistory();
  }, []);

  const loadFeedbackHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await feedbackService.getMyFeedback();
      setFeedbackHistory(res.data || []);
    } catch (err) {
      console.error("Failed to load feedback history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

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
      loadFeedbackHistory();
    } catch (err) {
      setError(err.message || "Failed to send feedback");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (feedback) => {
    if (feedback.resolved) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getStatusLabel = (feedback) => {
    if (feedback.resolved) {
      return "Resolved";
    }
    return "Pending";
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Message <span className="text-gray-500 font-normal">(up to 2000 characters)</span>
          </label>
          <textarea
            rows="12"
            maxLength={2000}
            value={form.message}
            onChange={(e) => handleChange("message", e.target.value)}
            placeholder="Share your experience or suggestions in detail. Feel free to write as much as you'd like..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-y min-h-[200px] text-base leading-relaxed"
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {form.message.length} / 2000 characters
          </div>
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

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">My Feedback History</h2>
        {loadingHistory ? (
          <div className="text-center py-8 text-gray-500">Loading feedback history...</div>
        ) : feedbackHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-white border border-gray-100 rounded-xl">
            <p>No feedback submitted yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {feedbackHistory.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    {item.subject && (
                      <h3 className="font-semibold text-gray-900 mb-1">{item.subject}</h3>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-3">{item.message}</p>
                  </div>
                  <span
                    className={`ml-4 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      item
                    )}`}
                  >
                    {getStatusLabel(item)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Submitted: {new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {item.resolvedAt && (
                    <p className="text-xs text-gray-500">
                      Resolved: {new Date(item.resolvedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;

