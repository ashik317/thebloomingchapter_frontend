"use client";

import ChatBox from "@/components/ChatBox";

export default function MessagesPage() {
  return (
    <div>
      <h1 className="h-display text-3xl">Messages</h1>
      <p className="mb-6 mt-1 text-sm text-ink/60">Ask us about a book, a custom bouquet, or your order. We usually reply within the hour.</p>
      <ChatBox endpoint="/chat/messages/" emptyText="Say hello! Our team will reply here and by email." />
    </div>
  );
}
