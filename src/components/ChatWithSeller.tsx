import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/lib/types";
import { Trash, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { ImageUpload } from "./UploadImage";
import Image from "next/image";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";

type Message = {
  sender: "user" | "admin";
  text?: string;
  image?: string;
};

export default function ChatWithSeller({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "admin",
      text: `Hi! How can I help you with '${product?.name}'?`,
    },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleOpenChatDialog = () => {
    if (!user) return toast.warning("Please login to chat with seller");
    setOpen(true);
  };

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
  };

  const onRemove = (url: string) => {
    const newImages = images.filter((image) => image !== url);
    handleImagesChange(newImages);
  };

  const handleSend = () => {
    if (!input.trim() && images.length === 0) return;

    const newMessages: Message[] = [];

    if (input.trim()) {
      newMessages.push({ sender: "user", text: input });
    }

    images.forEach((img) => {
      newMessages.push({ sender: "user", image: img });
    });

    if (input.trim()) {
      newMessages.push({
        sender: "admin",
        text: "Thank you for your message! We'll get back to you soon.",
      });
    }

    setMessages((msgs) => [...msgs, ...newMessages]);
    setInput("");
    setImages([]);
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full h-12 text-base font-semibold flex items-center justify-center gap-2"
        onClick={handleOpenChatDialog}
      >
        <Zap className="h-5 w-5 text-primary" />
        Chat with Seller
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md w-full p-0 overflow-hidden">
          <DialogHeader className="bg-primary text-white px-6 py-4">
            <DialogTitle>Chat with Seller</DialogTitle>
          </DialogHeader>
          <div className="p-6 bg-background h-80 flex flex-col gap-4 border border-black">
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col space-y-1 mb-2 ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  {msg.text && (
                    <div
                      className={`rounded-2xl px-4 py-2 max-w-[75%] shadow-md ${
                        msg.sender === "user"
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-muted text-foreground rounded-bl-none"
                      }`}
                    >
                      <div className="text-sm">{msg.text}</div>
                    </div>
                  )}
                  {msg.image && (
                    <Image
                      src={msg.image}
                      alt="User sent"
                      width={150}
                      height={150}
                      className="rounded-md object-cover max-h-40"
                    />
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div>
              <div className="flex gap-2 overflow-x-auto mb-2">
                {images.map((url) => (
                  <div
                    key={url}
                    className="relative aspect-square rounded-md border h-14"
                  >
                    <div className="absolute top-1 left-1 z-10">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="w-5 h-5 text-xs rounded-full"
                        onClick={() => onRemove(url)}
                      >
                        ×
                      </Button>
                    </div>
                    <Image
                      width={100}
                      height={100}
                      className="object-cover w-full h-full rounded-md"
                      alt="Product image"
                      src={url || "/placeholder.svg"}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-2 items-end">
                <Textarea
                  value={input}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setInput(e.target.value)
                  }
                  placeholder="Type your message..."
                  className="resize-none min-h-[40px] max-h-24 flex-1"
                  onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <div className="flex gap-1 justify-center items-end">
                  <ImageUpload value={images} onChange={handleImagesChange} />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() && images.length === 0}
                    size="icon"
                    className="h-10 w-10"
                  >
                    <SendIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="bg-muted px-6 py-3 flex justify-end">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2 11 13" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m22 2-7 20-4-9-9-4 20-7z"
      />
    </svg>
  );
}
