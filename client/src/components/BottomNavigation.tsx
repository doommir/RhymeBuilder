import { Link } from "wouter";

interface BottomNavigationProps {
  active: "home" | "practice" | "battles" | "vault" | "profile";
}

export default function BottomNavigation({ active }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 py-2 px-4 z-10">
      <div className="max-w-5xl mx-auto flex justify-around">
        <Link href="/dashboard">
          <a className={`flex flex-col items-center px-3 py-2 ${active === "home" ? "text-primary" : "text-gray-400"}`}>
            <i className={`${active === "home" ? "ri-home-5-fill" : "ri-home-5-line"} text-xl`}></i>
            <span className={`text-xs mt-1 ${active === "home" ? "font-medium" : ""}`}>Home</span>
          </a>
        </Link>
        <Link href="/practice">
          <a className={`flex flex-col items-center px-3 py-2 ${active === "practice" ? "text-primary" : "text-gray-400"}`}>
            <i className={`${active === "practice" ? "ri-mic-fill" : "ri-mic-line"} text-xl`}></i>
            <span className={`text-xs mt-1 ${active === "practice" ? "font-medium" : ""}`}>Practice</span>
          </a>
        </Link>
        <Link href="/battles">
          <a className={`flex flex-col items-center px-3 py-2 ${active === "battles" ? "text-primary" : "text-gray-400"}`}>
            <i className={`${active === "battles" ? "ri-trophy-fill" : "ri-trophy-line"} text-xl`}></i>
            <span className={`text-xs mt-1 ${active === "battles" ? "font-medium" : ""}`}>Battles</span>
          </a>
        </Link>
        <Link href="/rhymepad">
          <a className={`flex flex-col items-center px-3 py-2 ${active === "vault" ? "text-primary" : "text-gray-400"}`}>
            <i className={`${active === "vault" ? "ri-book-fill" : "ri-book-line"} text-xl`}></i>
            <span className={`text-xs mt-1 ${active === "vault" ? "font-medium" : ""}`}>Flow Vault</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className={`flex flex-col items-center px-3 py-2 ${active === "profile" ? "text-primary" : "text-gray-400"}`}>
            <i className={`${active === "profile" ? "ri-user-fill" : "ri-user-line"} text-xl`}></i>
            <span className={`text-xs mt-1 ${active === "profile" ? "font-medium" : ""}`}>Profile</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
