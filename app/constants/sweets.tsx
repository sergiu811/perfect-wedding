export const SWEETS = [
  {
    id: 1,
    name: "Sweet Harmony Bakery",
    shortDescription: "Artisan wedding cakes and dessert bars.",
    description:
      "Indulge in exquisite sweet experiences tailored to your special day. Our pastry chefs craft bespoke desserts using the finest ingredients, ensuring a memorable sweet experience for you and your guests.",
    rating: 4.9,
    reviewCount: 145,
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b2df?w=800&q=80",
    specialty:
      "Modern European pastry with a focus on fresh, seasonal ingredients. We specialize in creating visually stunning and delicious desserts that reflect your personal style.",
    sampleMenus: [
      {
        id: 1,
        name: "Classic Elegance",
        title: "Multi-Tier Wedding Cake",
        description:
          "Custom designed cake with your choice of flavors and fillings",
        image:
          "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&q=80",
      },
      {
        id: 2,
        name: "Sweet Station",
        title: "Deluxe Dessert Bar",
        description: "Candy bar, macarons, cupcakes, and chocolate fountain",
        image:
          "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&q=80",
      },
    ],
    packages: [
      {
        id: 1,
        name: "Bronze",
        price: "$8",
        perPerson: true,
        features: ["Wedding Cake", "Choice of 2 Flavors", "Simple Decoration"],
      },
      {
        id: 2,
        name: "Silver",
        price: "$12",
        perPerson: true,
        features: [
          "Wedding Cake",
          "Choice of 3 Flavors",
          "Custom Decoration",
          "Mini Desserts",
        ],
        highlighted: true,
      },
      {
        id: 3,
        name: "Gold",
        price: "$18",
        perPerson: true,
        features: [
          "Premium Wedding Cake",
          "Unlimited Flavors",
          "Elaborate Decoration",
          "Candy Bar",
          "Customized Sweet Treats",
        ],
      },
    ],
    dietaryAccommodations:
      "We cater to all dietary needs, including sugar-free, gluten-free, vegan, and allergy-friendly options. Please inform us of any specific requirements during your consultation.",
    serviceOptions: [
      { label: "Tiered Wedding Cake", checked: true },
      { label: "Cupcake Tower", checked: false },
      { label: "Dessert Table", checked: false },
    ],
    reviews: [
      {
        id: 1,
        author: "Sophia Bennett",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
        rating: 5,
        date: "May 15, 2024",
        comment:
          "The cake was absolutely divine! Our guests raved about the flavors and presentation. The team was professional and attentive, making our wedding day truly unforgettable.",
      },
      {
        id: 2,
        author: "Ethan Carter",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
        rating: 5,
        date: "April 22, 2024",
        comment:
          "Sweet Harmony exceeded our expectations. The dessert bar was tailored to our preferences, and the service was impeccable. Highly recommend for any special event.",
      },
    ],
  },
  {
    id: 2,
    name: "Sugar & Spice Creations",
    shortDescription: "Custom wedding cakes and candy bars.",
    description:
      "Creating sweet memories with beautiful custom cakes and dessert displays that taste as good as they look.",
    rating: 4.8,
    reviewCount: 120,
    image:
      "https://images.unsplash.com/photo-1588195538326-c5b1e5b00888?w=800&q=80",
    specialty:
      "Specializing in custom decorated cakes and elaborate candy bars with premium chocolates and confections.",
    sampleMenus: [
      {
        id: 1,
        name: "Rustic Romance",
        title: "Semi-Naked Cake",
        description: "Rustic-style cake with fresh flowers and fruits",
        image:
          "https://images.unsplash.com/photo-1562440499-64c9a111f713?w=400&q=80",
      },
    ],
    packages: [
      {
        id: 1,
        name: "Basic",
        price: "$6",
        perPerson: true,
        features: ["Simple Cake", "Basic Decoration"],
      },
      {
        id: 2,
        name: "Premium",
        price: "$10",
        perPerson: true,
        features: ["Custom Cake", "Dessert Bar"],
        highlighted: true,
      },
    ],
    dietaryAccommodations:
      "We offer gluten-free, vegan, and sugar-free options for all our desserts.",
    serviceOptions: [
      { label: "Tiered Wedding Cake", checked: true },
      { label: "Cupcake Tower", checked: false },
      { label: "Dessert Table", checked: false },
    ],
    reviews: [],
  },
  {
    id: 3,
    name: "Divine Desserts Studio",
    shortDescription: "Elegant cakes and gourmet desserts.",
    description:
      "Elevate your celebration with our elegant custom cakes and gourmet dessert selections.",
    rating: 4.7,
    reviewCount: 98,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
    specialty:
      "Modern cake designs with artistic flair and premium dessert selections.",
    sampleMenus: [
      {
        id: 1,
        name: "Modern Elegance",
        title: "Geometric Cake Design",
        description: "Contemporary cake with modern geometric patterns",
        image:
          "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80",
      },
    ],
    packages: [
      {
        id: 1,
        name: "Starter",
        price: "$7",
        perPerson: true,
        features: ["Wedding Cake", "Simple Design"],
      },
    ],
    dietaryAccommodations:
      "We accommodate all dietary restrictions including vegan, gluten-free, and nut-free options.",
    serviceOptions: [
      { label: "Tiered Wedding Cake", checked: true },
      { label: "Cupcake Tower", checked: false },
      { label: "Dessert Table", checked: false },
    ],
    reviews: [],
  },
  {
    id: 4,
    name: "Candy Dreams Co.",
    shortDescription: "Premium candy bars and sweet stations.",
    description:
      "Create a sweet wonderland with our premium candy bars and dessert stations featuring gourmet treats.",
    rating: 4.6,
    reviewCount: 85,
    image:
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&q=80",
    specialty:
      "Specialty candy bars, chocolate fountains, and interactive sweet stations.",
    sampleMenus: [
      {
        id: 1,
        name: "Candy Wonderland",
        title: "Premium Candy Bar",
        description: "Assorted gourmet candies, chocolates, and treats",
        image:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80",
      },
    ],
    packages: [
      {
        id: 1,
        name: "Sweet",
        price: "$5",
        perPerson: true,
        features: ["Candy Bar", "Basic Selection"],
      },
      {
        id: 2,
        name: "Deluxe",
        price: "$9",
        perPerson: true,
        features: ["Candy Bar", "Premium Chocolates", "Chocolate Fountain"],
        highlighted: true,
      },
    ],
    dietaryAccommodations:
      "We offer sugar-free, vegan, and allergen-friendly candy options.",
    serviceOptions: [
      { label: "Tiered Wedding Cake", checked: false },
      { label: "Cupcake Tower", checked: false },
      { label: "Dessert Table", checked: true },
    ],
    reviews: [],
  },
];

export const SWEETS_FILTERS = [
  { id: "type", label: "Type" },
  { id: "style", label: "Style" },
  { id: "budget", label: "Budget" },
];
