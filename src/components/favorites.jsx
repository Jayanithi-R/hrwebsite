import React, { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [
      { label: "New Hire Onboarding", path: "/onboarding", color: "#22c55e", badge: 1 },
      { label: "Leave Requests", path: "/leaves", color: "#ef4444", badge: 2 },
      { label: "Performance Reviews", path: "/reviews", color: "#f59e0b", badge: 3 },
    ];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (label, path) => {
    if (!label || !path) return;
    const colors = ["#3b82f6", "#8b5cf6", "#f97316", "#22c55e", "#ef4444", "#f59e0b"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    setFavorites((prev) => [
      ...prev,
      { label, path, color, badge: Math.floor(Math.random() * 5) + 1 },
    ]);
  };

  const removeFavorite = (label) => {
    setFavorites((prev) => prev.filter((f) => f.label !== label));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
