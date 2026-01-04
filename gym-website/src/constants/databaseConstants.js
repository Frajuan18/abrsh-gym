// Status codes mapping for all tables
export const STATUS_CODES = {
  // General status codes
  ACTIVE: 1,
  INACTIVE: 0,
  PENDING: 2,
  DRAFT: 3,
  
  // Product availability status
  IN_STOCK: 1,
  OUT_OF_STOCK: 0,
  LIMITED_STOCK: 2,
  PRE_ORDER: 3,
  DISCONTINUED: 4,
  
  // Content status (blog posts, etc.)
  PUBLISHED: 1,
  ARCHIVED: 2,
  
  // Service status
  AVAILABLE: 1,
  UNAVAILABLE: 0,
  
  // Team member status
  ACTIVE_MEMBER: 1,
  INACTIVE_MEMBER: 0,
  ON_LEAVE: 2,
};

// Product platforms
export const PRODUCT_PLATFORMS = [
  { id: 'alibaba', name: 'Alibaba', icon: '🌐', color: 'bg-orange-100 text-orange-800' },
  { id: 'amazon', name: 'Amazon', icon: '📦', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'ebay', name: 'eBay', icon: '🏷️', color: 'bg-blue-100 text-blue-800' },
  { id: 'walmart', name: 'Walmart', icon: '🛒', color: 'bg-blue-100 text-blue-800' },
  { id: 'etsy', name: 'Etsy', icon: '🎨', color: 'bg-pink-100 text-pink-800' },
  { id: 'aliexpress', name: 'AliExpress', icon: '🚀', color: 'bg-red-100 text-red-800' },
  { id: 'target', name: 'Target', icon: '🎯', color: 'bg-red-100 text-red-800' },
  { id: 'bestbuy', name: 'Best Buy', icon: '💻', color: 'bg-blue-100 text-blue-800' },
  { id: 'shopify', name: 'Shopify Store', icon: '🛍️', color: 'bg-green-100 text-green-800' },
  { id: 'other', name: 'Other', icon: '🔗', color: 'bg-gray-100 text-gray-800' }
];

// Product categories
export const PRODUCT_CATEGORIES = [
  'Supplements',
  'Equipment',
  'Apparel',
  'Technology',
  'Nutrition',
  'Recovery',
  'Accessories',
  'Home Gym',
  'Cardio',
  'Strength Training',
  'Yoga & Pilates',
  'Outdoor Fitness',
  'Wellness',
  'Gym Accessories',
  'Furniture'
];

// Product availability statuses
export const AVAILABILITY_STATUSES = [
  { id: 'in_stock', label: 'In Stock', color: 'green', icon: 'check-circle' },
  { id: 'out_of_stock', label: 'Out of Stock', color: 'red', icon: 'x-circle' },
  { id: 'limited_stock', label: 'Limited Stock', color: 'yellow', icon: 'alert-circle' },
  { id: 'pre_order', label: 'Pre-order', color: 'blue', icon: 'calendar' },
  { id: 'discontinued', label: 'Discontinued', color: 'gray', icon: 'archive' }
];

// Product moderation statuses
export const MODERATION_STATUSES = [
  { id: 'approved', label: 'Approved', color: 'green' },
  { id: 'pending', label: 'Pending Review', color: 'yellow' },
  { id: 'rejected', label: 'Rejected', color: 'red' },
  { id: 'needs_revision', label: 'Needs Revision', color: 'orange' }
];

// Shipping time options
export const SHIPPING_TIMES = [
  '1-3 days',
  '3-5 days',
  '5-7 days',
  '7-14 days',
  '14-21 days',
  '21-30 days',
  '30+ days',
  'Free shipping',
  'Express shipping'
];

// Currency options
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
];

// Plan types for users table
export const PLAN_TYPES = {
  BASIC: 1,
  STANDARD: 2,
  PREMIUM: 3,
  ANNUAL: 4,
  CUSTOM: 5,
};

