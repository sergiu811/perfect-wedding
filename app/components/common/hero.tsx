import React from "react";

export const Hero = () => (
  <div className="relative h-[40vh] w-full overflow-hidden">
    <div
      className="absolute inset-0 bg-center bg-cover"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80)",
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-pink-50 via-pink-50/60 to-transparent" />
  </div>
);
