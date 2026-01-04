import { supabase } from "../lib/supabase";
import {
  generateSlug,
  calculateDiscountPercent,
} from "../constants/databaseConstants";

// ============ PRODUCTS SERVICE (products table) ============
export const productsService = {
  // Get all products with filters
  async getAllProducts(filters = {}) {
    try {
      let query = supabase.from("products").select("*");

      // Apply filters
      if (filters.status !== undefined) {
        query = query.eq("status", filters.status);
      }

      if (filters.platform) {
        query = query.eq("platform", filters.platform);
      }

      if (filters.category_id) {
        query = query.eq("category_id", filters.category_id);
      }

      if (filters.is_featured !== undefined) {
        query = query.eq("is_featured", filters.is_featured);
      }

      if (filters.is_affiliate !== undefined) {
        query = query.eq("is_affiliate", filters.is_affiliate);
      }

      if (filters.min_price !== undefined) {
        query = query.gte("price", filters.min_price);
      }

      if (filters.max_price !== undefined) {
        query = query.lte("price", filters.max_price);
      }

      if (filters.min_rating !== undefined) {
        query = query.gte("rating", filters.min_rating);
      }

      if (filters.availability_status) {
        query = query.eq("availability_status", filters.availability_status);
      }

      // Default ordering
      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get product by ID
  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("products_id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  // Get product by slug
  async getProductBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching product by slug:", error);
      throw error;
    }
  },

  // Create new product
  async createProduct(productData) {
    try {
      // Generate slug if not provided
      if (!productData.slug && productData.name) {
        productData.slug =
          generateSlug(productData.name) + "-" + Date.now().toString(36);
      }

      // Calculate discount if original price provided
      if (productData.original_price && productData.price) {
        const original = parseFloat(productData.original_price);
        const current = parseFloat(productData.price);
        if (original > current) {
          productData.discount_percent = calculateDiscountPercent(
            original,
            current
          );
        }
      }

      // Set default values
      const productWithDefaults = {
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: productData.status || 1,
        availability_status: productData.availability_status || "in_stock",
        moderation_status: productData.moderation_status || "approved",
        view_count: 0,
        click_count: 0,
        is_affiliate: !!productData.affiliate_link,
      };

      const { data, error } = await supabase
        .from("products")
        .insert([productWithDefaults])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Update product
  async updateProduct(id, updates) {
    try {
      // Recalculate discount if prices are updated
      if (updates.original_price !== undefined || updates.price !== undefined) {
        const { data: existingProduct } = await supabase
          .from("products")
          .select("original_price, price")
          .eq("products_id", id)
          .single();

        const originalPrice =
          updates.original_price !== undefined
            ? parseFloat(updates.original_price)
            : parseFloat(existingProduct?.original_price);

        const currentPrice =
          updates.price !== undefined
            ? parseFloat(updates.price)
            : parseFloat(existingProduct?.price);

        if (originalPrice && currentPrice && originalPrice > currentPrice) {
          updates.discount_percent = calculateDiscountPercent(
            originalPrice,
            currentPrice
          );
        } else {
          updates.discount_percent = null;
        }
      }

      // Update is_affiliate based on affiliate_link
      if (updates.affiliate_link !== undefined) {
        updates.is_affiliate = !!updates.affiliate_link;
      }

      const { data, error } = await supabase
        .from("products")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("products_id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("products_id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // Search products
  async searchProducts(searchTerm, filters = {}) {
    try {
      let query = supabase
        .from("products")
        .select("*")
        .or(
          `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category_id.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`
        );

      // Apply additional filters
      if (filters.category_id) {
        query = query.eq("category_id", filters.category_id);
      }

      if (filters.platform) {
        query = query.eq("platform", filters.platform);
      }

      if (filters.min_price !== undefined) {
        query = query.gte("price", filters.min_price);
      }

      if (filters.max_price !== undefined) {
        query = query.lte("price", filters.max_price);
      }

      if (filters.min_rating !== undefined) {
        query = query.gte("rating", filters.min_rating);
      }

      if (filters.status !== undefined) {
        query = query.eq("status", filters.status);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },

  // Get featured products
  async getFeaturedProducts(limit = 10) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .eq("status", 1)
        .eq("moderation_status", "approved")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  },

  // Get products by platform
  async getProductsByPlatform(platform, limit = 20) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("platform", platform)
        .eq("status", 1)
        .eq("moderation_status", "approved")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching products by platform:", error);
      throw error;
    }
  },

  // Get products by category
  async getProductsByCategory(category, limit = 20) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", category)
        .eq("status", 1)
        .eq("moderation_status", "approved")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  },

  // Get related products
  async getRelatedProducts(productId, limit = 5) {
    try {
      // First get the product to find its category
      const { data: product } = await supabase
        .from("products")
        .select("category_id, platform")
        .eq("products_id", productId)
        .single();

      if (!product) return [];

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", product.category_id)
        .eq("status", 1)
        .eq("moderation_status", "approved")
        .neq("products_id", productId)
        .order("rating", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching related products:", error);
      throw error;
    }
  },

  // Increment view count
  async incrementViewCount(productId) {
    try {
      const { data, error } = await supabase.rpc("increment_product_view", {
        product_id: productId,
      });

      if (error) {
        // Fallback if function doesn't exist
        const { data: product } = await supabase
          .from("products")
          .select("view_count")
          .eq("products_id", productId)
          .single();

        await supabase
          .from("products")
          .update({
            view_count: (product?.view_count || 0) + 1,
            last_viewed_at: new Date().toISOString(),
          })
          .eq("products_id", productId);
      }

      return true;
    } catch (error) {
      console.error("Error incrementing view count:", error);
      throw error;
    }
  },

  // Increment click count
  async incrementClickCount(productId) {
    try {
      const { data, error } = await supabase.rpc("increment_product_click", {
        product_id: productId,
      });

      if (error) {
        // Fallback if function doesn't exist
        const { data: product } = await supabase
          .from("products")
          .select("click_count")
          .eq("products_id", productId)
          .single();

        await supabase
          .from("products")
          .update({
            click_count: (product?.click_count || 0) + 1,
            last_clicked_at: new Date().toISOString(),
          })
          .eq("products_id", productId);
      }

      return true;
    } catch (error) {
      console.error("Error incrementing click count:", error);
      throw error;
    }
  },

  // Get product statistics
  async getProductStats() {
    try {
      const [
        totalProducts,
        activeProducts,
        affiliateProducts,
        featuredProducts,
        avgRating,
        totalValue,
      ] = await Promise.all([
        supabase.from("products").select("count", { count: "exact" }),
        supabase
          .from("products")
          .select("count", { count: "exact" })
          .eq("status", 1),
        supabase
          .from("products")
          .select("count", { count: "exact" })
          .eq("is_affiliate", true),
        supabase
          .from("products")
          .select("count", { count: "exact" })
          .eq("is_featured", true),
        supabase.from("products").select("rating"),
        supabase.from("products").select("price"),
      ]);

      const ratings = avgRating.data || [];
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, p) => sum + (p.rating || 0), 0) /
            ratings.length
          : 0;

      const prices = totalValue.data || [];
      const totalProductValue = prices.reduce(
        (sum, p) => sum + (parseFloat(p.price) || 0),
        0
      );

      const platforms = await supabase.from("products").select("platform");

      const uniquePlatforms = [
        ...new Set((platforms.data || []).map((p) => p.platform)),
      ];

      return {
        total: totalProducts.count || 0,
        active: activeProducts.count || 0,
        affiliate: affiliateProducts.count || 0,
        featured: featuredProducts.count || 0,
        avgRating: parseFloat(averageRating.toFixed(1)),
        totalValue: parseFloat(totalProductValue.toFixed(2)),
        platforms: uniquePlatforms.length,
        categories: await this.getCategoryStats(),
      };
    } catch (error) {
      console.error("Error fetching product stats:", error);
      return {
        total: 0,
        active: 0,
        affiliate: 0,
        featured: 0,
        avgRating: 0,
        totalValue: 0,
        platforms: 0,
        categories: [],
      };
    }
  },

  // Get category statistics
  async getCategoryStats() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("category_id, products_id")
        .eq("status", 1);

      if (error) throw error;

      const categoryCounts = {};
      (data || []).forEach((product) => {
        const category = product.category_id || "Uncategorized";
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      return Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error("Error fetching category stats:", error);
      return [];
    }
  },

  // Get platform statistics
  async getPlatformStats() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("platform, products_id")
        .eq("status", 1);

      if (error) throw error;

      const platformCounts = {};
      (data || []).forEach((product) => {
        const platform = product.platform || "other";
        platformCounts[platform] = (platformCounts[platform] || 0) + 1;
      });

      return Object.entries(platformCounts)
        .map(([platform, count]) => ({ platform, count }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error("Error fetching platform stats:", error);
      return [];
    }
  },

  // Bulk update products
  async bulkUpdateProducts(productIds, updates) {
    try {
      const { data, error } = await supabase
        .from("products")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .in("products_id", productIds)
        .select();

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error bulk updating products:", error);
      throw error;
    }
  },

  // Get trending products
  async getTrendingProducts(limit = 10, days = 7) {
    try {
      const date = new Date();
      date.setDate(date.getDate() - days);

      // This would typically involve the product_views table
      // For now, we'll get products with highest view counts
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", 1)
        .eq("moderation_status", "approved")
        .order("view_count", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching trending products:", error);
      throw error;
    }
  },

  // Get best selling products (based on clicks)
  async getBestSellingProducts(limit = 10) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", 1)
        .eq("moderation_status", "approved")
        .order("click_count", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching best selling products:", error);
      throw error;
    }
  },

  // Get products with discounts
  async getDiscountedProducts(limit = 10) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", 1)
        .eq("moderation_status", "approved")
        .not("discount_percent", "is", null)
        .order("discount_percent", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching discounted products:", error);
      throw error;
    }
  },

  // Get newest products
  async getNewestProducts(limit = 10) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", 1)
        .eq("moderation_status", "approved")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching newest products:", error);
      throw error;
    }
  },
};

