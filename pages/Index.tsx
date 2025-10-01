import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import CreatePost from "@/components/posts/CreatePost";
import PostCard from "@/components/posts/PostCard";
import FriendsList from "@/components/sidebar/FriendsList";
import TrendingTopics from "@/components/sidebar/TrendingTopics";
import WeeklyRanking from "@/components/sidebar/WeeklyRanking";
import SuggestedConnections from "@/components/sidebar/SuggestedConnections";
import FeedFilters from "@/components/feed/FeedFilters";
import FeedNotification from "@/components/feed/FeedNotification";
import { Badge } from "@/components/ui/badge";

// Mock data para o MVP
const mockPosts = [
  {
    id: 1,
    author: "Casa do João",
    timeAgo: "2 min atrás",
    content: "Acabei de terminar de pintar a fachada da minha casa! Ficou incrível com essa cor azul. Agora ela realmente parece uma casa à beira-mar 🏠🎨",
    likes: 12,
    comments: 4,
    userLevel: 8,
    isLiked: true
  },
  {
    id: 2,
    author: "Vila da Maria",
    timeAgo: "15 min atrás", 
    content: "Pessoal, alguém sabe se vai ter a feira orgânica este fim de semana na praça central? Preciso comprar umas verduras fresquinhas para o almoço de domingo!",
    likes: 7,
    comments: 8,
    userLevel: 12
  },
  {
    id: 3,
    author: "Lar do Pedro",
    timeAgo: "32 min atrás",
    content: "Organizando uma partida de futebol amanhã às 16h no campo da comunidade. Quem topa? Vamos nos divertir e movimentar o corpo! ⚽",
    likes: 23,
    comments: 12,
    userLevel: 5
  },
  {
    id: 4,
    author: "Cantinho da Ana",
    timeAgo: "1h atrás",
    content: "Meu jardim está florindo lindamente nesta primavera! As rosas ficaram perfeitas. Nada como ter um cantinho verde para relaxar depois do trabalho 🌹🌿",
    likes: 31,
    comments: 6,
    userLevel: 15,
    isLiked: true
  }
];

const Index = () => {
  const { user, loading } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [showNotification, setShowNotification] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-muted rounded-xl"></div>
            <div className="h-64 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-purple">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Esquerdo */}
          <div className="hidden lg:block space-y-6">
            <FriendsList />
          </div>
          
          {/* Feed Principal - Praça Central */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header da Praça Central */}
            <div className="text-center py-8 px-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-elegant border border-white/20">
              <Badge className="bg-gradient-sunset text-white px-4 py-1.5 mb-3 shadow-md">
                🏙️ Praça Central
              </Badge>
              <h1 className="text-4xl font-bold bg-gradient-city bg-clip-text text-transparent mb-2">
                Bem-vindo à Praça Central
              </h1>
              <p className="text-muted-foreground text-lg">
                O coração pulsante de T-Ville
              </p>
            </div>
            
            {/* Notificações do Feed */}
            {showNotification && (
              <FeedNotification
                type="comment"
                message="🔥 Seu post recebeu 5 novos comentários!"
                onDismiss={() => setShowNotification(false)}
              />
            )}
            
            {/* Filtros do Feed */}
            <FeedFilters 
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
            
            {/* Seção: Últimas da sua Vizinhança */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 px-2">
                <div className="h-1 w-12 bg-gradient-city rounded-full"></div>
                <h2 className="text-xl font-bold text-foreground">
                  📍 Últimas da sua Vizinhança
                </h2>
                <div className="h-1 flex-1 bg-gradient-city/30 rounded-full"></div>
              </div>
              
              <CreatePost />
              
              <div className="space-y-6">
                {mockPosts.slice(0, 2).map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>
            </div>
            
            {/* Seção: Tendências da Praça */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 px-2">
                <div className="h-1 w-12 bg-gradient-sunset rounded-full"></div>
                <h2 className="text-xl font-bold text-foreground">
                  🔥 Tendências da Praça
                </h2>
                <div className="h-1 flex-1 bg-gradient-sunset/30 rounded-full"></div>
              </div>
              
              <div className="space-y-6">
                {mockPosts.slice(2).map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar Direito */}
          <div className="hidden lg:block space-y-6">
            <WeeklyRanking />
            <TrendingTopics />
            <SuggestedConnections />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
