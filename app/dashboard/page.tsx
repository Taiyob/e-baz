/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  ShoppingBag,
  List,
  Package,
  Users,
  LogOut,
  User as UserIcon,
  MapPin,
  Settings,
  LayoutGrid,
  Plus,
  Edit,
  Trash2,
  X,
  Upload,
  Lock,
} from "lucide-react";
import { gsap } from "gsap";

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSubTab, setActiveSubTab] = useState("categories");

  // Profile States
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [updating, setUpdating] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Items Data States
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"category" | "product">(
    "category"
  );
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
    images: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch("/api/category"),
        fetch("/api/products"),
      ]);
      if (catRes.ok) setCategories(await catRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (res.ok) setProfileData({ name: data.name, email: data.email });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (activeTab === "profile") fetchProfile();
    if (activeTab === "items") fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          userId: session?.user?.id,
        }),
      });
      if (res.ok) {
        await update({ name: profileData.name });
        alert("Profile updated!");
        fetchProfile();
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword)
      return alert("Mismatch!");
    setChangingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(session?.user?.id),
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      if (res.ok) {
        alert("Password updated!");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const openModal = (type: "category" | "product", item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    setFormData({
      name: item?.name || "",
      price: type === "product" ? String(item?.price || "") : "",
      categoryId: type === "product" ? String(item?.categoryId || "") : "",
      images: item?.images || (item?.image ? [item.image] : []),
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    const endpoint =
      modalType === "category" ? "/api/category" : "/api/products";
    const method = editingItem ? "PATCH" : "POST";

    const url = editingItem ? `${endpoint}/${editingItem.id}` : endpoint;

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          categoryId: Number(formData.categoryId),
          image: formData.images[0],
        }),
      });

      if (res.ok) {
        alert(`${modalType} ${editingItem ? "updated" : "created"}!`);
        setIsModalOpen(false);
        fetchData();
      } else {
        alert("Error saving item");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    gsap.fromTo(
      ".tab-content",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
  }, [activeTab, activeSubTab]);

  if (status === "loading")
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  if (!session)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Unauthorized.
      </div>
    );

  const role = session.user?.role;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-72 border-r border-gray-800 p-8 flex flex-col gap-8">
        <h1 className="text-3xl font-black italic tracking-tighter">E-BAZ</h1>
        <nav className="flex flex-col gap-2">
          <SidebarItem
            icon={<LayoutGrid size={20} />}
            label="Overview"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <SidebarItem
            icon={<UserIcon size={20} />}
            label="Profile"
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
          <SidebarItem
            icon={isAdmin ? <List size={20} /> : <ShoppingBag size={20} />}
            label={isAdmin ? "Order List" : "My Orders"}
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
          />
          {isAdmin && (
            <SidebarItem
              icon={<Package size={20} />}
              label="Items"
              active={activeTab === "items"}
              onClick={() => {
                setActiveTab("items");
                setActiveSubTab("categories");
              }}
            />
          )}
          <SidebarItem
            icon={<MapPin size={20} />}
            label="Address"
            active={activeTab === "address"}
            onClick={() => setActiveTab("address")}
          />
          {isAdmin ? (
            <SidebarItem
              icon={<Users size={20} />}
              label="Users"
              active={activeTab === "users"}
              onClick={() => setActiveTab("users")}
            />
          ) : (
            <SidebarItem
              icon={<Settings size={20} />}
              label="Preferences"
              active={activeTab === "preferences"}
              onClick={() => setActiveTab("preferences")}
            />
          )}
        </nav>
        <button
          onClick={() => signOut({ callbackUrl: "/sign-in" })}
          className="mt-auto flex items-center gap-3 p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition font-bold"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

      <div className="flex-1 p-12 overflow-y-auto">
        <header className="mb-12">
          <h2 className="text-5xl font-black tracking-tight capitalize">
            {activeTab.replace("-", " ")}
          </h2>
          <p className="text-gray-500 mt-3 text-lg">
            Logged in as {session.user?.name} ({role})
          </p>
        </header>

        <div className="tab-content">
          {activeTab === "overview" && (
            <div className="p-10 bg-gray-900/50 rounded-3xl border border-gray-800">
              Welcome to Overview.
            </div>
          )}

          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Profile Card */}
              <div className="p-10 bg-gray-900/50 rounded-3xl border border-gray-800 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <UserIcon className="text-gray-400" size={32} />
                  <h3 className="text-3xl font-black">Personal Info</h3>
                </div>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="w-full px-6 py-4 bg-black border border-gray-800 rounded-2xl text-xl focus:border-white outline-none"
                  />
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-6 py-4 bg-black border border-gray-800 rounded-2xl text-xl opacity-50 cursor-not-allowed"
                  />
                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full py-5 bg-white text-black rounded-full font-bold hover:scale-105 transition disabled:opacity-50"
                  >
                    {updating ? "Saving..." : "Update Profile"}
                  </button>
                </form>
              </div>
              {/* Password Card */}
              <div className="p-10 bg-gray-900/50 rounded-3xl border border-gray-800 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <Lock className="text-gray-400" size={32} />
                  <h3 className="text-3xl font-black">Security</h3>
                </div>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        oldPassword: e.target.value,
                      })
                    }
                    className="w-full px-6 py-4 bg-black border border-gray-800 rounded-2xl text-xl outline-none"
                    required
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-6 py-4 bg-black border border-gray-800 rounded-2xl text-xl outline-none"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm New"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-6 py-4 bg-black border border-gray-800 rounded-2xl text-xl outline-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="w-full py-5 border border-white text-white rounded-full font-bold hover:bg-white hover:text-black transition disabled:opacity-50"
                  >
                    {changingPassword ? "Updating..." : "Change Password"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "items" && isAdmin && (
            <div>
              <div className="flex gap-12 mb-10 border-b border-gray-800 pb-4">
                {["categories", "products"].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubTab(sub)}
                    className={`text-2xl font-bold capitalize transition ${
                      activeSubTab === sub
                        ? "text-white"
                        : "text-gray-500 hover:text-white"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {activeSubTab === "categories" ? (
                <div className="space-y-10">
                  <div className="flex justify-between items-center">
                    <h3 className="text-3xl font-black">Categories</h3>
                    <button
                      onClick={() => openModal("category")}
                      className="px-6 py-3 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:scale-105 transition"
                    >
                      <Plus size={20} /> Add Category
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((cat) => (
                      <ItemCard
                        key={cat.id}
                        title={cat.name}
                        image={cat.image}
                        onEdit={() => openModal("category", cat)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="flex justify-between items-center">
                    <h3 className="text-3xl font-black">Products</h3>
                    <button
                      onClick={() => openModal("product")}
                      className="px-6 py-3 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:scale-105 transition"
                    >
                      <Plus size={20} /> Add Product
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {products.map((prod) => (
                      <ItemCard
                        key={prod.id}
                        title={prod.name}
                        subtitle={`$${prod.price}`}
                        image={prod.images?.[0]}
                        onEdit={() => openModal("product", prod)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal - Universal (Add/Edit for both) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-[40px] border border-gray-800 p-12 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-black">
                {editingItem ? "Edit" : "Add"} {modalType}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-3 hover:bg-gray-800 rounded-full transition"
              >
                <X size={28} />
              </button>
            </div>
            <div className="space-y-6">
              <input
                type="text"
                placeholder={`${modalType} Name`}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-6 py-5 bg-black border border-gray-800 rounded-2xl text-xl outline-none focus:border-white transition"
              />

              {modalType === "product" && (
                <>
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-6 py-5 bg-black border border-gray-800 rounded-2xl text-xl outline-none focus:border-white transition"
                  />
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full px-6 py-5 bg-black border border-gray-800 rounded-2xl text-xl outline-none focus:border-white transition"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <div className="border-2 border-dashed border-gray-800 rounded-3xl p-10 text-center cursor-pointer hover:border-gray-600 transition">
                <p className="text-gray-500 mb-2">Image URL</p>
                <input
                  type="text"
                  placeholder="https://image-url.com"
                  onChange={(e) =>
                    setFormData({ ...formData, images: [e.target.value] })
                  }
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 border border-gray-800 rounded-full font-bold hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 py-5 bg-white text-black rounded-full font-bold hover:scale-105 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-Components
function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
        active
          ? "bg-white text-black font-bold scale-105 shadow-xl shadow-white/10"
          : "text-gray-400 hover:text-white hover:bg-gray-900"
      }`}
    >
      {icon} <span className="text-lg">{label}</span>
    </button>
  );
}

function ItemCard({ title, subtitle, image, onEdit }: any) {
  return (
    <div className="group relative bg-gray-900/30 border border-gray-800 rounded-[32px] overflow-hidden p-4 hover:border-white/50 transition-all duration-500">
      <div className="aspect-square rounded-[24px] overflow-hidden bg-black mb-6 relative">
        <Image
          src={image || "/poster.jpg"}
          alt={title}
          fill
          className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
        />
      </div>
      <div className="px-2 pb-2">
        <h4 className="text-2xl font-black">{title}</h4>
        {subtitle && <p className="text-gray-500 font-bold mt-1">{subtitle}</p>}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onEdit}
            className="flex-1 py-3 bg-white/10 hover:bg-white hover:text-black rounded-full transition-all duration-300 font-bold flex items-center justify-center gap-2"
          >
            <Edit size={16} /> Edit
          </button>
          <button className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all duration-300">
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