// Billing cycles for client table
export const BILLING_CYCLES = {
  MONTHLY: 1,
  QUARTERLY: 2,
  SEMI_ANNUAL: 3,
  ANNUAL: 4,
  ONE_TIME: 5,
};

// Service categories
export const SERVICE_CATEGORIES = [
  'Personal Training',
  'Group Classes',
  'Nutrition Counseling',
  'Yoga & Pilates',
  'Cardio Training',
  'Strength Training',
  'Physical Therapy',
  'Wellness Coaching'
];

export const FAQ_CATEGORIES = [
  'Training',
  'Membership',
  'Billing',
  'Facilities',
  'Safety',
  'Services',
  'General',
  'Online Training',
  'Personal Training',
  'Group Classes',
  'Nutrition',
  'Equipment'
];

// Team positions
export const TEAM_POSITIONS = [
  'Personal Trainer',
  'Fitness Coach',
  'Nutritionist',
  'Yoga Instructor',
  'Physical Therapist',
  'Gym Manager',
  'Receptionist',
  'Maintenance Staff'
];

// Helper functions
export const getStatusLabel = (statusCode, type = 'general') => {
  if (statusCode === null || statusCode === undefined) return 'Unknown';
  
  switch (type) {
    case 'product':
      switch (parseInt(statusCode)) {
        case STATUS_CODES.ACTIVE: return 'Active';
        case STATUS_CODES.INACTIVE: return 'Inactive';
        case STATUS_CODES.PENDING: return 'Pending';
        case STATUS_CODES.DRAFT: return 'Draft';
        default: return 'Unknown';
      }
    
    case 'availability':
      switch (statusCode) {
        case 'in_stock': return 'In Stock';
        case 'out_of_stock': return 'Out of Stock';
        case 'limited_stock': return 'Limited Stock';
        case 'pre_order': return 'Pre-order';
        case 'discontinued': return 'Discontinued';
        default: return 'Unknown';
      }
    
    case 'moderation':
      return MODERATION_STATUSES.find(s => s.id === statusCode)?.label || 'Unknown';
    
    case 'content':
      switch (parseInt(statusCode)) {
        case STATUS_CODES.PUBLISHED: return 'Published';
        case STATUS_CODES.ARCHIVED: return 'Archived';
        case STATUS_CODES.DRAFT: return 'Draft';
        default: return 'Unknown';
      }
    
    default: // general
      switch (parseInt(statusCode)) {
        case STATUS_CODES.ACTIVE: return 'Active';
        case STATUS_CODES.INACTIVE: return 'Inactive';
        case STATUS_CODES.PENDING: return 'Pending';
        default: return 'Unknown';
      }
  }
};

export const getPlatformLabel = (platformId) => {
  const platform = PRODUCT_PLATFORMS.find(p => p.id === platformId);
  return platform ? platform.name : 'Other';
};

export const getPlatformIcon = (platformId) => {
  const platform = PRODUCT_PLATFORMS.find(p => p.id === platformId);
  return platform ? platform.icon : '🔗';
};

export const getPlatformColor = (platformId) => {
  const platform = PRODUCT_PLATFORMS.find(p => p.id === platformId);
  return platform ? platform.color : 'bg-gray-100 text-gray-800';
};

export const getPlanLabel = (planCode) => {
  if (planCode === null || planCode === undefined) return 'No Plan';
  
  switch (parseInt(planCode)) {
    case PLAN_TYPES.BASIC: return 'Basic';
    case PLAN_TYPES.STANDARD: return 'Standard';
    case PLAN_TYPES.PREMIUM: return 'Premium';
    case PLAN_TYPES.ANNUAL: return 'Annual';
    case PLAN_TYPES.CUSTOM: return 'Custom';
    default: return 'Unknown';
  }
};

