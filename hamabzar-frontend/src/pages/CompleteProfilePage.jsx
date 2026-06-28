import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../services/api";

const initialForm = {
  first_name: "",
  last_name: "",
  national_code: "",
  email: "",
  address: "",
  city: "",
  province: "",
  date_of_birth: "",
};

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getUserProfile();

        setForm({
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          national_code: profile.national_code || "",
          email: profile.email || "",
          address: profile.address || "",
          city: profile.city || "",
          province: profile.province || "",
          date_of_birth: profile.date_of_birth || "",
        });
      } catch (err) {
        setError("خطا در دریافت اطلاعات پروفایل");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isProfileValid = () => {
    return (
      form.first_name.trim() &&
      form.last_name.trim() &&
      form.national_code.trim()
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!isProfileValid()) {
      setError("نام، نام خانوادگی و کد ملی الزامی هستند");
      return;
    }

    try {
      setSaving(true);
      await updateUserProfile(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError("خطا در ذخیره اطلاعات پروفایل");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          تکمیل مشخصات
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          برای ادامه استفاده از هم‌ابزار، لطفاً اطلاعات اصلی خود را تکمیل کنید.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              نام
            </label>
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              نام خانوادگی
            </label>
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              کد ملی
            </label>
            <input
              name="national_code"
              value={form.national_code}
              onChange={handleChange}
              maxLength={10}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              ایمیل
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              استان
            </label>
            <input
              name="province"
              value={form.province}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              شهر
            </label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              تاریخ تولد
            </label>
            <input
              name="date_of_birth"
              type="date"
              value={form.date_of_birth}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              آدرس
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="md:col-span-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "در حال ذخیره..." : "ذخیره و ادامه"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
