"use client"

import { useState } from "react";
import { MessageCircleMore, X, SendHorizontal } from 'lucide-react';

const Support = () => {

  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <div>

      {isSupportOpen && <div className=" fixed z-50 bottom-30 right-10 shadow bg-white rounded-t-2xl rounded-b-2xl">
        <header className=" sticky top-0 flex items-center justify-between bg-[#43A047] py-6 px-3 rounded-t-2xl">
          <div className=" flex flex-col gap-0.5">
            <h2 className=" text-white text-[18px]">RentULO Support</h2>
            <p className=" text-white text-[13px]">We typically reply in few minutes</p>
          </div>
          <button className=" cursor-pointer" onClick={() => setIsSupportOpen(false)}>
            <X size={20} className=" text-white" />
          </button>
        </header>

        {/*  */}
        <div className=" flex flex-1 flex-col overflow-y-auto bg-[#F7F8FA] p-4"></div>

        {/*  */}
        <div className="border-t border-[#ddd] bg-white p-2.5">
          <form className="flex items-center gap-1.5">
            <input
              type="text"
              // value={message}
              // onChange={(e) => setMessage(e.target.value)}
              className="flex-1 rounded-3xl border border-[#ccc] px-4 py-2.5 outline-none"
              placeholder="Type a message..."
            // disabled={!activeConversationId}
            />
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-[#43A047] px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-70"
            // disabled={!message.trim() || !activeConversationId || isPending}
            >
              <SendHorizontal />
            </button>
          </form>
        </div>
      </div>}

      <button
        onClick={() => setIsSupportOpen(true)}
        className="fixed bottom-10 right-10 bg-[#43A047] text-white p-5 rounded-full shadow-2xl transition-all z-40 active:scale-90 cursor-pointer"
      >
        <MessageCircleMore size={32} />
      </button>
    </div>
  )
}

export default Support
