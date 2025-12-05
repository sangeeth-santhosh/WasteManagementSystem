import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("view");
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || "" });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await authService.updateProfile(profileForm);
      updateUser(res.user);
      setSuccess("Profile updated successfully!");
      setActiveTab("view");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setSuccess("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setActiveTab("view");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-emerald-600 font-semibold mb-1">Profile</p>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200 pb-1">
        <button
          onClick={() => setActiveTab("view")}
          className={`px-4 py-2.5 text-sm font-semibold transition-all duration-150 rounded-t-lg ${
            activeTab === "view"
              ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          View Profile
        </button>
        <button
          onClick={() => setActiveTab("edit")}
          className={`px-4 py-2.5 text-sm font-semibold transition-all duration-150 rounded-t-lg ${
            activeTab === "edit"
              ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          Edit Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2.5 text-sm font-semibold transition-all duration-150 rounded-t-lg ${
            activeTab === "password"
              ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          Change Password
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">{success}</div>
      )}

      {activeTab === "view" && (
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg text-white font-bold text-xl">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{user?.name || "—"}</h3>
              <p className="text-sm text-gray-600">{user?.email || "—"}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <p className="text-gray-900">{user?.name || "—"}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{user?.email || "—"}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
              <p className="text-gray-900 capitalize">{user?.role || "—"}</p>
            </div>
            {user?.createdAt && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Member Since</label>
                <p className="text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === "edit" && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Profile</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </Card>
      )}

      {activeTab === "password" && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};

export default Profile;

