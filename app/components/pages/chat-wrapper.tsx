import React from "react";
import { ChatPage } from "./chat-page";

interface ChatWrapperProps {
  conversationId: string;
}

export const ChatWrapper = ({ conversationId }: ChatWrapperProps) => {
  // Chat page should be full width, override the main container margin
  return (
    <div className="lg:-ml-64 xl:-ml-72 w-full lg:w-[calc(100vw-16rem)] xl:w-[calc(100vw-18rem)]">
      <ChatPage conversationId={conversationId} />
    </div>
  );
};
