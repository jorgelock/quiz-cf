import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface QuizData {
  nome: string;
  telefone: string;
  email: string;
}

export const Quiz = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [step, setStep] = useState<"welcome" | "name" | "phone" | "email" | "completed">("welcome");
  const [quizData, setQuizData] = useState<QuizData>({ nome: "", telefone: "", email: "" });
  const [showButtons, setShowButtons] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // URL do webhook do n8n
  const WEBHOOK_URL = "https://n8n.lockpainel.shop/webhook/quiz";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Inicializar o chat com animação
  useEffect(() => {
    const initializeChat = async () => {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addMessage("Olá, seja bem vindo", true);
      setIsTyping(false);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addMessage("Sou atendente virtual da Redshark e vou iniciar seu atendimento...", true);
      setIsTyping(false);

      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addMessage("Antes de iniciar, me conta mais sobre o que procura...", true);
      setIsTyping(false);

      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addMessage("Você utiliza ergogênico hoje?", true);
      setIsTyping(false);
      setShowButtons(true);
    };

    if (messages.length === 0) {
      initializeChat();
    }
  }, []);

  const addMessage = (text: string, isBot: boolean) => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      isBot,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const userMessage = currentInput.trim();
    addMessage(userMessage, false);
    setCurrentInput("");

    // Simulate typing delay
    setTimeout(() => {
      handleBotResponse(userMessage);
    }, 1000);
  };

  const handleButtonClick = async (response: string) => {
    addMessage(response, false);
    setShowButtons(false);
    
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    addMessage("Perfeito! Agora preciso do seu nome completo:", true);
    setIsTyping(false);
    setStep("name");
  };

  const handleBotResponse = async (userInput: string) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    switch (step) {
      case "name":
        setQuizData((prev) => ({ ...prev, nome: userInput }));
        addMessage(
          `Prazer em conhecê-lo, ${userInput}! 😊 Agora, pode me informar seu telefone?`,
          true
        );
        setStep("phone");
        break;

      case "phone":
        setQuizData((prev) => ({ ...prev, telefone: userInput }));
        addMessage(
          "Ótimo! Agora preciso do seu email:",
          true
        );
        setStep("email");
        break;

      case "email":
        const finalData = { ...quizData, email: userInput };
        setQuizData(finalData);
        
        // Enviar dados para o webhook
        await sendToWebhook(finalData);
        
        addMessage(
          "✅ Perfeito! Seus dados foram registrados com sucesso!",
          true
        );
        setStep("completed");
        break;

      default:
        break;
    }
    
    setIsTyping(false);
  };

  const sendToWebhook = async (data: QuizData) => {
    try {
      const dataToSend = {
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        timestamp: new Date().toISOString(),
        origem: "Quiz Redshark",
      };

      console.log("Enviando dados para webhook:", dataToSend);

      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      toast({
        title: "Sucesso!",
        description: "Dados enviados com sucesso!",
      });

    } catch (error) {
      console.error("Erro ao enviar webhook:", error);
      toast({
        title: "Aviso",
        description: "Dados coletados com sucesso!",
      });
    }
  };

  const handleWhatsAppRedirect = () => {
    // Substitua pelo link do seu grupo do WhatsApp
    const whatsappGroupUrl = "https://chat.whatsapp.com/SEU_LINK_DO_GRUPO";
    window.open(whatsappGroupUrl, '_blank');
  };

  const resetQuiz = () => {
    setMessages([]);
    setStep("welcome");
    setQuizData({ nome: "", telefone: "", email: "" });
    setCurrentInput("");
    setShowButtons(false);
    
    // Reiniciar o chat
    setTimeout(() => {
      const initializeChat = async () => {
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        addMessage("Olá, seja bem vindo", true);
        setIsTyping(false);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        addMessage("Sou atendente virtual da Redshark e vou iniciar seu atendimento...", true);
        setIsTyping(false);

        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        addMessage("Antes de iniciar, me conta mais sobre o que procura...", true);
        setIsTyping(false);

        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        addMessage("Você utiliza ergogênico hoje?", true);
        setIsTyping(false);
        setShowButtons(true);
      };

      initializeChat();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-[var(--chat-shadow)] border-2 border-border">
        <div className="bg-card rounded-t-lg p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Bot className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">Quiz Assistant</h3>
              <p className="text-sm text-muted-foreground">Online agora</p>
            </div>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 bg-card">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
              >
                <div className="flex items-start gap-2 max-w-[80%]">
                  {message.isBot && (
                    <div className="w-8 h-8 rounded-full bg-[var(--chat-bot-bg)] flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-secondary" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg transition-all duration-300 animate-fade-in ${
                      message.isBot
                        ? "bg-white text-gray-800 border border-gray-200"
                        : "bg-[var(--chat-user-bg)] text-accent-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {!message.isBot && (
                    <div className="w-8 h-8 rounded-full bg-[var(--chat-user-bg)] flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-accent-foreground" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--chat-bot-bg)] flex items-center justify-center">
                    <Bot className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Botões de resposta para a primeira pergunta */}
            {showButtons && (
              <div className="flex justify-end">
                <div className="flex gap-2 max-w-[80%]">
                  <Button
                    onClick={() => handleButtonClick("SIM")}
                    className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-full"
                  >
                    SIM
                  </Button>
                  <Button
                    onClick={() => handleButtonClick("NÃO")}
                    className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-full"
                  >
                    NÃO
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border bg-card rounded-b-lg">
          {step !== "completed" && !showButtons ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder={
                  step === "name"
                    ? "Digite seu nome completo..."
                    : step === "phone"
                    ? "Digite seu número de WhatsApp..."
                    : step === "email"
                    ? "Digite seu email..."
                    : "Digite sua mensagem..."
                }
                className="flex-1 bg-input border-border text-card-foreground placeholder:text-muted-foreground"
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="default"
                disabled={!currentInput.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          ) : step === "completed" ? (
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleWhatsAppRedirect}
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                ENTRAR NO GRUPO
              </Button>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
};
