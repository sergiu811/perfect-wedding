import React from "react";
import { ChatPage } from "./chat-page";

interface ChatWrapperProps {
  vendorId: string;
}

export const ChatWrapper = ({ vendorId }: ChatWrapperProps) => {
  return <ChatPage vendorId={vendorId} />;
};
