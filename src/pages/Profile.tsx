import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Hash,
  BookOpen,
  Calendar,
  GraduationCap,
  Briefcase,
  Award,
  Lock,
  Save,
  Plus,
  X,
} from 'lucide-react';

export const Profile = () => {
  const { profile, updateProfile, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showAddOffer, setShowAddOffer] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newOffer, setNewOffer] = useState('');
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    branch: profile?.branch || '',
    year: profile?.year || 1,
    cpi: profile?.cpi || 0,
  });

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    const { error } = await updateProfile(formData);

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Profile updated successfully!');
      setEditing(false);
    }

    setSaving(false);
  };

  const handleAddCompany = async () => {
    if (!newCompany.trim() || !profile) return;

    const updatedCompanies = [...(profile.applied_companies || []), newCompany.trim()];

    const { error } = await updateProfile({ applied_companies: updatedCompanies });

    if (!error) {
      setNewCompany('');
      setShowAddCompany(false);
    }
  };

  const handleRemoveCompany = async (company: string) => {
    if (!profile) return;

    const updatedCompanies = profile.applied_companies.filter((c) => c !== company);
    await updateProfile({ applied_companies: updatedCompanies });
  };

  const handleAddOffer = async () => {
    if (!newOffer.trim() || !profile) return;

    const updatedOffers = [...(profile.offers || []), newOffer.trim()];

    const { error } = await updateProfile({ offers: updatedOffers });

    if (!error) {
      setNewOffer('');
      setShowAddOffer(false);
    }
  };

  const handleRemoveOffer = async (offer: string) => {
    if (!profile) return;

    const updatedOffers = profile.offers.filter((o) => o !== offer);
    await updateProfile({ offers: updatedOffers });
  };

  if (!profile) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-gray-600">Manage your personal information and applications</p>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6"
        >
          {success}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Personal Information</h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: profile.name,
                        branch: profile.branch,
                        year: profile.year,
                        cpi: profile.cpi || 0,
                      });
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={editing ? formData.name : profile.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roll Number
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={profile.roll_number}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={editing ? formData.branch : profile.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 appearance-none"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                    <option value="EE">EE</option>
                    <option value="CE">CE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={editing ? formData.year : profile.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 appearance-none"
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CPI</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={editing ? formData.cpi : profile.cpi || 0}
                    onChange={(e) => setFormData({ ...formData, cpi: parseFloat(e.target.value) })}
                    disabled={!editing}
                    step="0.01"
                    min="0"
                    max="10"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Companies Applied
              </h2>
              <button
                onClick={() => setShowAddCompany(true)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Company
              </button>
            </div>

            {showAddCompany && (
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="Company name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddCompany}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddCompany(false);
                    setNewCompany('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="space-y-2">
              {profile.applied_companies && profile.applied_companies.length > 0 ? (
                profile.applied_companies.map((company, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                  >
                    <span className="font-medium">{company}</span>
                    <button
                      onClick={() => handleRemoveCompany(company)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No companies added yet</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Award className="w-5 h-5" />
                Offers Received
              </h2>
              <button
                onClick={() => setShowAddOffer(true)}
                className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Offer
              </button>
            </div>

            {showAddOffer && (
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newOffer}
                  onChange={(e) => setNewOffer(e.target.value)}
                  placeholder="Company name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddOffer}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddOffer(false);
                    setNewOffer('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="space-y-2">
              {profile.offers && profile.offers.length > 0 ? (
                profile.offers.map((offer, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                  >
                    <span className="font-medium">{offer}</span>
                    <button
                      onClick={() => handleRemoveOffer(offer)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No offers yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h3 className="text-center font-bold text-xl mb-1">{profile.name}</h3>
            <p className="text-center text-gray-600 mb-4">{profile.email}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Roll Number</span>
                <span className="font-semibold">{profile.roll_number}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Branch</span>
                <span className="font-semibold">{profile.branch}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Year</span>
                <span className="font-semibold">{profile.year}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">CPI</span>
                <span className="font-semibold">{profile.cpi?.toFixed(2) || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Account Settings
            </h3>
            <button
              onClick={() => setShowSignOutConfirm(true)}
              className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSignOutConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Out</h3>
              <p className="text-gray-600 mb-6 text-sm">
                Are you sure you want to sign out of your account? Any unsaved changes will be lost.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSignOutConfirm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700 text-sm"
                >
                  No, Stay
                </button>
                <button
                  onClick={async () => {
                    setShowSignOutConfirm(false);
                    await signOut();
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors text-sm"
                >
                  Yes, Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
