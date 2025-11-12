import React from "react";
import { ChatPage } from "./chat-page";

interface ChatWrapperProps {
  conversationId: string;
}

export const ChatWrapper = ({ conversationId }: ChatWrapperProps) => {
  return <ChatPage conversationId={conversationId} />;
};
