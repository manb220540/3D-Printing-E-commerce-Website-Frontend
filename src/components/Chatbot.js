// import React, { useState } from "react";
// import { Button, Form, InputGroup, Spinner, Card } from "react-bootstrap";
// import { FaComments, FaTimes } from "react-icons/fa";

// const API_BASE = process.env.REACT_APP_BACKEND_API;

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const toggleChat = () => setIsOpen(!isOpen);

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const newMessage = { sender: "user", text: input };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch(`${API_BASE}/api/gemini/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: input }),
//       });

//       const data = await res.json();
//       const reply = { sender: "bot", text: data.response || "Lỗi từ server" };
//       setMessages((prev) => [...prev, reply]);
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "❌ Không kết nối được server." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* Nút Chat ở góc dưới trái */}
//       <div style={{ position: "fixed", bottom: 20, right: 30, zIndex: 1000 }}>
//         {!isOpen ? (
//           <Button
//             variant="primary"
//             onClick={toggleChat}
//             style={{ borderRadius: "50%", width: 60, height: 60 }}
//           >
//             <FaComments size={24} />
//           </Button>
//         ) : (
//           <Card style={{ width: 300, height: 400, display: "flex", flexDirection: "column" }}>
//             {/* Header */}
//             <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
//               <span>Smart Chatbot 🤖</span>
//               <FaTimes style={{ cursor: "pointer" }} onClick={toggleChat} />
//             </Card.Header>

//             {/* Nội dung chat */}
//             <Card.Body
//               style={{
//                 flex: 1,
//                 overflowY: "auto",
//                 backgroundColor: "#f8f9fa",
//               }}
//             >
//               {messages.map((msg, idx) => (
//                 <div
//                   key={idx}
//                   className={`d-flex mb-2 ${
//                     msg.sender === "user" ? "justify-content-end" : "justify-content-start"
//                   }`}
//                 >
//                   <div
//                     className={`p-2 rounded ${
//                       msg.sender === "user"
//                         ? "bg-primary text-white"
//                         : "bg-light border"
//                     }`}
//                     style={{ maxWidth: "80%" }}
//                   >
//                     {msg.text}
//                   </div>
//                 </div>
//               ))}
//               {loading && (
//                 <div className="text-center">
//                   <Spinner animation="border" size="sm" />
//                 </div>
//               )}
//             </Card.Body>

//             {/* Form nhập */}
//             <Card.Footer>
//               <Form onSubmit={sendMessage}>
//                 <InputGroup>
//                   <Form.Control
//                     type="text"
//                     placeholder="Nhập tin nhắn..."
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                   />
//                   <Button type="submit" variant="primary" disabled={loading}>
//                     Gửi
//                   </Button>
//                 </InputGroup>
//               </Form>
//             </Card.Footer>
//           </Card>
//         )}
//       </div>
//     </>
//   );
// };

// export default Chatbot;
import React, { useState, useEffect } from "react";
import { Button, Form, InputGroup, Spinner, Card } from "react-bootstrap";
import { FaComments, FaTimes, FaTrash } from "react-icons/fa";
import Cookies from "js-cookie";

const API_BASE = process.env.REACT_APP_BACKEND_API;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = Cookies.get("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Lưu vào cookie mỗi khi messages thay đổi
  useEffect(() => {
    Cookies.set("chatHistory", JSON.stringify(messages), { expires: 1 }); // lưu 1 ngày
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/gemini/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: updatedMessages, // gửi kèm lịch sử trong cookie
        }),
      });

      const data = await res.json();
      const reply = { sender: "bot", text: data.response || "Lỗi từ server" };
      setMessages((prev) => [...prev, reply]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Không kết nối được server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    Cookies.remove("chatHistory");
    setMessages([]);
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 30, zIndex: 1000 }}>
      {!isOpen ? (
        <Button
          variant="primary"
          onClick={toggleChat}
          style={{ borderRadius: "50%", width: 60, height: 60 }}
        >
          <FaComments size={24} />
        </Button>
      ) : (
        <Card style={{ width: 300, height: 400, display: "flex", flexDirection: "column" }}>
          <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
            <span>Chatbot</span>
            <div>
              <Button variant="light" size="sm" onClick={clearHistory}>
                <FaTrash />
              </Button>
              <FaTimes style={{ cursor: "pointer", marginLeft: 10 }} onClick={toggleChat} />
            </div>
          </Card.Header>

          <Card.Body style={{ flex: 1, overflowY: "auto", backgroundColor: "#f8f9fa" }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`d-flex mb-2 ${
                  msg.sender === "user" ? "justify-content-end" : "justify-content-start"
                }`}
              >
                <div
                  className={`p-2 rounded ${
                    msg.sender === "user" ? "bg-primary text-white" : "bg-light border"
                  }`}
                  style={{ maxWidth: "80%" }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-center">
                <Spinner animation="border" size="sm" />
              </div>
            )}
          </Card.Body>

          <Card.Footer>
            <Form onSubmit={sendMessage}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button type="submit" variant="primary" disabled={loading}>
                  Gửi
                </Button>
              </InputGroup>
            </Form>
          </Card.Footer>
        </Card>
      )}
    </div>
  );
};

export default Chatbot;
