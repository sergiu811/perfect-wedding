export const DECORATIONS = [
  {
    id: 1,
    name: "Enchanted Events",
    shortDescription:
      "Specializing in romantic and classic floral arrangements.",
    description:
      "Transform your wedding into a fairytale with our bespoke decoration services. From floral arrangements to lighting, we craft unforgettable atmospheres.",
    rating: 4.8,
    reviewCount: 125,
    image:
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f29da8fd36?w=800&q=80",
    ],
    styles: ["Rustic", "Modern", "Classic"],
    pricing: "Starting from $2,500",
    pricingDetails:
      "Starting from $2,500, including setup and takedown. Custom packages available upon request.",
    customization:
      "Personalize your decor with unique color schemes, themes, and additional elements to match your vision.",
    rentalInfo:
      "Rental options available for most items. Select pieces can be purchased to keep as mementos.",
    reviews: [
      {
        id: 1,
        author: "Sophia Bennett",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
        rating: 5,
        date: "2 months ago",
        comment:
          "Absolutely stunning decor! Enchanted Events exceeded our expectations and made our wedding day truly magical.",
      },
      {
        id: 2,
        author: "Olivia Carter",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
        rating: 4,
        date: "4 months ago",
        comment:
          "The decorations were beautiful, though there were a few minor setup delays. Overall, a great experience.",
      },
    ],
  },
  {
    id: 2,
    name: "Rustic Charm Decor",
    shortDescription: "Creating charming rustic-themed wedding decorations.",
    description:
      "Bring natural beauty and rustic elegance to your wedding with our handcrafted decorations and styling services.",
    rating: 4.9,
    reviewCount: 150,
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    ],
    styles: ["Rustic", "Vintage", "Barn"],
    pricing: "Starting from $2,000",
    pricingDetails:
      "Starting from $2,000, including setup and takedown. Custom packages available upon request.",
    customization:
      "Personalize your decor with barn wood, burlap, and natural elements to match your rustic theme.",
    rentalInfo:
      "All items available for rental. Some vintage pieces can be purchased.",
    reviews: [],
  },
  {
    id: 3,
    name: "Modern Minimalist Events",
    shortDescription: "Minimalist and modern decor for a chic wedding.",
    description:
      "Clean lines, geometric shapes, and contemporary elegance define our approach to modern wedding decor.",
    rating: 4.7,
    reviewCount: 110,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80",
    ],
    styles: ["Modern", "Minimalist", "Contemporary"],
    pricing: "Starting from $3,000",
    pricingDetails:
      "Starting from $3,000, including setup and takedown. Custom packages available upon request.",
    customization:
      "Personalize your decor with modern geometric elements and clean color palettes.",
    rentalInfo: "Premium modern pieces available for rental or purchase.",
    reviews: [],
  },
  {
    id: 4,
    name: "Vintage Romance Designs",
    shortDescription: "Vintage-inspired decorations with a romantic touch.",
    description:
      "Step back in time with our vintage-inspired decorations featuring lace, pearls, and romantic details.",
    rating: 4.6,
    reviewCount: 90,
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f29da8fd36?w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    ],
    styles: ["Vintage", "Romantic", "Shabby Chic"],
    pricing: "Starting from $2,200",
    pricingDetails:
      "Starting from $2,200, including setup and takedown. Custom packages available upon request.",
    customization:
      "Personalize your decor with lace, pearls, and vintage elements to create a romantic atmosphere.",
    rentalInfo:
      "Vintage pieces available for rental. Many items can be purchased as keepsakes.",
    reviews: [],
  },
];

export const DECORATION_FILTERS = [
  { id: "style", label: "Style" },
  { id: "color", label: "Color Scheme" },
  { id: "budget", label: "Budget" },
];
