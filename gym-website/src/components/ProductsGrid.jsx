import React from 'react';
import { Star, ShoppingBag, Check, Shirt, Droplets } from 'lucide-react';

const ProductsGrid = () => {
  const categories = [
    {
      name: 'Fitness Equipment',
      icon: <ShoppingBag size={20} />,
      products: [
        {
          name: 'Adjustable Dumbbells Set',
          description: 'Space-saving design with weights from 5-52.5 lbs',
          rating: 4.8,
          price: '$299',
          tag: 'Best Seller',
          tagColor: 'bg-orange-500 text-white'
        },
        {
          name: 'Resistance Bands Set',
          description: 'Premium latex bands for strength training',
          rating: 4.9,
          price: '$39',
          tag: 'Top Rated',
          tagColor: 'bg-blue-500 text-white'
        },
        {
          name: 'Yoga Mat - Extra Thick',
          description: 'Non-slip, eco-friendly yoga mat',
          rating: 4.7,
          price: '$49',
          tag: 'Eco Choice',
          tagColor: 'bg-emerald-500 text-white'
        },
        {
          name: 'Foam Roller',
          description: 'High-density foam for muscle recovery',
          rating: 4.6,
          price: '$29',
          tag: 'Essential',
          tagColor: 'bg-purple-500 text-white'
        }
      ]
    },
    {
      name: 'Supplements',
      icon: <Droplets size={20} />,
      products: [
        {
          name: 'Whey Protein Isolate',
          description: 'Premium protein powder, 25g per serving',
          rating: 4.8,
          price: '$59',
          tag: 'Best Seller',
          tagColor: 'bg-orange-500 text-white'
        },
        {
          name: 'Pre-Workout Energy',
          description: 'Clean energy for intense workouts',
          rating: 4.7,
          price: '$44',
          tag: 'Energy Boost',
          tagColor: 'bg-red-500 text-white'
        },
        {
          name: 'Omega-3 Fish Oil',
          description: 'High-potency EPA & DHA',
          rating: 4.9,
          price: '$34',
          tag: 'Top Rated',
          tagColor: 'bg-blue-500 text-white'
        },
        {
          name: 'Multivitamin',
          description: 'Complete daily nutrition support',
          rating: 4.6,
          price: '$29',
          tag: 'Essential',
          tagColor: 'bg-purple-500 text-white'
        }
      ]
    },
    {
      name: 'Fitness Apparel',
      icon: <Shirt size={20} />,
      products: [
        {
          name: 'Performance T-Shirt',
          description: 'Moisture-wicking fabric, multiple colors',
          rating: 4.7,
          price: '$34',
          tag: 'Popular',
          tagColor: 'bg-orange-500 text-white'
        },
        {
          name: 'Training Shorts',
          description: 'Lightweight, quick-dry material',
          rating: 4.8,
          price: '$39',
          tag: 'New',
          tagColor: 'bg-emerald-500 text-white'
        },
        {
          name: 'Sports Leggings',
          description: 'High-waisted, squat-proof design',
          rating: 4.9,
          price: '$59',
          tag: 'Top Rated',
          tagColor: 'bg-blue-500 text-white'
        },
        {
          name: 'Training Shoes',
          description: 'Versatile cross-training footwear',
          rating: 4.8,
          price: '$129',
          tag: 'Premium',
          tagColor: 'bg-purple-500 text-white'
        }
      ]
    },
    {
      name: 'Recovery & Wellness',
      icon: <Check size={20} />,
      products: [
        {
          name: 'Massage Gun',
          description: 'Deep tissue percussion therapy',
          rating: 4.8,
          price: '$149',
          tag: 'Best Seller',
          tagColor: 'bg-orange-500 text-white'
        },
        {
          name: 'Compression Sleeves',
          description: 'Improve recovery and circulation',
          rating: 4.6,
          price: '$24',
          tag: 'Essential',
          tagColor: 'bg-purple-500 text-white'
        },
        {
          name: 'Water Bottle - 1 Gallon',
          description: 'BPA-free, time markers for hydration',
          rating: 4.7,
          price: '$19',
          tag: 'Popular',
          tagColor: 'bg-blue-500 text-white'
        },
        {
          name: 'Ice & Heat Pack',
          description: 'Reusable therapy pack for injuries',
          rating: 4.5,
          price: '$16',
          tag: 'Essential',
          tagColor: 'bg-gray-600 text-white'
        }
      ]
    }
  ];

  return (
    <div className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white text-orange-700 px-4 py-2 rounded-full mb-6 border border-orange-100 shadow-sm">
            <ShoppingBag size={16} className="text-orange-600" />
            <span className="text-sm font-semibold">Shop Trusted Products</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Featured Products
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Quality equipment and supplements we personally use and recommend to our clients
          </p>
        </div>

        {/* Products Grid by Category */}
        <div className="space-y-16">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              {/* Category Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <div className="text-orange-600">
                      {category.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
                    <p className="text-gray-600 mt-1">Curated selection for optimal results</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-orange-600">
                  <Check size={16} />
                  <span className="text-sm font-medium">Trainer Approved</span>
                </div>
              </div>

              {/* Products Grid - 4 per row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.products.map((product, productIndex) => (
                  <div key={productIndex} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {/* Product Image Placeholder */}
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <ShoppingBag size={48} className="text-gray-400" />
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      {/* Tag */}
                      {product.tag && (
                        <span className={`inline-block ${product.tagColor} text-xs font-semibold px-3 py-1 rounded-full mb-3`}>
                          {product.tag}
                        </span>
                      )}

                      {/* Name */}
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {product.name}
                      </h4>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4">
                        {product.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          {product.rating}
                        </span>
                      </div>

                      {/* Price and CTA */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">
                            {product.price}
                          </span>
                        </div>
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-6 lg:mb-0 lg:mr-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Need personalized recommendations?
              </h3>
              <p className="text-gray-700">
                Our trainers can help you choose the right products for your specific goals.
              </p>
            </div>
            <button className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
              <span>Get Personal Advice</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsGrid;