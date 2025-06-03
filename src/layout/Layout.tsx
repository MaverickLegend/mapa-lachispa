import type { ReactNode } from "react";
import "./Layout.css";

export const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="my-container">
      <header className="bg-gray-800 text-white">
        <h1 className="text-xl">Mapa test</h1>
      </header>
      <main className="w-full">{children}</main>
    </div>
  );
};
