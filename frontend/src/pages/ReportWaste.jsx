import { useState } from "react";
import { wasteService } from "../services/wasteService";

const wasteTypes = [
  { key: "wetKg", label: "Wet Waste", color: "bg-green-100 text-green-700" },
  { key: "dryKg", label: "Dry Waste", color: "bg-blue-100 text-blue-700" },
  { key: "plasticKg", label: "Plastic", color: "bg-amber-100 text-amber-700" },
  { key: "eWasteKg", label: "E-Waste", color: "bg-purple-100 text-purple-700" },
];

const ReportWaste = () => {
  const [form, setForm] = useState({
    wetKg: "",
    dryKg: "",
    plasticKg: "",
    eWasteKg: "",
    zone: "A",
    details: "",
  });
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
      await wasteService.reportWaste(form);
      setSubmitted(true);
      setForm({
        wetKg: "",
        dryKg: "",
        plasticKg: "",
        eWasteKg: "",
        zone: "A",
        details: "",
      });
    } catch (err) {
      setError(err.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-green-600 font-semibold uppercase tracking-wide">Report</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Report household waste</h1>
          <p className="text-gray-600 mt-1">Add quantities (kg) and your zone. We’ll handle the rest.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {wasteTypes.map((item) => (
            <div key={item.key} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900">{item.label}</span>
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${item.color}`}>kg</span>
              </div>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form[item.key]}
                onChange={(e) => handleChange(item.key, e.target.value)}
                placeholder="0.0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Zone</label>
              <select
                value={form.zone}
                onChange={(e) => handleChange("zone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="A">Zone A</option>
                <option value="B">Zone B</option>
                <option value="C">Zone C</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Landmark / Address</label>
              <input
                type="text"
                value={form.details}
                onChange={(e) => handleChange("details", e.target.value)}
                placeholder="Near community park, house no..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit report"}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {submitted && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              Thanks for reporting! We’ll process your request.
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReportWaste;

