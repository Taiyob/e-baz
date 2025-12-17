'use client';

import { gsap } from 'gsap';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';

// Simple role check
const isAdmin = true;

type Category = {
  id: number;
  name: string;
  image?: string; // preview URL
};

type Product = {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  categoryName: string;
  images?: string[]; // preview URLs
};

const initialCategories: Category[] = [
  { id: 1, name: "Watches", image: "https://thumbs.dreamstime.com/b/elegant-black-luxury-watch-dark-background-minimalist-design-high-contrast-lighting-sleek-rests-against-deep-407100601.jpg" },
  { id: 2, name: "Jewelry", image: "https://media.istockphoto.com/id/1127154603/photo/interwoven-diamond-engagement-ring-wedding-ring-on-black-background.jpg?s=612x612&w=0&k=20&c=O9lGOuSwnBMc_proWPjzLdcBMgm1GJWBz3NWIwUVbes=" },
  { id: 3, name: "Accessories", image: "https://cdn.shopify.com/s/files/1/0179/8075/products/no-398-bifold-wallet-black-leather-front.jpg" },
  { id: 4, name: "Limited Edition", image: "https://thumbs.dreamstime.com/b/luxury-gold-watch-black-dial-leather-strap-dark-background-elegant-minimalist-timepiece-showcasing-precise-407840004.jpg" },
];

