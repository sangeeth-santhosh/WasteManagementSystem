import { useState, useEffect } from "react";
import { feedbackService } from "../services/feedbackService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

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
      <div>
        <p className="text-sm uppercase tracking-wide text-emerald-600 font-semibold mb-1">Feedback</p>
        <h1 className="text-2xl font-bold text-gray-900">Share Your Feedback</h1>
        <p className="text-gray-600 mt-1">Help us improve waste collection with your suggestions and ideas.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Send Feedback</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject (optional)</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              placeholder="Pick a topic"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Message <span className="text-gray-500 font-normal">(up to 2000 characters)</span>
            </label>
            <textarea
              rows="10"
              maxLength={2000}
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Share your experience or suggestions in detail. Feel free to write as much as you'd like..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-y min-h-[180px] text-base leading-relaxed transition-all"
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {form.message.length} / 2000 characters
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Sending..." : "Send Feedback"}
            </Button>
          </div>
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
              ✅ Thanks for your feedback! We appreciate your time.
            </div>
          )}
        </form>
      </Card>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">My Feedback History</h2>
        {loadingHistory ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">Loading feedback history...</p>
          </Card>
        ) : feedbackHistory.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No feedback submitted yet.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {feedbackHistory.map((item) => (
              <Card key={item._id} className="p-5" hover>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    {item.subject && (
                      <h3 className="font-bold text-gray-900 mb-2">{item.subject}</h3>
                    )}
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{item.message}</p>
                  </div>
                  <Badge variant={item.resolved ? 'resolved' : 'pending'}>
                    {getStatusLabel(item)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
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
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;