// ============ PRODUCT CATEGORIES SERVICE ============
export const productCategoriesService = {
  // Get all categories
  async getAllCategories() {
    try {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback to default categories
      return [
        { category_id: "supplements", name: "Supplements", display_order: 1 },
        { category_id: "equipment", name: "Equipment", display_order: 2 },
        { category_id: "apparel", name: "Apparel", display_order: 3 },
        { category_id: "technology", name: "Technology", display_order: 4 },
        { category_id: "nutrition", name: "Nutrition", display_order: 5 },
      ];
    }
  },

  // Get category by ID
  async getCategoryById(id) {
    try {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .eq("category_id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  },

  // Create category
  async createCategory(categoryData) {
    try {
      const { data, error } = await supabase
        .from("product_categories")
        .insert([
          {
            ...categoryData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // Update category
  async updateCategory(id, updates) {
    try {
      const { data, error } = await supabase
        .from("product_categories")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("category_id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  // Delete category
  async deleteCategory(id) {
    try {
      const { error } = await supabase
        .from("product_categories")
        .delete()
        .eq("category_id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },
};

// ============ PRODUCT VIEWS SERVICE ============
export const productViewsService = {
  // Track product view
  async trackView(
    productId,
    userId = null,
    sessionId = null,
    userAgent = null,
    ipAddress = null,
    referrer = null
  ) {
    try {
      // First increment the product's view count
      await productsService.incrementViewCount(productId);

      // Then log the view in the views table
      const { data, error } = await supabase
        .from("product_views")
        .insert([
          {
            product_id: productId,
            user_id: userId,
            session_id: sessionId,
            user_agent: userAgent,
            ip_address: ipAddress,
            referrer: referrer,
            viewed_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error tracking product view:", error);
      // Still increment view count even if logging fails
      await productsService.incrementViewCount(productId);
      throw error;
    }
  },

  // Get views for a product
  async getProductViews(productId, limit = 100) {
    try {
      const { data, error } = await supabase
        .from("product_views")
        .select("*")
        .eq("product_id", productId)
        .order("viewed_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching product views:", error);
      throw error;
    }
  },

  // Get views statistics
  async getViewsStats(days = 30) {
    try {
      const date = new Date();
      date.setDate(date.getDate() - days);

      const { data, error } = await supabase
        .from("product_views")
        .select("*")
        .gte("viewed_at", date.toISOString());

      if (error) throw error;

      // Calculate daily views
      const dailyViews = {};
      (data || []).forEach((view) => {
        const date = new Date(view.viewed_at).toISOString().split("T")[0];
        dailyViews[date] = (dailyViews[date] || 0) + 1;
      });

      // Calculate top products
      const productViews = {};
      (data || []).forEach((view) => {
        productViews[view.product_id] =
          (productViews[view.product_id] || 0) + 1;
      });

      const topProducts = Object.entries(productViews)
        .map(([productId, count]) => ({ product_id: productId, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        totalViews: data?.length || 0,
        dailyViews: Object.entries(dailyViews).map(([date, count]) => ({
          date,
          count,
        })),
        topProducts,
      };
    } catch (error) {
      console.error("Error fetching views stats:", error);
      return {
        totalViews: 0,
        dailyViews: [],
        topProducts: [],
      };
    }
  },
};

// ============ PRODUCT CLICKS SERVICE ============
export const productClicksService = {
  // Track product click
  async trackClick(
    productId,
    userId = null,
    userAgent = null,
    ipAddress = null,
    referralSource = null
  ) {
    try {
      // First increment the product's click count
      await productsService.incrementClickCount(productId);

      // Then log the click in the clicks table
      const { data, error } = await supabase
        .from("product_clicks")
        .insert([
          {
            product_id: productId,
            user_id: userId,
            user_agent: userAgent,
            ip_address: ipAddress,
            referral_source: referralSource,
            clicked_at: new Date().toISOString(),
            conversion_status: "clicked",
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error tracking product click:", error);
      // Still increment click count even if logging fails
      await productsService.incrementClickCount(productId);
      throw error;
    }
  },

  // Update click to conversion
  async updateToConversion(clickId, conversionValue = null) {
    try {
      const { data, error } = await supabase
        .from("product_clicks")
        .update({
          conversion_status: "converted",
          conversion_value: conversionValue,
          updated_at: new Date().toISOString(),
        })
        .eq("click_id", clickId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating click to conversion:", error);
      throw error;
    }
  },

  // Get clicks for a product
  async getProductClicks(productId, limit = 100) {
    try {
      const { data, error } = await supabase
        .from("product_clicks")
        .select("*")
        .eq("product_id", productId)
        .order("clicked_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching product clicks:", error);
      throw error;
    }
  },

  // Get clicks statistics
  async getClicksStats(days = 30) {
    try {
      const date = new Date();
      date.setDate(date.getDate() - days);

      const { data, error } = await supabase
        .from("product_clicks")
        .select("*")
        .gte("clicked_at", date.toISOString());

      if (error) throw error;

      // Calculate click-through rate (would need total views)
      const conversionClicks = (data || []).filter(
        (click) => click.conversion_status === "converted"
      ).length;

      // Calculate revenue
      const totalRevenue = (data || []).reduce(
        (sum, click) => sum + (click.conversion_value || 0),
        0
      );

      // Calculate top converting products
      const productClicks = {};
      const productRevenue = {};

      (data || []).forEach((click) => {
        productClicks[click.product_id] =
          (productClicks[click.product_id] || 0) + 1;
        if (click.conversion_value) {
          productRevenue[click.product_id] =
            (productRevenue[click.product_id] || 0) + click.conversion_value;
        }
      });

      const topProducts = Object.entries(productClicks)
        .map(([productId, count]) => ({
          product_id: productId,
          clicks: count,
          revenue: productRevenue[productId] || 0,
          conversionRate: 0, // Would need view data
        }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      return {
        totalClicks: data?.length || 0,
        conversions: conversionClicks,
        conversionRate: data?.length
          ? ((conversionClicks / data.length) * 100).toFixed(2)
          : 0,
        totalRevenue,
        topProducts,
      };
    } catch (error) {
      console.error("Error fetching clicks stats:", error);
      return {
        totalClicks: 0,
        conversions: 0,
        conversionRate: 0,
        totalRevenue: 0,
        topProducts: [],
      };
    }
  },
};

// ============ PRODUCT IMPORT/SCRAPING SERVICE ============
export const productImportService = {
  // Import product from URL (simulated for now)
  async importFromUrl(url, platform = null) {
    try {
      console.log("Simulating import from URL:", url);

      // In a real implementation, you would:
      // 1. Call your scraping backend API
      // 2. Parse the product data
      // 3. Return structured data

      // For now, return mock data based on platform
      const mockData = {
        name: "Sample Product from " + (platform || "website"),
        description: "This product was imported from an external platform.",
        price: 99.99,
        original_price: 129.99,
        currency: "USD",
        platform: platform || "other",
        product_url: url,
        image_url:
          "https://images.unsplash.com/photo-1594736797933-d0f9593a283d?w=400&h=400&fit=crop",
        availability_status: "in_stock",
        shipping_info: "Free shipping available",
        features: "• Imported product\n• High quality\n• Best value",
        success: true,
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return mockData;
    } catch (error) {
      console.error("Error importing product:", error);
      throw error;
    }
  },

  // Batch import products
  async batchImport(urls, platform = null) {
    try {
      const results = [];

      for (const url of urls) {
        try {
          const productData = await this.importFromUrl(url, platform);
          results.push({
            url,
            success: true,
            data: productData,
          });
        } catch (error) {
          results.push({
            url,
            success: false,
            error: error.message,
          });
        }

        // Delay between requests to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      return results;
    } catch (error) {
      console.error("Error in batch import:", error);
      throw error;
    }
  },
};

// ============ USERS SERVICE (users table) ============
export const usersService = {
  // Get all users
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Get user by ID
  async getUserById(id) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  // Create new user
  async createUser(userData) {
    try {
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            ...userData,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Update user
  async updateUser(id, updates) {
    try {
      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("user_id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  // Delete user
  async deleteUser(id) {
    try {
      const { error } = await supabase.from("users").delete().eq("user_id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  // Search users
  async searchUsers(searchTerm) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  },
};

// ============ SERVICES SERVICE (services table) ============
export const servicesService = {
  // Get all services
  async getAllServices() {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  },

  // Get service by ID
  async getServiceById(id) {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("services_id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching service:", error);
      throw error;
    }
  },

  // Create new service
  async createService(serviceData) {
    try {
      const { data, error } = await supabase
        .from("services")
        .insert([
          {
            ...serviceData,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  },

  // Update service
  async updateService(id, updates) {
    try {
      const { data, error } = await supabase
        .from("services")
        .update(updates)
        .eq("services_id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating service:", error);
      throw error;
    }
  },

  // Delete service
  async deleteService(id) {
    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("services_id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  },
};

// ============ TEAM MEMBERS SERVICE (members table) ============
export const teamMembersService = {
  // Get all team members
  async getAllTeamMembers() {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching team members:", error);
      throw error;
    }
  },

  // Get team member by ID
  async getTeamMemberById(id) {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("member_id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching team member:", error);
      throw error;
    }
  },

  // Create new team member
  async createTeamMember(memberData) {
    try {
      const { data, error } = await supabase
        .from("members")
        .insert([
          {
            ...memberData,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating team member:", error);
      throw error;
    }
  },

  // Update team member
  async updateTeamMember(id, updates) {
    try {
      const { data, error } = await supabase
        .from("members")
        .update(updates)
        .eq("member_id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating team member:", error);
      throw error;
    }
  },

  // Delete team member
  async deleteTeamMember(id) {
    try {
      const { error } = await supabase
        .from("members")
        .delete()
        .eq("member_id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting team member:", error);
      throw error;
    }
  },
};

// ============ SUBSCRIBED CLIENTS SERVICE (client table) ============
export const subscribedClientsService = {
  // Get all clients
  async getAllClients() {
    try {
      const { data, error } = await supabase
        .from("client")
        .select("*")
        .order("start_date", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
  },

  // Get client by ID
  async getClientById(id) {
    try {
      const { data, error } = await supabase
        .from("client")
        .select("*")
        .eq("client_id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching client:", error);
      throw error;
    }
  },

  // Create new client
  async createClient(clientData) {
    try {
      const { data, error } = await supabase
        .from("client")
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating client:", error);
      throw error;
    }
  },

  // Update client
  async updateClient(id, updates) {
    try {
      const { data, error } = await supabase
        .from("client")
        .update(updates)
        .eq("client_id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating client:", error);
      throw error;
    }
  },

  // Delete client
  async deleteClient(id) {
    try {
      const { error } = await supabase
        .from("client")
        .delete()
        .eq("client_id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting client:", error);
      throw error;
    }
  },

  // Get clients by status
  async getClientsByStatus(status) {
    try {
      const { data, error } = await supabase
        .from("client")
        .select("*")
        .eq("status", status)
        .order("start_date", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching clients by status:", error);
      throw error;
    }
  },
};

// ============ BLOG POSTS SERVICE (blog-post table) ============
export const blogPostsService = {
  // Get all blog posts
  async getAllBlogPosts() {
    try {
      const { data, error } = await supabase
        .from("blog-post")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      throw error;
    }
  },

  // Get blog post by ID
  async getBlogPostById(id) {
    try {
      const { data, error } = await supabase
        .from("blog-post")
        .select("*")
        .eq("blog_id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching blog post:", error);
      throw error;
    }
  },

  // Create new blog post
  async createBlogPost(postData) {
    try {
      const { data, error } = await supabase
        .from("blog-post")
        .insert([
          {
            ...postData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw error;
    }
  },

  // Update blog post
  async updateBlogPost(id, updates) {
    try {
      const { data, error } = await supabase
        .from("blog-post")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("blog_id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating blog post:", error);
      throw error;
    }
  },

  // Delete blog post
  async deleteBlogPost(id) {
    try {
      const { error } = await supabase
        .from("blog-post")
        .delete()
        .eq("blog_id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting blog post:", error);
      throw error;
    }
  },

  // Get published blog posts
  async getPublishedBlogPosts() {
    try {
      const { data, error } = await supabase
        .from("blog-post")
        .select("*")
        .eq("status", 1) // Published status
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching published blog posts:", error);
      throw error;
    }
  },
};

// ============ DASHBOARD STATS SERVICE ============
export const dashboardService = {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      // Get counts from all tables
      const [
        usersCount,
        clientsCount,
        productsCount,
        servicesCount,
        teamCount,
        blogCount,
      ] = await Promise.all([
        supabase.from("users").select("count", { count: "exact" }),
        supabase.from("client").select("count", { count: "exact" }),
        supabase.from("products").select("count", { count: "exact" }),
        supabase.from("services").select("count", { count: "exact" }),
        supabase.from("members").select("count", { count: "exact" }),
        supabase.from("blog-post").select("count", { count: "exact" }),
      ]);

      return {
        totalUsers: usersCount.count || 0,
        totalClients: clientsCount.count || 0,
        totalProducts: productsCount.count || 0,
        totalServices: servicesCount.count || 0,
        totalTeam: teamCount.count || 0,
        totalBlogs: blogCount.count || 0,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return {
        totalUsers: 0,
        totalClients: 0,
        totalProducts: 0,
        totalServices: 0,
        totalTeam: 0,
        totalBlogs: 0,
      };
    }
  },

  // Get recent activities
  async getRecentActivities() {
    try {
      // Get recent entries from all tables
      const [recentUsers, recentClients, recentBlogs, recentProducts] =
        await Promise.all([
          supabase
            .from("users")
            .select("user_id, full_name, email, created_at")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("client")
            .select("client_id, client_full_name, start_date, status")
            .order("start_date", { ascending: false })
            .limit(5),
          supabase
            .from("blog-post")
            .select("blog_id, title, status, created_at")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("products")
            .select("products_id, name, platform, created_at")
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

      return {
        recentUsers: recentUsers.data || [],
        recentClients: recentClients.data || [],
        recentBlogs: recentBlogs.data || [],
        recentProducts: recentProducts.data || [],
      };
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      return {
        recentUsers: [],
        recentClients: [],
        recentBlogs: [],
        recentProducts: [],
      };
    }
  },

  // Get product dashboard stats
  async getProductDashboardStats() {
    try {
      const [
        totalProducts,
        activeProducts,
        affiliateProducts,
        featuredProducts,
        platformStats,
        categoryStats,
      ] = await Promise.all([
        supabase.from("products").select("count", { count: "exact" }),
        supabase
          .from("products")
          .select("count", { count: "exact" })
          .eq("status", 1),
        supabase
          .from("products")
          .select("count", { count: "exact" })
          .eq("is_affiliate", true),
        supabase
          .from("products")
          .select("count", { count: "exact" })
          .eq("is_featured", true),
        supabase.from("products").select("platform, count").group("platform"),
        supabase
          .from("products")
          .select("category_id, count")
          .group("category_id"),
      ]);

      return {
        totalProducts: totalProducts.count || 0,
        activeProducts: activeProducts.count || 0,
        affiliateProducts: affiliateProducts.count || 0,
        featuredProducts: featuredProducts.count || 0,
        platformStats: platformStats.data || [],
        categoryStats: categoryStats.data || [],
      };
    } catch (error) {
      console.error("Error fetching product dashboard stats:", error);
      return {
        totalProducts: 0,
        activeProducts: 0,
        affiliateProducts: 0,
        featuredProducts: 0,
        platformStats: [],
        categoryStats: [],
      };
    }
  },
};

// ============ FAQS SERVICE (faqs table) ============
export const faqsService = {
  // Get all FAQs with sorting
  async getAllFAQs() {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        // If table doesn't exist, return empty array
        if (error.code === "42P01") {
          console.warn("FAQs table does not exist");
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      return [];
    }
  },

  // Get FAQ by ID
  async getFAQById(id) {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("faq_id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching FAQ:", error);
      throw error;
    }
  },

  // Create new FAQ
  async createFAQ(faqData) {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .insert([
          {
            ...faqData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating FAQ:", error);
      throw error;
    }
  },

  // Update FAQ
  async updateFAQ(id, updates) {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("faq_id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating FAQ:", error);
      throw error;
    }
  },

  // Delete FAQ
  async deleteFAQ(id) {
    try {
      const { error } = await supabase.from("faqs").delete().eq("faq_id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      throw error;
    }
  },

  // Get active FAQs for public display
  async getActiveFAQs() {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching active FAQs:", error);
      return [];
    }
  },

  // Search FAQs
  async searchFAQs(searchTerm) {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .or(
          `question.ilike.%${searchTerm}%,answer.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`
        )
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error searching FAQs:", error);
      return [];
    }
  },

  // ============ USER QUESTIONS METHODS ============

  // Submit a new question from user to user_questions table
  async submitUserQuestion(questionData) {
    try {
      console.log("📤 Submitting user question:", questionData);

      const { data, error } = await supabase
        .from("user_questions")
        .insert([
          {
            name: questionData.name.trim(),
            email: questionData.email.trim(),
            question: questionData.question.trim(),
            category: questionData.category || null,
            status: "pending",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);

        // If table doesn't exist, log warning but don't crash
        if (error.code === "42P01") {
          console.warn(
            "user_questions table does not exist. Creating simulated response."
          );
          // Return simulated data for development
          return {
            question_id: "simulated-" + Date.now(),
            ...questionData,
            status: "pending",
            created_at: new Date().toISOString(),
          };
        }

        throw error;
      }

      console.log("✅ Question submitted successfully:", data);
      return data;
    } catch (error) {
      console.error("Error submitting question:", error);
      throw new Error(`Failed to submit question: ${error.message}`);
    }
  },

  // Get pending questions for admin (from user_questions table)
  async getPendingQuestions() {
    try {
      const { data, error } = await supabase
        .from("user_questions")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        // If table doesn't exist, return empty array
        if (error.code === "42P01") {
          console.warn("user_questions table does not exist");
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error("Error fetching pending questions:", error);
      return [];
    }
  },

  // Get all user questions for admin
  async getAllUserQuestions() {
    try {
      const { data, error } = await supabase
        .from("user_questions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        if (error.code === "42P01") {
          console.warn("user_questions table does not exist");
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error("Error fetching user questions:", error);
      return [];
    }
  },

  // Update question status in user_questions table (FIXED VERSION)
  async updateQuestionStatus(questionId, status) {
    try {
      // Update without expecting data back first
      const { error: updateError } = await supabase
        .from("user_questions")
        .update({
          status: status,
          updated_at: new Date().toISOString(),
        })
        .eq("question_id", questionId);

      if (updateError) {
        if (updateError.code === "42P01") {
          console.warn("user_questions table does not exist");
          return { success: true, message: "Simulated update" };
        }
        throw updateError;
      }

      // Then fetch the updated question separately if needed
      try {
        const { data, error: fetchError } = await supabase
          .from("user_questions")
          .select("*")
          .eq("question_id", questionId)
          .single();

        if (fetchError) {
          console.warn(
            "Could not fetch updated question, but update was successful"
          );
          return { success: true, question_id: questionId, status: status };
        }

        return data;
      } catch (fetchError) {
        // If we can't fetch, still return success
        return { success: true, question_id: questionId, status: status };
      }
    } catch (error) {
      console.error("Error updating question status:", error);
      throw error;
    }
  },

  // Send answer to user and store in database
  async sendAnswerToUser(questionId, answerData) {
    try {
      console.log("📧 Sending answer for question:", questionId);
      console.log("Answer data:", answerData);

      // Update the question with answer and status
      const { error: updateError } = await supabase
        .from("user_questions")
        .update({
          answer: answerData.answer,
          status: "answered",
          updated_at: new Date().toISOString(),
        })
        .eq("question_id", questionId);

      if (updateError) {
        console.error("Error updating question with answer:", updateError);
        throw updateError;
      }

      // Simulate email sending (in production, integrate with email service)
      console.log("Simulating email to user with answer...");

      // Optional: In a real app, you would call your email API here
      // Example: await emailService.sendAnswerEmail(questionId, answerData);

      return {
        success: true,
        message: "Answer sent successfully",
        question_id: questionId,
        email_sent: answerData.sendEmail || false,
      };
    } catch (error) {
      console.error("Error sending answer to user:", error);
      throw new Error(`Failed to send answer: ${error.message}`);
    }
  },

  // Convert user question to FAQ (admin function)
  async convertToFAQ(questionId, answer, category = null, displayOrder = 0) {
    try {
      // First, get the question from user_questions
      const { data: question, error: fetchError } = await supabase
        .from("user_questions")
        .select("*")
        .eq("question_id", questionId)
        .single();

      if (fetchError) {
        console.error("Error fetching question:", fetchError);
        throw fetchError;
      }

      console.log("📝 Converting question to FAQ:", question.question);

      // Create FAQ from question in faqs table
      const faqData = {
        question: question.question,
        answer: answer.trim(),
        category: category || question.category || "General",
        is_active: true,
        display_order: displayOrder || 0,
      };

      const { data: faq, error: createError } = await supabase
        .from("faqs")
        .insert([
          {
            ...faqData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (createError) {
        console.error("Error creating FAQ:", createError);
        throw createError;
      }

      // Update question status to 'answered' in user_questions table
      // Also store the answer in user_questions for notifications
      const { error: updateError } = await supabase
        .from("user_questions")
        .update({
          status: "answered",
          answer: answer.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("question_id", questionId);

      if (updateError) {
        console.error("Error updating question status:", updateError);
        throw updateError;
      }

      console.log("✅ Question converted to FAQ successfully:", faq);
      return faq;
    } catch (error) {
      console.error("❌ Error converting question to FAQ:", error);
      throw new Error(`Failed to convert question to FAQ: ${error.message}`);
    }
  },

  // Delete a user question
  async deleteUserQuestion(questionId) {
    try {
      const { error } = await supabase
        .from("user_questions")
        .delete()
        .eq("question_id", questionId);

      if (error) throw error;
      return { success: true, message: "Question deleted successfully" };
    } catch (error) {
      console.error("Error deleting user question:", error);
      throw error;
    }
  },

  // Get answered questions with answers (for notifications)
  async getAnsweredQuestionsWithAnswers() {
    try {
      const { data, error } = await supabase
        .from("user_questions")
        .select("*")
        .eq("status", "answered")
        .not("answer", "is", null)
        .order("updated_at", { ascending: false })
        .limit(10);

      if (error) {
        if (error.code === "42P01") {
          console.warn("user_questions table does not exist");
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error("Error fetching answered questions:", error);
      return [];
    }
  },
};

// ============ CONSULTATION REQUESTS SERVICE ============
export const consultationService = {
  // Get all consultation requests
  async getAllConsultations() {
    try {
      const { data, error } = await supabase
        .from("consultation_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching consultations:", error);
      throw error;
    }
  },

  // Get consultation by ID
  async getConsultationById(id) {
    try {
      const { data, error } = await supabase
        .from("consultation_requests")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching consultation:", error);
      throw error;
    }
  },

  // Create new consultation request
  async createConsultation(consultationData) {
    try {
      const { data, error } = await supabase
        .from("consultation_requests")
        .insert([
          {
            ...consultationData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating consultation:", error);
      throw error;
    }
  },

  // Update consultation
  async updateConsultation(id, updates) {
    try {
      const { data, error } = await supabase
        .from("consultation_requests")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating consultation:", error);
      throw error;
    }
  },

  // Delete consultation
  async deleteConsultation(id) {
    try {
      const { error } = await supabase
        .from("consultation_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting consultation:", error);
      throw error;
    }
  },

  // Update consultation status
  async updateConsultationStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from("consultation_requests")
        .update({
          status: status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating consultation status:", error);
      throw error;
    }
  },

  // Get consultations by status
  async getConsultationsByStatus(status) {
    try {
      const { data, error } = await supabase
        .from("consultation_requests")
        .select("*")
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching consultations by status:", error);
      throw error;
    }
  },

  // Search consultations
  async searchConsultations(searchTerm) {
    try {
      const { data, error } = await supabase
        .from("consultation_requests")
        .select("*")
        .or(
          `full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error searching consultations:", error);
      throw error;
    }
  },

  // Get recent consultations
  async getRecentConsultations(limit = 10) {
    try {
      const { data, error } = await supabase
        .from("consultation_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching recent consultations:", error);
      throw error;
    }
  },

  // Get statistics
  async getConsultationStats() {
    try {
      const { data, error } = await supabase
        .from("consultation_requests")
        .select("status, created_at");

      if (error) throw error;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - 7);

      const stats = {
        total: data.length,
        pending: data.filter((d) => d.status === "pending").length,
        contacted: data.filter((d) => d.status === "contacted").length,
        scheduled: data.filter((d) => d.status === "scheduled").length,
        completed: data.filter((d) => d.status === "completed").length,
        cancelled: data.filter((d) => d.status === "cancelled").length,
        today: data.filter((d) => new Date(d.created_at) >= today).length,
        thisWeek: data.filter((d) => new Date(d.created_at) >= thisWeek).length,
      };

      return stats;
    } catch (error) {
      console.error("Error fetching consultation stats:", error);
      return {
        total: 0,
        pending: 0,
        contacted: 0,
        scheduled: 0,
        completed: 0,
        cancelled: 0,
        today: 0,
        thisWeek: 0,
      };
    }
  },
};
// ============ COMPLETE ASSESSMENTS SERVICE ============
export const assessmentsService = {
  // 1. Submit new assessment
  async submitAssessment(assessmentData) {
    try {
      console.log('📤 Submitting assessment...', assessmentData);
      
      // Basic validation
      if (!assessmentData) throw new Error('No data provided');
      if (!assessmentData.email) throw new Error('Email required');
      
      // Simple data structure
      const simpleData = {
        user_name: assessmentData.name || 'Anonymous',
        user_email: assessmentData.email,
        user_age: assessmentData.age ? parseInt(assessmentData.age) : null,
        user_gender: assessmentData.gender || '',
        primary_goal: assessmentData.primaryGoal || 'Not specified',
        motivation_level: assessmentData.motivationLevel ? 
          parseInt(assessmentData.motivationLevel) : 5,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Inserting:', simpleData);
      
      if (!supabase) {
        console.warn('Supabase not available, using mock');
        return {
          assessment_id: 'mock-' + Date.now(),
          ...simpleData
        };
      }
      
      const { data, error } = await supabase
        .from('assessments')
        .insert([simpleData])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        return {
          assessment_id: 'error-' + Date.now(),
          ...simpleData,
          error: error.message
        };
      }
      
      console.log('✅ Submitted:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Submit error:', error);
      throw error;
    }
  },

  // 2. Get assessment with responses
  async getAssessmentWithResponses(id) {
    try {
      console.log('🔍 Getting assessment with responses for ID:', id);
      
      if (!supabase) {
        console.warn('Supabase not available');
        return {
          assessment: null,
          responses: [],
          followUps: []
        };
      }
      
      // Get assessment
      const { data: assessment, error: assessmentError } = await supabase
        .from('assessments')
        .select('*')
        .eq('assessment_id', id)
        .single();
      
      if (assessmentError) {
        console.error('Assessment fetch error:', assessmentError);
        throw assessmentError;
      }
      
      console.log('📋 Found assessment:', assessment);
      
      // Initialize empty arrays for responses and follow-ups
      let responses = [];
      let followUps = [];
      
      // Try to get responses (table might not exist)
      try {
        const { data: responsesData } = await supabase
          .from('assessment_responses')
          .select('*')
          .eq('assessment_id', id)
          .order('created_at', { ascending: true });
        
        responses = responsesData || [];
      } catch (responseError) {
        console.warn('Could not fetch responses:', responseError.message);
      }
      
      // Try to get follow-ups (table might not exist)
      try {
        const { data: followUpsData } = await supabase
          .from('assessment_follow_ups')
          .select('*')
          .eq('assessment_id', id)
          .order('follow_up_date', { ascending: true });
        
        followUps = followUpsData || [];
      } catch (followUpError) {
        console.warn('Could not fetch follow-ups:', followUpError.message);
      }
      
      return {
        assessment,
        responses,
        followUps
      };
      
    } catch (error) {
      console.error('❌ getAssessmentWithResponses error:', error);
      throw error;
    }
  },

  // 3. Get all assessments
  async getAllAssessments(filters = {}) {
    try {
      console.log('📋 Fetching assessments with filters:', filters);
      
      if (!supabase) {
        console.warn('Supabase not available');
        return [];
      }
      
      let query = supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Fetch error:', error);
        return [];
      }
      
      console.log(`✅ Found ${data?.length || 0} assessments`);
      return data || [];
      
    } catch (error) {
      console.error('❌ getAllAssessments error:', error);
      return [];
    }
  },

  // 4. Get assessment by ID
  async getAssessmentById(id) {
    try {
      console.log('🔍 Getting assessment by ID:', id);
      
      if (!supabase) {
        console.warn('Supabase not available');
        return null;
      }
      
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('assessment_id', id)
        .single();
      
      if (error) {
        console.error('Error fetching assessment:', error);
        throw error;
      }
      
      return data;
      
    } catch (error) {
      console.error('❌ getAssessmentById error:', error);
      throw error;
    }
  },

  // 5. Update assessment
  async updateAssessment(id, updates) {
    try {
      console.log('📝 Updating assessment:', id, updates);
      
      if (!supabase) {
        console.warn('Supabase not available');
        return { success: true, message: 'Mock update' };
      }
      
      const { data, error } = await supabase
        .from('assessments')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('assessment_id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
      
    } catch (error) {
      console.error('❌ updateAssessment error:', error);
      throw error;
    }
  },

  // 6. Add assessment response
  async addAssessmentResponse(assessmentId, responseData) {
    try {
      console.log('💬 Adding response to assessment:', assessmentId);
      
      if (!supabase) {
        console.warn('Supabase not available');
        return { success: true, message: 'Mock response added' };
      }
      
      const { data, error } = await supabase
        .from('assessment_responses')
        .insert([{
          assessment_id: assessmentId,
          section_name: responseData.sectionName || 'full_review',
          response_text: responseData.responseText,
          responded_by: responseData.respondedBy || 'Admin',
          response_type: responseData.responseType || 'recommendation',
          priority: responseData.priority || 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) {
        // If table doesn't exist, that's OK for now
        if (error.code === '42P01') {
          return { success: true, message: 'Response table not created yet' };
        }
        throw error;
      }
      
      return data;
      
    } catch (error) {
      console.error('❌ addAssessmentResponse error:', error);
      throw error;
    }
  },

  // 7. Get assessment stats
  async getAssessmentStats() {
    try {
      console.log('📊 Getting assessment stats');
      
      if (!supabase) {
        console.warn('Supabase not available');
        return {
          total: 0,
          pending: 0,
          reviewed: 0,
          contacted: 0,
          scheduled: 0,
          completed: 0,
          today: 0,
          thisWeek: 0,
          avgMotivation: 0
        };
      }
      
      const { data, error } = await supabase
        .from('assessments')
        .select('status, created_at, motivation_level');
      
      if (error) {
        console.error('Stats fetch error:', error);
        return {
          total: 0,
          pending: 0,
          reviewed: 0,
          contacted: 0,
          scheduled: 0,
          completed: 0,
          today: 0,
          thisWeek: 0,
          avgMotivation: 0
        };
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - 7);
      
      const stats = {
        total: data?.length || 0,
        pending: data?.filter(d => d.status === 'pending').length || 0,
        reviewed: data?.filter(d => d.status === 'reviewed').length || 0,
        contacted: data?.filter(d => d.status === 'contacted').length || 0,
        scheduled: data?.filter(d => d.status === 'scheduled').length || 0,
        completed: data?.filter(d => d.status === 'completed').length || 0,
        today: data?.filter(d => new Date(d.created_at) >= today).length || 0,
        thisWeek: data?.filter(d => new Date(d.created_at) >= thisWeek).length || 0,
        avgMotivation: data?.length > 0 
          ? (data.reduce((sum, d) => sum + (d.motivation_level || 0), 0) / data.length).toFixed(1)
          : 0
      };
      
      return stats;
      
    } catch (error) {
      console.error('❌ getAssessmentStats error:', error);
      return {
        total: 0,
        pending: 0,
        reviewed: 0,
        contacted: 0,
        scheduled: 0,
        completed: 0,
        today: 0,
        thisWeek: 0,
        avgMotivation: 0
      };
    }
  },

  // 8. Search assessments
  async searchAssessments(searchTerm) {
  try {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .or(`user_email.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Search error:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
},

  // 9. Delete assessment
  async deleteAssessment(id) {
    try {
      console.log('🗑️ Deleting assessment:', id);
      
      if (!supabase) {
        console.warn('Supabase not available');
        return { success: true, message: 'Mock delete' };
      }
      
      const { error } = await supabase
        .from('assessments')
        .delete()
        .eq('assessment_id', id);
      
      if (error) throw error;
      return { success: true, message: 'Assessment deleted' };
      
    } catch (error) {
      console.error('❌ deleteAssessment error:', error);
      throw error;
    }
  },

  // 10. Get assessment packages (simplified)
  async getAssessmentPackages() {
    try {
      console.log('📦 Getting assessment packages');
      
      // Return mock packages for now
      return [
        {
          package_id: 'beginner',
          package_name: 'Beginner Fitness Starter',
          package_description: 'Perfect for those new to fitness',
          package_type: 'beginner',
          duration_weeks: 8,
          base_price: 299.99,
          included_services: ['Personal Training', 'Nutrition Guide']
        },
        {
          package_id: 'intermediate',
          package_name: 'Weight Loss Program',
          package_description: 'Specialized program for fat loss',
          package_type: 'intermediate',
          duration_weeks: 10,
          base_price: 449.99,
          included_services: ['Cardio Training', 'Nutrition Coaching']
        }
      ];
      
    } catch (error) {
      console.error('❌ getAssessmentPackages error:', error);
      return [];
    }
  },

  // 11. Add follow-up
  async addAssessmentFollowUp(assessmentId, followUpData) {
    try {
      console.log('📅 Adding follow-up to assessment:', assessmentId);
      
      if (!supabase) {
        console.warn('Supabase not available');
        return { success: true, message: 'Mock follow-up added' };
      }
      
      const { data, error } = await supabase
        .from('assessment_follow_ups')
        .insert([{
          assessment_id: assessmentId,
          follow_up_type: followUpData.followUpType || 'email',
          follow_up_date: followUpData.followUpDate || new Date().toISOString(),
          follow_up_notes: followUpData.followUpNotes || '',
          status: followUpData.status || 'scheduled',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) {
        // If table doesn't exist, that's OK for now
        if (error.code === '42P01') {
          return { success: true, message: 'Follow-up table not created yet' };
        }
        throw error;
      }
      
      return data;
      
    } catch (error) {
      console.error('❌ addAssessmentFollowUp error:', error);
      throw error;
    }
  },

  // 12. Bulk update assessments
  async bulkUpdateAssessments(ids, updates) {
    try {
      console.log('🔄 Bulk updating assessments:', ids.length);
      
      if (!supabase) {
        console.warn('Supabase not available');
        return [];
      }
      
      const { data, error } = await supabase
        .from('assessments')
        .update(updates)
        .in('assessment_id', ids)
        .select();
      
      if (error) throw error;
      return data || [];
      
    } catch (error) {
      console.error('❌ bulkUpdateAssessments error:', error);
      throw error;
    }
  }
};

// ============ EXPORT ALL SERVICES ============
export default {
  // Core services
  usersService,
  servicesService,
  productsService,
  teamMembersService,
  subscribedClientsService,
  blogPostsService,
  faqsService,
  consultationService,
  dashboardService,
  productCategoriesService,
  productViewsService,
  productClicksService,
  productImportService,
};
