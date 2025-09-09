import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send } from "lucide-react";
import ChatHeader from "../components/chatHeader";


export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [patient, setPatient] = useState(null);

  // Fetch patient info on mount
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patient = await axios.get("http://localhost:3000/api/v1/users/user/get-patient-exist", {withCredentials: true});
        console.log(patient.data);
        if (patient.data.success) {
           const res = await axios.get("http://localhost:3000/api/v1/users/user/history-info", { withCredentials: true });
           console.log("Patient Info : " , res.data);
           setPatient(res.data); // {id, name, age, medical_records} 
        }else{
          const res = await axios.get("http://localhost:3000/api/v1/users/user/user-without-history", { withCredentials: true });
          console.log("Patient Info : " , res.data);
          setPatient(res.data);
        }
      } catch (err) {
        console.error("Error fetching patient info:", err);
      }
    };

    fetchPatient();
  }, []);

  // Handle send
  const handleSend = async () => {
    // if (!input.trim() || !patient) return;

    const userMsg = { id: Date.now(), from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Send chat request with patient info
      const res = await axios.post(
      "http://localhost:3000/api/v1/chatbot/chat/",
      {
        user: patient,
        message: input,
      },
      {
        withCredentials: true,
      }
      
      );

      const botReply = res.data?.response || "No response from server.";
      const botMsg = { id: Date.now() + 1, from: "bot", text: botReply };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto scroll to latest
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
     
      {messages.length === 0 && <ChatHeader />}

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-xs ${
              msg.from === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-white text-gray-900 self-start mr-auto border"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-500 text-sm">CeyHealth AI is thinking...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-8 bg-white shadow-md flex justify-center">
        <div className="flex gap-2 w-full max-w-5xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-md"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}