const initialProducts: Product[] = [
  { id: 1, name: "Chronos Master", price: 12999, categoryId: 1, categoryName: "Watches", images: ["https://thumbs.dreamstime.com/b/elegant-black-luxury-watch-dark-background-minimalist-design-high-contrast-lighting-sleek-rests-against-deep-407100601.jpg"] },
  { id: 2, name: "Eternal Ring", price: 8999, categoryId: 2, categoryName: "Jewelry", images: ["https://media.istockphoto.com/id/483048997/photo/three-stone-rings-on-black.jpg?s=612x612&w=0&k=20&c=meHNA6n_bk5eVO4cuGXnJYGxb2sF6PHnkKGUuWBMCH0="] },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState('categories');

  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState(initialProducts);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'category' | 'product'>('category');
  const [editingItem, setEditingItem] = useState<any>(null);

  const [formData, setFormData] = useState({ name: '', price: '', categoryId: '', images: [] as File[] });
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    gsap.fromTo('.tab-content', 
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
    );
  }, [activeTab, activeSubTab]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData({ ...formData, images: files });
      const previews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  const openModal = (type: 'category' | 'product', item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    if (item) {
      setFormData({
        name: item.name,
        price: type === 'product' ? String(item.price) : '',
        categoryId: type === 'product' ? String(item.categoryId) : '',
        images: []
      });
      setPreviewImages(item.images || item.image ? [item.image] : []);
    } else {
      setFormData({ name: '', price: '', categoryId: '', images: [] });
      setPreviewImages([]);
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const imagePreviews = formData.images.map(file => URL.createObjectURL(file));

    if (modalType === 'category') {
      if (editingItem) {
        setCategories(categories.map(c => c.id === editingItem.id ? { ...c, name: formData.name, image: imagePreviews[0] || c.image } : c));
      } else {
        setCategories([...categories, { id: categories.length + 1, name: formData.name, image: imagePreviews[0] }]);
      }
    } else {
      const cat = categories.find(c => c.id === Number(formData.categoryId));
      if (editingItem) {
        setProducts(products.map(p => p.id === editingItem.id ? { ...p, name: formData.name, price: Number(formData.price), categoryId: Number(formData.categoryId), categoryName: cat?.name || p.categoryName, images: imagePreviews.length > 0 ? imagePreviews : p.images } : p));
      } else {
        setProducts([...products, {
          id: products.length + 1,
          name: formData.name,
          price: Number(formData.price),
          categoryId: Number(formData.categoryId),
          categoryName: cat?.name || "Unknown",
          images: imagePreviews
        }]);
      }
    }
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ name: '', price: '', categoryId: '', images: [] });
    setPreviewImages([]);
  };

  const handleDelete = (type: 'category' | 'product', id: number) => {
    if (type === 'category') {
      setCategories(categories.filter(c => c.id !== id));
    } else {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const tabs = [
    'overview',
    'profile',
    isAdmin ? 'order-list' : 'orders',
    'items',
    'address',
    isAdmin ? 'users' : 'preferences',
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <h1 className="text-6xl md:text-8xl font-black mb-16 text-center">My Account</h1>

        {/* Main Tabs */}
        <div className="flex flex-wrap justify-center gap-8 mb-16 border-b border-gray-800 pb-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab !== 'items') setActiveSubTab('categories');
              }}
              className={`text-xl capitalize hover:text-white transition ${activeTab === tab ? 'text-white font-bold' : 'text-gray-500'}`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* ... overview, profile, orders, address, users same as before ... */}

          {activeTab === 'items' && (
            <div>
              {/* Sub Tabs */}
              <div className="flex gap-12 mb-12 border-b border-gray-800 pb-4">
                <button
                  onClick={() => setActiveSubTab('categories')}
                  className={`text-2xl font-bold ${activeSubTab === 'categories' ? 'text-white' : 'text-gray-500'} hover:text-white transition`}
                >
                  Categories
                </button>
                <button
                  onClick={() => setActiveSubTab('products')}
                  className={`text-2xl font-bold ${activeSubTab === 'products' ? 'text-white' : 'text-gray-500'} hover:text-white transition`}
                >
                  Products
                </button>
              </div>

              {/* Categories Tab */}
              {activeSubTab === 'categories' && (
                <div>
                  <div className="flex justify-between items-center mb-12">
                    <h2 className="text-4xl font-black">Categories</h2>
                    <button onClick={() => openModal('category')} className="px-8 py-4 bg-white text-black font-bold rounded-full flex items-center gap-4">
                      <Plus size={24} />
                      Add Category
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {categories.map(cat => (
                      <div key={cat.id} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-3xl aspect-square bg-gray-900 border border-gray-800">
                          {cat.image ? (
                            <img 
                              src={cat.image} 
                              alt={cat.name}
                              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">
                              {cat.name[0]}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          <h3 className="absolute bottom-8 left-8 text-4xl font-black">{cat.name}</h3>
                        </div>
                        <div className="mt-6 flex justify-center gap-6">
                          <button onClick={() => openModal('category', cat)} className="px-6 py-3 border border-gray-600 rounded-full hover:bg-gray-800 transition">Edit</button>
                          <button onClick={() => handleDelete('category', cat.id)} className="px-6 py-3 bg-red-900/50 rounded-full hover:bg-red-900 transition">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Tab */}
              {activeSubTab === 'products' && (
                <div>
                  <div className="flex justify-between items-center mb-12">
                    <h2 className="text-4xl font-black">Products</h2>
                    <button onClick={() => openModal('product')} className="px-8 py-4 bg-white text-black font-bold rounded-full flex items-center gap-4">
                      <Plus size={24} />
                      Add Product
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {products.map(product => (
                      <div key={product.id} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-3xl aspect-square bg-gray-900 border border-gray-800">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">
                              {product.name[0]}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          <div className="absolute bottom-8 left-8">
                            <h3 className="text-4xl font-black">{product.name}</h3>
                            <p className="text-2xl mt-2">${product.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="mt-6 flex justify-center gap-6">
                          <button onClick={() => openModal('product', product)} className="px-6 py-3 border border-gray-600 rounded-full hover:bg-gray-800 transition">Edit</button>
                          <button onClick={() => handleDelete('product', product.id)} className="px-6 py-3 bg-red-900/50 rounded-full hover:bg-red-900 transition">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ... other tabs same ... */}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
          <div className="bg-gray-900 rounded-3xl border border-gray-800 p-12 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-black">
                {editingItem ? 'Edit' : 'Add'} {modalType === 'category' ? 'Category' : 'Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-800 rounded-full">
                <X size={32} />
              </button>
            </div>

            <div className="space-y-8">
              <input
                type="text"
                placeholder={modalType === 'category' ? 'Category Name' : 'Product Name'}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-4 bg-gray-800 rounded-xl text-xl"
              />

              {modalType === 'product' && (
                <>
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-800 rounded-xl text-xl"
                  />
                  <select
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-800 rounded-xl text-xl"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </>
              )}

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-xl mb-4">Upload Images</label>
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-600 rounded-3xl cursor-pointer hover:border-white transition">
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <Upload size={48} className="mb-4" />
                  <p>Click to upload multiple images</p>
                </label>

                {previewImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-8">
                    {previewImages.map((src, i) => (
                      <img key={i} src={src} alt="preview" className="w-full h-32 object-cover rounded-xl" />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 border border-gray-600 rounded-full hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}