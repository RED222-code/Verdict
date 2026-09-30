import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { reviewsApi } from '../api/reviews';
import { usersApi } from '../api/users';
import { useToast } from '../context/ToastContext';
import { ProductModal } from '../components/admin/ProductModal';
import { UserModal } from '../components/admin/UserModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Button } from '../components/ui/Button';
import { RatingStars } from '../components/ui/RatingStars';
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Users,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Star,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'reviews' | 'users'
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const [reviewToDelete, setReviewToDelete] = useState(null);

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Queries
  const { data: productStats, isLoading: loadingProductStats } = useQuery({
    queryKey: ['productStats'],
    queryFn: productsApi.getProductStats,
  });

  const { data: categoryStats } = useQuery({
    queryKey: ['categoryStats'],
    queryFn: productsApi.getCategoryStats,
  });

  const { data: reviewStats } = useQuery({
    queryKey: ['reviewStats'],
    queryFn: reviewsApi.getReviewStats,
  });

  const { data: allProducts, isLoading: loadingProducts } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: () => productsApi.getProducts({ sort: '-dateCreated', limit: 100 }),
    enabled: activeTab === 'products' || activeTab === 'overview',
  });

  const { data: allReviews, isLoading: loadingReviews } = useQuery({
    queryKey: ['adminReviews'],
    queryFn: () => reviewsApi.getReviews({ sort: '-dateCreated', limit: 100 }),
    enabled: activeTab === 'reviews',
  });

  const { data: allUsers, isLoading: loadingUsers } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => usersApi.getUsers({ limit: 100 }),
    enabled: activeTab === 'users' || activeTab === 'overview',
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (id) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['productStats'] });
      queryClient.invalidateQueries({ queryKey: ['categoryStats'] });
      showToast('Product deleted from database.');
      setProductToDelete(null);
    },
    onError: (err) => showToast(err.message || 'Failed to delete product', 'error'),
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: (id) => reviewsApi.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviewStats'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showToast('Review removed by moderator.');
      setReviewToDelete(null);
    },
    onError: (err) => showToast(err.message || 'Failed to delete review', 'error'),
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      showToast('User account removed.');
      setUserToDelete(null);
    },
    onError: (err) => showToast(err.message || 'Failed to delete user', 'error'),
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Hardware Products', icon: Package, count: allProducts?.length },
    { id: 'reviews', label: 'Review Moderation', icon: MessageSquare, count: allReviews?.length },
    { id: 'users', label: 'User Directory', icon: Users, count: allUsers?.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold">
            <ShieldCheck className="w-4 h-4" /> Editorial Governance Console
          </div>
          <h1 className="text-3xl font-extrabold font-display text-white mt-1">
            Platform Administration
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => {
              setSelectedProduct(null);
              setProductModalOpen(true);
            }}
          >
            New Hardware Entry
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-white/5 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold font-mono tracking-wider uppercase transition-colors shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-300'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-[#12151e] border border-white/10 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider">Catalog Inventory</span>
                <Package className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">
                {productStats?.productCount || allProducts?.length || 0}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Total indexed hardware</span>
            </div>

            <div className="p-6 bg-[#12151e] border border-white/10 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider">Total Verdicts</span>
                <MessageSquare className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">
                {reviewStats?.summary?.reviewCount || productStats?.totalRatings || 0}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Verified community reviews</span>
            </div>

            <div className="p-6 bg-[#12151e] border border-white/10 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider">Platform Avg Score</span>
                <Star className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold text-amber-400 font-mono">
                {Number(reviewStats?.summary?.averageRating || productStats?.averageRating || 0).toFixed(1)}★
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Live aggregated rating</span>
            </div>

            <div className="p-6 bg-[#12151e] border border-white/10 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider">Registered Accounts</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">
                {allUsers?.length || 1}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Curators & reviewers</span>
            </div>
          </div>

          {/* Pricing Insights */}
          {productStats && (
            <div className="p-6 bg-[#12151e] border border-white/10 rounded-2xl">
              <h3 className="text-base font-bold font-display text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Hardware Valuation Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
                <div className="p-4 bg-[#0d0f17] rounded-xl border border-white/5">
                  <span className="text-slate-400 block mb-1">Average Unit Price</span>
                  <span className="text-xl font-bold text-white">${Number(productStats.averagePrice || 0).toFixed(2)}</span>
                </div>
                <div className="p-4 bg-[#0d0f17] rounded-xl border border-white/5">
                  <span className="text-slate-400 block mb-1">Lowest Priced Hardware</span>
                  <span className="text-xl font-bold text-emerald-400">${Number(productStats.minimumPrice || 0).toFixed(2)}</span>
                </div>
                <div className="p-4 bg-[#0d0f17] rounded-xl border border-white/5">
                  <span className="text-slate-400 block mb-1">Flagship Max Price</span>
                  <span className="text-xl font-bold text-amber-400">${Number(productStats.maximumPrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Category Aggregations */}
          {categoryStats && categoryStats.length > 0 && (
            <div className="p-6 bg-[#12151e] border border-white/10 rounded-2xl">
              <h3 className="text-base font-bold font-display text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Category Distribution & Dynamics
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Catalog Count</th>
                      <th className="py-3 px-4">Average Price</th>
                      <th className="py-3 px-4">Average Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {categoryStats.map((cat) => (
                      <tr key={cat.category} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">{cat.category}</td>
                        <td className="py-3.5 px-4">{cat.productCount}</td>
                        <td className="py-3.5 px-4">${Number(cat.averagePrice).toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-amber-400 font-bold">
                          {Number(cat.averageRating || 0).toFixed(1)}★
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-white">
              Catalog Items ({allProducts?.length || 0})
            </h3>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => {
                setSelectedProduct(null);
                setProductModalOpen(true);
              }}
            >
              Add Product
            </Button>
          </div>

          <div className="bg-[#12151e] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider bg-[#0d0f16]">
                    <th className="py-3.5 px-4">Item</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {allProducts && allProducts.length > 0 ? (
                    allProducts.map((p) => {
                      const isAvailable = p.availabilityStatus === 'available';
                      return (
                        <tr key={p._id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#0a0d14] border border-white/10 overflow-hidden shrink-0">
                                {p.coverImageName ? (
                                  <img src={p.coverImageName} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">N/A</div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <span className="font-semibold text-white font-sans text-sm line-clamp-1 block">
                                  {p.name}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  ID: {p._id}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-amber-400 font-semibold">
                            {p.category}
                          </td>

                          <td className="py-3.5 px-4 font-bold text-white">
                            ${Number(p.price).toLocaleString()}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${
                              isAvailable ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                            }`}>
                              {p.availabilityStatus} ({p.quantityAvailable})
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-amber-400 font-bold">{Number(p.averageRating || 0).toFixed(1)}★</span>
                            <span className="text-slate-500 ml-1">({p.numberOfRatings || 0})</span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                title="Edit Product"
                                onClick={() => {
                                  setSelectedProduct(p);
                                  setProductModalOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                title="Delete Product"
                                onClick={() => setProductToDelete(p)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-500">
                        No products available in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REVIEW MODERATION */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-white">
              Platform Reviews ({allReviews?.length || 0})
            </h3>
          </div>

          <div className="space-y-4">
            {allReviews && allReviews.length > 0 ? (
              allReviews.map((rev) => {
                const reviewer = rev.userId || {};
                const product = rev.productId || {};
                const revDate = rev.dateCreated
                  ? new Date(rev.dateCreated).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '';

                return (
                  <div key={rev._id} className="p-6 bg-[#12151e] border border-white/10 rounded-2xl flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-amber-500 font-mono font-semibold">
                            Product: {product.name || 'Unknown'}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs text-slate-400 font-mono">
                            By {reviewer.name || 'Anonymous'} ({reviewer.email || 'No email'})
                          </span>
                        </div>
                        <h4 className="text-base font-bold font-display text-white mt-1">
                          {rev.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <RatingStars rating={rev.rating} size="sm" />
                        <span className="text-xs font-mono text-slate-500">{revDate}</span>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => setReviewToDelete(rev)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-slate-500">
                No reviews found on the platform.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-white">
              User Directory ({allUsers?.length || 0})
            </h3>
          </div>

          <div className="bg-[#12151e] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider bg-[#0d0f16]">
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {allUsers && allUsers.length > 0 ? (
                    allUsers.map((u) => {
                      const joinDate = u.dateCreated
                        ? new Date(u.dateCreated).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—';
                      return (
                        <tr key={u._id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white font-sans text-sm">{u.name}</td>
                          <td className="py-3.5 px-4 text-slate-400">{u.email}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] ${
                              u.role === 'admin'
                                ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
                                : 'bg-white/10 text-slate-300'
                            }`}>
                              {u.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">{joinDate}</td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                title="Edit User Privileges"
                                onClick={() => {
                                  setSelectedUser(u);
                                  setUserModalOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                title="Delete User"
                                onClick={() => setUserToDelete(u)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-500">
                        No users loaded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal (Create/Edit) */}
      <ProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        product={selectedProduct}
      />

      {/* User Modal (Edit Role) */}
      <UserModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        user={selectedUser}
      />

      {/* Delete Product Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => deleteProductMutation.mutate(productToDelete?._id)}
        title="Delete hardware item?"
        message={`Are you sure you want to permanently delete "${productToDelete?.name}"? All associated reviews will remain in the database or will be orphaned.`}
        confirmText="Delete Product"
        isLoading={deleteProductMutation.isPending}
      />

      {/* Delete Review Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(reviewToDelete)}
        onClose={() => setReviewToDelete(null)}
        onConfirm={() => deleteReviewMutation.mutate(reviewToDelete?._id)}
        title="Remove inappropriate review?"
        message={`Are you sure you want to remove the review "${reviewToDelete?.title}"? Product ratings will be automatically updated.`}
        confirmText="Remove Review"
        isLoading={deleteReviewMutation.isPending}
      />

      {/* Delete User Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => deleteUserMutation.mutate(userToDelete?._id)}
        title="Delete user account?"
        message={`Are you sure you want to permanently delete user "${userToDelete?.name}" (${userToDelete?.email})?`}
        confirmText="Delete Account"
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  );
}
