'use client';

import { useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Chronos Master", price: 12999, description: "Timeless watch", category: "Watches", images: [] },
    { id: 2, name: "Eternal Ring", price: 8999, description: "Diamond ring", category: "Jewelry", images: [] },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Watches',
    images: [] as File[]
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewProduct({ ...newProduct, images: Array.from(e.target.files) });
    }
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      const product: Product = {
        id: products.length + 1,
        name: newProduct.name,
        price: Number(newProduct.price),
        description: newProduct.description,
        category: newProduct.category,
        images: newProduct.images.map(file => URL.createObjectURL(file))
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', price: '', description: '', category: 'Watches', images: [] });
      setIsAdding(false);
    }
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <h1 className="text-6xl md:text-8xl font-black mb-16">Admin Dashboard</h1>

        <button
          onClick={() => setIsAdding(true)}
          className="mb-12 px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition flex items-center gap-4"
        >
          <Plus size={24} />
          Add New Product
        </button>

        {/* Add Product Form */}
        {isAdding && (
          <div className="mb-16 p-8 bg-gray-900 rounded-3xl border border-gray-800">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-black">New Product</h2>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-800 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="px-6 py-4 bg-gray-800 rounded-xl text-xl"
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="px-6 py-4 bg-gray-800 rounded-xl text-xl"
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="px-6 py-4 bg-gray-800 rounded-xl text-xl"
              >
                <option>Watches</option>
                <option>Jewelry</option>
                <option>Accessories</option>
                <option>Limited Edition</option>
              </select>
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="px-6 py-4 bg-gray-800 rounded-xl text-xl md:col-span-2 h-32"
              />

              <div className="md:col-span-2">
                <label className="block mb-4 text-xl">Upload Images</label>
                <label className="flex items-center justify-center w-full h-64 border-2 border-dashed border-gray-600 rounded-3xl cursor-pointer hover:border-white transition">
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <div className="text-center">
                    <Upload size={48} className="mx-auto mb-4" />
                    <p>Click to upload images</p>
                  </div>
                </label>
                {newProduct.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-8">
                    {newProduct.images.map((file, i) => (
                      <img key={i} src={URL.createObjectURL(file)} alt="preview" className="w-full h-32 object-cover rounded-xl" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleAddProduct}
              className="mt-8 px-12 py-6 bg-white text-black font-bold rounded-full hover:scale-105 transition"
            >
              Add Product
            </button>
          </div>
        )}

        {/* Products List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map(product => (
            <div key={product.id} className="bg-gray-900 rounded-3xl border border-gray-800 p-8">
              <div className="aspect-square bg-gray-800 rounded-xl mb-6 flex items-center justify-center text-6xl opacity-20">
                {product.name[0]}
              </div>
              <h3 className="text-3xl font-black mb-2">{product.name}</h3>
              <p className="text-xl opacity-70 mb-4">${product.price.toLocaleString()}</p>
              <p className="text-lg opacity-60 mb-6">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="px-4 py-2 bg-gray-800 rounded-full text-sm">{product.category}</span>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-6 py-3 bg-red-900/50 hover:bg-red-900 rounded-full transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}