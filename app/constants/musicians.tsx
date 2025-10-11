export const MUSICIANS = [
  {
    id: 1,
    type: "DJ",
    name: "DJ Seraphina",
    shortDescription: "Specializes in pop, electronic, and hip-hop music.",
    description:
      "DJ Seraphina brings a unique blend of elegance and energy to every wedding. With over 10 years of experience, she specializes in creating unforgettable musical experiences tailored to each couple's vision. Her style ranges from classic romantic melodies to modern upbeat tracks, ensuring a perfect soundtrack for your special day.",
    rating: 4.8,
    reviewCount: 25,
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    genres: ["Classical", "Jazz", "Pop", "Electronic", "Latin"],
    packages: [
      {
        id: 1,
        name: "Basic Package",
        title: "Ceremony & Reception",
        description:
          "Includes music for the ceremony, cocktail hour, and reception. Professional sound equipment and basic lighting provided.",
        price: "$1,500",
        image:
          "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80",
      },
      {
        id: 2,
        name: "Premium Package",
        title: "Full Day Coverage",
        description:
          "Comprehensive coverage from pre-ceremony to the end of the reception. Includes advanced sound and lighting, custom playlists, and a dedicated DJ assistant.",
        price: "$2,500",
        image:
          "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80",
      },
    ],
    audioSamples: [
      { id: 1, name: "Romantic Melodies Mix" },
      { id: 2, name: "Upbeat Dance Tracks" },
    ],
    reviews: [
      {
        id: 1,
        author: "Isabella Rossi",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
        rating: 5,
        date: "May 12, 2024",
        comment:
          "DJ Seraphina was absolutely amazing! She kept the dance floor packed all night and played a great mix of music that everyone loved. Highly recommend!",
      },
      {
        id: 2,
        author: "Ethan Carter",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
        rating: 4,
        date: "April 28, 2024",
        comment:
          "Seraphina was professional and played a good selection of music. There were a few minor hiccups, but overall, we were happy with her performance.",
      },
    ],
  },
  {
    id: 2,
    type: "Live Band",
    name: "The String Quartet",
    shortDescription: "Classical and romantic music for ceremonies.",
    description:
      "Our string quartet brings elegance and sophistication to your wedding ceremony. With years of classical training and performance experience, we provide beautiful music for your special moments.",
    rating: 4.9,
    reviewCount: 30,
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    genres: ["Classical", "Romantic", "Contemporary Classical"],
    packages: [
      {
        id: 1,
        name: "Ceremony Package",
        title: "Wedding Ceremony",
        description:
          "Beautiful string quartet performance for your ceremony. Includes prelude, processional, and recessional music.",
        price: "$1,200",
        image:
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80",
      },
    ],
    audioSamples: [{ id: 1, name: "Classical Wedding Collection" }],
    reviews: [],
  },
  {
    id: 3,
    type: "DJ",
    name: "DJ Beats",
    shortDescription: "Open format DJ with a wide range of music.",
    description:
      "DJ Beats is known for his ability to read the crowd and keep the energy high. With an extensive music library and years of experience, he creates the perfect atmosphere for any wedding celebration.",
    rating: 4.7,
    reviewCount: 18,
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
    genres: ["Hip Hop", "R&B", "Pop", "Rock", "Dance"],
    packages: [
      {
        id: 1,
        name: "Standard Package",
        title: "Reception Entertainment",
        description:
          "Full reception coverage with professional sound system. Custom playlist creation and MC services included.",
        price: "$1,800",
        image:
          "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80",
      },
    ],
    audioSamples: [{ id: 1, name: "Party Mix Highlights" }],
    reviews: [],
  },
  {
    id: 4,
    type: "Live Band",
    name: "The Jazz Trio",
    shortDescription: "Smooth jazz and blues for cocktail hours.",
    description:
      "Our jazz trio provides the perfect ambiance for cocktail hours and dinner service. With a repertoire spanning classic jazz standards to modern interpretations, we create an elegant atmosphere for your celebration.",
    rating: 4.6,
    reviewCount: 15,
    image:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",
    genres: ["Jazz", "Blues", "Swing", "Bossa Nova"],
    packages: [
      {
        id: 1,
        name: "Cocktail Hour Package",
        title: "Jazz for Cocktail Hour",
        description:
          "Live jazz trio performance for your cocktail hour. Creates an elegant, sophisticated atmosphere for your guests.",
        price: "$900",
        image:
          "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80",
      },
    ],
    audioSamples: [{ id: 1, name: "Jazz Standards Collection" }],
    reviews: [],
  },
];

export const MUSICIAN_FILTERS = [
  { id: "type", label: "Live Band/DJ" },
  { id: "genre", label: "Music Genre" },
  { id: "availability", label: "Availability" },
];
