export const VENUES = [
  {
    id: 1,
    name: "The Grand Ballroom",
    location: "Bucharest, Romania",
    capacity: "Up to 200 guests",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f29da8fd36?w=800&q=80",
    priceRange: "$$$",
    style: "Elegant",
    description:
      "The Grand Ballroom offers a breathtaking setting for your special day. With manicured gardens, a stunning ballroom, and exceptional service, we ensure a memorable wedding experience.",
    pricing: "Packages starting from 120 EUR per person",
    rating: 4.8,
    reviewCount: 125,
    gallery: [
      {
        id: 1,
        image:
          "https://images.unsplash.com/photo-1519167758481-83f29da8fd36?w=800&q=80",
        label: "Interior",
      },
      {
        id: 2,
        image:
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
        label: "Exterior",
      },
      {
        id: 3,
        image:
          "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80",
        label: "Garden",
      },
      {
        id: 4,
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
        label: "Reception",
      },
    ],
    reviews: [
      {
        id: 1,
        author: "Elena M.",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
        rating: 5,
        date: "2 months ago",
        comment:
          "Absolutely stunning venue! The staff were incredibly helpful and made our wedding day perfect.",
      },
      {
        id: 2,
        author: "Andrei P.",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
        rating: 4,
        date: "3 months ago",
        comment:
          "Beautiful location, but some minor issues with the catering service. Overall, a great experience.",
      },
    ],
  },
  {
    id: 2,
    name: "The Secret Garden",
    location: "Cluj-Napoca, Romania",
    capacity: "Up to 150 guests",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    priceRange: "$$",
    style: "Garden",
    description:
      "A romantic garden venue surrounded by nature. Perfect for couples seeking an intimate outdoor celebration with rustic charm and natural beauty.",
    pricing: "Packages starting from 90 EUR per person",
    rating: 4.6,
    reviewCount: 89,
    gallery: [
      {
        id: 1,
        image:
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
        label: "Garden",
      },
      {
        id: 2,
        image:
          "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80",
        label: "Ceremony Area",
      },
      {
        id: 3,
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
        label: "Reception",
      },
    ],
    reviews: [
      {
        id: 1,
        author: "Maria V.",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
        rating: 5,
        date: "1 month ago",
        comment: "Magical garden setting! Highly recommend for nature lovers.",
      },
    ],
  },
  {
    id: 3,
    name: "The Royal Estate",
    location: "Iași, Romania",
    capacity: "Up to 300 guests",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    priceRange: "$$$$",
    style: "Luxury",
    description:
      "Experience royal treatment at our luxurious estate. With grand architecture, premium amenities, and world-class service, your wedding will be truly unforgettable.",
    pricing: "Packages starting from 180 EUR per person",
    rating: 4.9,
    reviewCount: 156,
    gallery: [
      {
        id: 1,
        image:
          "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
        label: "Ballroom",
      },
      {
        id: 2,
        image:
          "https://images.unsplash.com/photo-1519167758481-83f29da8fd36?w=800&q=80",
        label: "Grand Hall",
      },
      {
        id: 3,
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
        label: "Terrace",
      },
      {
        id: 4,
        image:
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
        label: "Gardens",
      },
    ],
    reviews: [
      {
        id: 1,
        author: "Alexandru D.",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Absolutely phenomenal! Worth every penny. The service was impeccable.",
      },
      {
        id: 2,
        author: "Ioana S.",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
        rating: 5,
        date: "1 month ago",
        comment: "Dream venue! Everything was perfect from start to finish.",
      },
    ],
  },
];

export const VENUE_FILTERS = [
  { id: "capacity", label: "Capacity" },
  { id: "style", label: "Style" },
  { id: "price", label: "Price Range" },
];
