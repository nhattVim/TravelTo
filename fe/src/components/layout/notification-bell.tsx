"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { getUnreadNotificationCount, getNotifications, markNotificationRead } from "@/lib/api/private";
import { NotificationDto } from "@/types/travel";
import Link from "next/link";
import { formatDateVi } from "@/lib/format";

export function NotificationBell({ token }: { token: string }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    getUnreadNotificationCount(token).then((res) => setUnreadCount(res.unreadCount)).catch(() => {});
  }, [token]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = async () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState && notifications.length === 0) {
      try {
        const res = await getNotifications(token, { page: 0, size: 5 });
        setNotifications(res.items);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleRead = async (id: number) => {
    try {
      await markNotificationRead(token, id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="relative p-2 rounded-full hover:bg-[#e4fff4] transition text-[#26584a] focus:outline-none">
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_12px_24px_rgba(10,125,89,0.15)] border border-[#cdece0] overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-[#eafbf3]">
            <h4 className="font-semibold text-[#074432]">Thông báo</h4>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-gray-500">Chưa có thông báo nào</p>
            ) : (
              notifications.map((n) => (
                <Link 
                  key={n.id} 
                  href={n.relatedUrl || "#"}
                  onClick={() => !n.isRead && handleRead(n.id)}
                  className={`block p-4 border-b border-gray-50 hover:bg-gray-50 transition ${!n.isRead ? 'bg-[#f4fffc]' : ''}`}
                >
                  <p className={`text-sm leading-snug ${!n.isRead ? 'font-semibold text-[#074432]' : 'text-gray-600'}`}>{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDateVi(n.createdAt)}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
