export const INVITATIONS = [
  {
    id: 1,
    name: "Elegant Script Invitation",
    vendor: "Classic Paper Co.",
    shortDescription: "Delicate script font on high-quality textured paper.",
    description:
      "This invitation features a delicate script font on high-quality textured paper, perfect for a classic wedding. Available in blush pink or cream.",
    rating: 4.8,
    reviewCount: 25,
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
    customization: [
      { label: "Paper Type", value: "Textured Cardstock" },
      { label: "Printing Method", value: "Letterpress" },
      { label: "Design Elements", value: "Floral Accents" },
      { label: "Color Options", value: "Blush Pink, Cream" },
    ],
    pricing: [
      { quantity: "50 Invitations", price: "$250" },
      { quantity: "100 Invitations", price: "$450" },
      { quantity: "150 Invitations", price: "$600" },
    ],
    orderProcess:
      "1. Select your quantity and color. 2. Provide your wedding details. 3. Review and approve the design proof. 4. Finalize and place your order.",
    deliveryTimeline:
      "Estimated delivery within 2-3 weeks after design approval.",
    reviews: [
      {
        id: 1,
        author: "Sophia Bennett",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
        rating: 5,
        date: "2 months ago",
        comment:
          "Absolutely stunning invitations! The quality of the paper and the letterpress printing exceeded my expectations. The floral accents added a touch of elegance. Highly recommend!",
        likes: 12,
        dislikes: 2,
      },
      {
        id: 2,
        author: "Olivia Carter",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
        rating: 4,
        date: "3 months ago",
        comment:
          "Beautiful invitations, but the color was slightly different from what I expected. Overall, very satisfied with the design and quality.",
        likes: 8,
        dislikes: 1,
      },
    ],
  },
  {
    id: 2,
    name: "Modern Minimalist Suite",
    vendor: "Contemporary Designs",
    shortDescription: "Clean lines and modern typography for a chic look.",
    description:
      "Our modern minimalist invitation suite features clean lines and contemporary typography, perfect for couples seeking a sleek, modern aesthetic.",
    rating: 4.7,
    reviewCount: 18,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    customization: [
      { label: "Paper Type", value: "Premium Matte Cardstock" },
      { label: "Printing Method", value: "Digital Print" },
      { label: "Design Elements", value: "Geometric Borders" },
      { label: "Color Options", value: "White, Grey, Black" },
    ],
    pricing: [
      { quantity: "50 Invitations", price: "$200" },
      { quantity: "100 Invitations", price: "$380" },
      { quantity: "150 Invitations", price: "$520" },
    ],
    orderProcess:
      "1. Select your quantity and color. 2. Provide your wedding details. 3. Review and approve the design proof. 4. Finalize and place your order.",
    deliveryTimeline:
      "Estimated delivery within 2-3 weeks after design approval.",
    reviews: [],
  },
  {
    id: 3,
    name: "Rustic Kraft Invitations",
    vendor: "Rustic Paper Studio",
    shortDescription: "Natural kraft paper with twine and botanical details.",
    description:
      "Embrace natural beauty with our rustic kraft invitations featuring botanical illustrations and twine accents.",
    rating: 4.9,
    reviewCount: 32,
    image:
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80",
    customization: [
      { label: "Paper Type", value: "Kraft Paper" },
      { label: "Printing Method", value: "Screen Print" },
      { label: "Design Elements", value: "Botanical Illustrations" },
      { label: "Color Options", value: "Natural, White Ink" },
    ],
    pricing: [
      { quantity: "50 Invitations", price: "$180" },
      { quantity: "100 Invitations", price: "$340" },
      { quantity: "150 Invitations", price: "$480" },
    ],
    orderProcess:
      "1. Select your quantity and color. 2. Provide your wedding details. 3. Review and approve the design proof. 4. Finalize and place your order.",
    deliveryTimeline:
      "Estimated delivery within 2-3 weeks after design approval.",
    reviews: [],
  },
  {
    id: 4,
    name: "Vintage Lace Suite",
    vendor: "Vintage Romance Paper",
    shortDescription: "Romantic lace patterns with pearl embellishments.",
    description:
      "Our vintage lace suite features intricate lace patterns and delicate pearl details for a timeless romantic aesthetic.",
    rating: 4.6,
    reviewCount: 15,
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    customization: [
      { label: "Paper Type", value: "Shimmer Cardstock" },
      { label: "Printing Method", value: "Foil Stamping" },
      { label: "Design Elements", value: "Lace Patterns, Pearls" },
      { label: "Color Options", value: "Ivory, Rose Gold" },
    ],
    pricing: [
      { quantity: "50 Invitations", price: "$280" },
      { quantity: "100 Invitations", price: "$520" },
      { quantity: "150 Invitations", price: "$720" },
    ],
    orderProcess:
      "1. Select your quantity and color. 2. Provide your wedding details. 3. Review and approve the design proof. 4. Finalize and place your order.",
    deliveryTimeline:
      "Estimated delivery within 3-4 weeks after design approval.",
    reviews: [],
  },
];

export const INVITATION_FILTERS = [
  { id: "style", label: "Style" },
  { id: "paper", label: "Paper Type" },
  { id: "budget", label: "Budget" },
];