export const getBillingCycleLabel = (cycleCode) => {
  if (cycleCode === null || cycleCode === undefined) return 'One-time';
  
  switch (parseInt(cycleCode)) {
    case BILLING_CYCLES.MONTHLY: return 'Monthly';
    case BILLING_CYCLES.QUARTERLY: return 'Quarterly';
    case BILLING_CYCLES.SEMI_ANNUAL: return 'Semi-Annual';
    case BILLING_CYCLES.ANNUAL: return 'Annual';
    case BILLING_CYCLES.ONE_TIME: return 'One-time';
    default: return 'Custom';
  }
};

// Status badge colors
export const getStatusColor = (statusCode, type = 'general') => {
  if (statusCode === null || statusCode === undefined) return 'gray';
  
  if (type === 'availability') {
    switch (statusCode) {
      case 'in_stock': return 'green';
      case 'out_of_stock': return 'red';
      case 'limited_stock': return 'yellow';
      case 'pre_order': return 'blue';
      case 'discontinued': return 'gray';
      default: return 'gray';
    }
  }
  
  if (type === 'moderation') {
    switch (statusCode) {
      case 'approved': return 'green';
      case 'pending': return 'yellow';
      case 'rejected': return 'red';
      case 'needs_revision': return 'orange';
      default: return 'gray';
    }
  }
  
  const code = parseInt(statusCode);
  
  switch (type) {
    case 'content':
      switch (code) {
        case STATUS_CODES.PUBLISHED: return 'green';
        case STATUS_CODES.ARCHIVED: return 'gray';
        case STATUS_CODES.DRAFT: return 'yellow';
        default: return 'gray';
      }
    
    case 'product':
      switch (code) {
        case STATUS_CODES.ACTIVE: return 'green';
        case STATUS_CODES.INACTIVE: return 'red';
        case STATUS_CODES.PENDING: return 'yellow';
        case STATUS_CODES.DRAFT: return 'blue';
        default: return 'gray';
      }
    
    default:
      switch (code) {
        case STATUS_CODES.ACTIVE:
        case STATUS_CODES.PUBLISHED:
        case STATUS_CODES.IN_STOCK:
        case STATUS_CODES.AVAILABLE:
        case STATUS_CODES.ACTIVE_MEMBER:
          return 'green';
        
        case STATUS_CODES.PENDING:
        case STATUS_CODES.DRAFT:
        case STATUS_CODES.LIMITED_STOCK:
          return 'yellow';
        
        case STATUS_CODES.INACTIVE:
        case STATUS_CODES.OUT_OF_STOCK:
        case STATUS_CODES.UNAVAILABLE:
        case STATUS_CODES.INACTIVE_MEMBER:
          return 'red';
        
        case STATUS_CODES.ARCHIVED:
        case STATUS_CODES.DISCONTINUED:
          return 'gray';
        
        default: return 'gray';
      }
  }
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '$0.00';
  
  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(parseFloat(amount) || 0);
};

// Format date
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  if (includeTime) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Calculate discount percentage
export const calculateDiscountPercent = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Generate slug from title
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Validate URL
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Extract domain from URL
export const extractDomain = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace('www.', '');
  } catch (error) {
    return '';
  }
};

// Get rating stars HTML
export const getRatingStars = (rating, maxStars = 5) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    fullStars,
    hasHalfStar,
    emptyStars
  };
};

// Format shipping time
export const formatShippingTime = (days) => {
  if (!days) return 'Unknown';
  
  if (days === 'Free shipping') return 'Free Shipping';
  if (days === 'Express shipping') return 'Express Shipping';
  
  const numDays = parseInt(days);
  if (isNaN(numDays)) return days;
  
  if (numDays === 1) return '1 day';
  if (numDays <= 3) return '1-3 days';
  if (numDays <= 7) return '3-7 days';
  if (numDays <= 14) return '1-2 weeks';
  if (numDays <= 30) return '2-4 weeks';
  return '4+ weeks';
};