import ChatInterface from "@/components/chat-interface"

export default function Home() {
  // This is a server component, so we can't use useEffect here
  // The scroll reset is handled in the ChatInterface component

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900">
      <ChatInterface />
    </main>
  )
}
