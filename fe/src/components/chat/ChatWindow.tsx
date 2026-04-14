"use client";

import { useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { Send, Loader2, Minus } from "lucide-react";
import ChatMessage from "./ChatMessage";

interface ChatWindowProps {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: "Xin chào! Mình là trợ lý AI của TravelTo. Mình có thể giúp gì cho chuyến đi sắp tới của bạn?",
      },
    ],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-125 w-87.5 sm:w-100 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#13aa77] px-4 py-3 text-white">
        <div>
          <h3 className="font-semibold text-sm">Trợ lý Du lịch TravelTo</h3>
          <p className="text-xs text-[#e9fff3]">Luôn sẵn sàng hỗ trợ 24/7</p>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
          <Minus size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {isLoading && (
          <div className="flex items-center text-sm text-gray-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang trả lời...
          </div>
        )}
        {error && (
          <div className="my-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            <strong>⚠️ Lỗi kết nối AI:</strong> Hệ thống AI hiện đang quá tải hoặc tạm thời hết tài nguyên Token. Vui lòng thử lại sau!
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="border-t border-gray-100 bg-white p-3">
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ví dụ: Gợi ý cho tôi vài tour đi Đà Lạt..."
            className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2 pr-12 text-sm focus:border-[#13aa77] focus:outline-none focus:ring-1 focus:ring-[#13aa77]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#13aa77] text-white disabled:bg-gray-400 disabled:opacity-50 hover:bg-[#0f8a5f] transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
