"use client";

import { useState } from "react";
import { UserPlus, UserMinus } from "lucide-react";
import { addFriend, removeFriend } from "@/app/actions/social";
import { useRouter } from "next/navigation";

export function FriendButton({ targetUsername, initialIsFriend }: { targetUsername: string, initialIsFriend: boolean }) {
  const [isFriend, setIsFriend] = useState(initialIsFriend);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    if (isFriend) {
      const res = await removeFriend(targetUsername);
      if (res.success) {
        setIsFriend(false);
        router.refresh();
      }
    } else {
      const res = await addFriend(targetUsername);
      if (res.success) {
        setIsFriend(true);
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={`px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
        isFriend 
          ? 'bg-white/10 text-white hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 border border-transparent' 
          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 border border-blue-500'
      }`}
    >
      {isFriend ? <UserMinus size={18} /> : <UserPlus size={18} />}
      {isFriend ? "Amigos" : "Añadir a Amigos"}
    </button>
  );
}
