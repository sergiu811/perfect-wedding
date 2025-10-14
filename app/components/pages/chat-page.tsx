import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  MoreVertical,
  CheckCheck,
  DollarSign,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "~/contexts/router-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface ChatPageProps {
  vendorId: string;
}

interface ChatMessage {
  id: string;
  sender: "couple" | "vendor";
  message: string;
  timestamp: string;
  type: "text" | "offer" | "booking";
  offerDetails?: {
    price: string;
    services: string[];
    date: string;
  };
}

const SAMPLE_CHAT: ChatMessage[] = [
  {
    id: "1",
    sender: "couple",
    message:
      "Hi! We're interested in booking your venue for July 12, 2026. We're expecting around 150 guests.",
    timestamp: "10:30 AM",
    type: "text",
  },
  {
    id: "2",
    sender: "vendor",
    message:
      "Hello! Thank you for reaching out. We'd love to host your special day! July 12, 2026 is available. Let me send you our package details.",
    timestamp: "10:45 AM",
    type: "text",
  },
  {
    id: "3",
    sender: "vendor",
    message: "Booking Offer",
    timestamp: "10:46 AM",
    type: "offer",
    offerDetails: {
      price: "$15,000",
      services: [
        "Venue rental for 8 hours",
        "Tables, chairs, and linens for 150 guests",
        "Premium lighting and sound system",
        "Full bar service",
        "Dedicated event coordinator",
        "Complimentary parking and valet",
        "Bridal suite access",
      ],
      date: "July 12, 2026",
    },
  },
];

export const ChatPage = ({ vendorId }: ChatPageProps) => {
  const { navigate } = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_CHAT);
  const [newMessage, setNewMessage] = useState("");
  const [showOfferForm, setShowOfferForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Offer form state
  const [offerData, setOfferData] = useState({
    price: "",
    date: "",
    services: [""],
  });

  const vendorName = "The Grand Ballroom";
  const vendorAvatar =
    "https://images.unsplash.com/photo-1519167758481-83f29da8fd36?w=200&q=80";
  
  // Check if current user is vendor (in real app, this would come from auth context)
  const isVendor = true; // Set to true for demo purposes

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: "couple",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      type: "text",
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleAcceptOffer = (offerId: string) => {
    console.log("Accepting offer:", offerId);
    navigate("/my-bookings");
  };

  const addService = () => {
    setOfferData({
      ...offerData,
      services: [...offerData.services, ""],
    });
  };

  const updateService = (index: number, value: string) => {
    const newServices = [...offerData.services];
    newServices[index] = value;
    setOfferData({ ...offerData, services: newServices });
  };

  const removeService = (index: number) => {
    const newServices = offerData.services.filter((_, i) => i !== index);
    setOfferData({ ...offerData, services: newServices });
  };

  const handleSendOffer = () => {
    const offer: ChatMessage = {
      id: Date.now().toString(),
      sender: "vendor",
      message: "Booking Offer",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      type: "offer",
      offerDetails: {
        price: offerData.price,
        services: offerData.services.filter((s) => s.trim() !== ""),
        date: offerData.date,
      },
    };

    setMessages([...messages, offer]);
    setShowOfferForm(false);
    setOfferData({ price: "", date: "", services: [""] });
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-pink-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-3 flex-1">
          <button onClick={() => navigate("/messages")} className="text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div
            className="w-10 h-10 rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url(${vendorAvatar})` }}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-gray-900 truncate">
              {vendorName}
            </h1>
            <p className="text-xs text-gray-500">Venue</p>
          </div>
        </div>
        <button className="text-gray-600 hover:text-gray-900">
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "couple" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.type === "offer" ? (
              // Offer Card
              <div className="max-w-[85%] bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Booking Offer</p>
                    <p className="text-xs text-gray-500">{msg.timestamp}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Total Price</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {msg.offerDetails?.price}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-2">Event Date</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {msg.offerDetails?.date}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-2">Included Services</p>
                    <ul className="space-y-1.5">
                      {msg.offerDetails?.services.map((service, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-gray-700 flex items-start gap-2"
                        >
                          <CheckCheck className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleAcceptOffer(msg.id)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg h-10 font-semibold"
                    >
                      Accept Offer
                    </Button>
                    <Button className="flex-1 bg-white hover:bg-gray-100 text-gray-900 rounded-lg h-10 font-semibold border border-gray-300">
                      Negotiate
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // Regular Message
              <div
                className={`max-w-[75%] ${
                  msg.sender === "couple"
                    ? "bg-rose-600 text-white"
                    : "bg-white text-gray-900"
                } rounded-2xl px-4 py-3 shadow-sm`}
              >
                <p className="text-sm leading-relaxed">{msg.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === "couple"
                      ? "text-white/70"
                      : "text-gray-500"
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Offer Form Modal */}
      {showOfferForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Create Booking Offer</h3>
              <button
                onClick={() => setShowOfferForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Price */}
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">
                  Total Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    value={offerData.price}
                    onChange={(e) =>
                      setOfferData({ ...offerData, price: e.target.value })
                    }
                    placeholder="15,000"
                    className="w-full pl-10 h-12 border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Event Date */}
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">
                  Event Date *
                </label>
                <Input
                  type="date"
                  value={offerData.date}
                  onChange={(e) =>
                    setOfferData({ ...offerData, date: e.target.value })
                  }
                  className="w-full h-12 border-gray-300 rounded-lg"
                />
              </div>

              {/* Services */}
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">
                  Included Services *
                </label>
                <div className="space-y-2">
                  {offerData.services.map((service, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={service}
                        onChange={(e) => updateService(index, e.target.value)}
                        placeholder="e.g., Venue rental for 8 hours"
                        className="flex-1 h-10 border-gray-300 rounded-lg text-sm"
                      />
                      {offerData.services.length > 1 && (
                        <button
                          onClick={() => removeService(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addService}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Service
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowOfferForm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl h-12 font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendOffer}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-12 font-semibold"
                >
                  Send Offer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        {isVendor && (
          <div className="mb-3">
            <button
              onClick={() => setShowOfferForm(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl h-11 font-semibold flex items-center justify-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Send Booking Offer
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <ImageIcon className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="w-full bg-gray-100 border-0 rounded-xl h-11 px-4"
            />
          </div>
          <button
            onClick={handleSend}
            className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
