"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Message } from "ai/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Bot } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full space-x-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex relative h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e9fff3] text-[#13aa77]">
          <Bot size={18} />
        </div>
      )}
      
      <div
        className={cn(
          "relative flex max-w-[80%] flex-col rounded-2xl px-4 py-2 text-sm shadow-sm",
          isUser
            ? "bg-[#13aa77] text-white rounded-br-sm"
            : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 [&>p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&>h3]:text-base [&>h3]:font-bold [&>h3]:mb-2 [&_strong]:font-semibold [&_strong]:text-[#0d3528]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex relative h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600">
          <User size={18} />
        </div>
      )}
    </div>
  );
}
