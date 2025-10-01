import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, Edit3, MapPin, Calendar, Award, Users, Eye, Heart, MessageCircle, Settings, Home, BookOpen, Music, Film, Lightbulb, Sofa, Image, Flower } from 'lucide-react';
import { SalaDeEstar } from '@/components/house/SalaDeEstar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import { Biblioteca } from '@/components/house/biblioteca/Biblioteca';

// Tipos para decoração da sala (compatível com JSON)
type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonValue[];
type JsonObject = { [key: string]: JsonValue };
type JsonValue = JsonPrimitive | JsonArray | JsonObject;

interface RoomDecorationItem {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
    z?: number;
  };
  rotation?: number;
  scale?: number;
  properties?: Record<string, JsonValue>;
}

type RoomDecorations = Record<string, RoomDecorationItem> | null;

// Tipos adicionais
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

interface Community {
  id: string;
  name: string;
  icon: string;
  members: number;
}

const HouseFacade = ({ 
  coverUrl, 
  avatarUrl, 
  status,
  onCoverChange,
  onAvatarChange,
  level = 1,
  customBackgroundUnlocked = false
}: { 
  coverUrl?: string;
  avatarUrl?: string;
  status?: string;
  onCoverChange?: (file: File) => void;
  onAvatarChange?: (file: File) => void;
  level?: number;
  customBackgroundUnlocked?: boolean;
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const defaultCoverUrl = '/central-plaza-background.jpg'; // Background padrão da praça central
  
  return (
    <div className="relative group">
      {/* Capa */}
      <div 
        className="h-48 bg-cover bg-center transition-all duration-300 rounded-t-lg"
        style={{ 
          backgroundImage: `url(${coverUrl || defaultCoverUrl})`,
          filter: isHovering ? 'brightness(0.9)' : 'brightness(1)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Botão de edição de capa */}
        {customBackgroundUnlocked && (
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <label className="cursor-pointer bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg">
              <Camera className="h-5 w-5" />
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && onCoverChange?.(e.target.files[0])}
              />
            </label>
          </div>
        )}
        
        {/* Indicador de nível necessário para personalização */}
        {!customBackgroundUnlocked && (
          <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm">
            Desbloqueie no nível 5 (Nível atual: {level})
          </div>
        )}
      </div>
      
      {/* Avatar e status */}
      <div className="absolute -bottom-16 left-6 flex items-end gap-4">
        <div className="relative group">
          <div className="relative w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
            <img 
              src={avatarUrl || '/default-avatar.png'} 
              alt="Avatar"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full">
                <Camera className="h-5 w-5" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && onAvatarChange?.(e.target.files[0])}
                />
              </label>
            </div>
          </div>
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${
            status === 'online' ? 'bg-green-500' : 'bg-gray-400'
          }`} />
        </div>
        
        <div className="mb-4">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-medium">{status || 'Online'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface HouseRoomProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOwner?: boolean;
  decorations?: string[];
}

const HouseRoom = ({ title, icon, children, isOwner = false, decorations = [] }: HouseRoomProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {decorations.length > 0 && (
        <div className="text-muted-foreground">
          {decorations.join(' ')}
        </div>
      )}
    </CardHeader>
    <CardContent className="pt-2">
      {children}
    </CardContent>
  </Card>
);

const VisitorsBook = () => (
  <div className="text-center py-8 text-muted-foreground">
    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
    <p>Mural de recados em construção</p>
  </div>
);

const HouseCustomization = () => (
  <Button size="icon" variant="outline">
    <Settings className="h-4 w-4" />
  </Button>
);

interface Profile {
  id: string;
  user_id: string;
  casa_name: string;
  bio: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  background_url: string | null;
  theme_color: string;
  location: string | null;
  reputation_points: number;
  level: number;
  custom_background_unlocked: boolean;
  visit_count: number;
  badges: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
  house_style: string;
  house_color: string;
  house_number: string;
  street_name: string;
  garden_items: string[];
  room_decorations: RoomDecorations;
  status: string;
  favorite_music: string | null;
  favorite_books: string[];
  favorite_movies: string[];
  house_motto: string | null;
}

const Profile = () => {
  // Dados de exemplo para demonstração
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: '1',
      name: 'Cidadão Destaque',
      description: 'Por ser um membro ativo da comunidade',
      icon: '🏆',
      color: 'bg-yellow-100 text-yellow-800',
      unlocked: true
    },
    // Adicione mais badges conforme necessário
  ]);

  const [friends, setFriends] = useState<Friend[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [activeTab, setActiveTab] = useState('living-room');
  const [status, setStatus] = useState('Online e pronto para interagir! 😊');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [tempStatus, setTempStatus] = useState('');
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    casa_name: '',
    bio: '',
    location: '',
    house_motto: ''
  });

  const isOwnProfile = !userId || userId === user?.id;

  const fetchProfile = useCallback(async () => {
    if (!user && !userId) return;
    
    try {
      setLoading(true);
      const targetUserId = userId || user?.id;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (error) throw error;
      
      if (data) {
        // Converte os dados do perfil para o tipo Profile
        let roomDecorations: RoomDecorations = null;
        
        if (data.room_decorations && typeof data.room_decorations === 'object' && !Array.isArray(data.room_decorations)) {
          // Converte para o tipo RoomDecorations de forma segura
          roomDecorations = data.room_decorations as unknown as RoomDecorations;
        }
        
        const profileData: Profile = {
          ...data,
          room_decorations: roomDecorations
        };
        
        setProfile(profileData);
        // Atualiza os dados de edição quando o perfil é carregado
        setEditData({
          casa_name: data.casa_name,
          bio: data.bio || '',
          location: data.location || '',
          house_motto: data.house_motto || ''
        });

        // Incrementa o contador de visitas se for o perfil de outra pessoa
        if (!isOwnProfile && user && data.visit_count !== undefined) {
          await supabase
            .from('profiles')
            .update({ visit_count: data.visit_count + 1 })
            .eq('user_id', targetUserId);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      if (!isOwnProfile) {
        toast({
          title: "Casa não encontrada",
          description: "Esta casa virtual não existe ou não é pública.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }
      
      toast({
        title: "Erro ao carregar perfil",
        description: "Não foi possível carregar as informações do perfil.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, userId, isOwnProfile, navigate, toast]);

  // Efeito para carregar o perfil quando o componente monta ou quando o usuário muda
  useEffect(() => {
    if (!authLoading) {
      if (!user && !userId) {
        navigate('/auth');
        return;
      }
      fetchProfile();
    }
  }, [user, userId, authLoading, fetchProfile, navigate]);

  // Função para salvar as alterações do perfil
  const saveProfileChanges = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update(editData)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas alterações foram salvas com sucesso."
      });
      
      setIsEditing(false);
      await fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    setLoading(true);
    
    try {
      const updates = {
        casa_name: editData.casa_name,
        bio: editData.bio,
        location: editData.location,
        house_motto: editData.house_motto,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Erro ao salvar",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Casa atualizada!",
        description: "Suas informações foram salvas com sucesso."
      });

      setIsEditing(false);
      await fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  interface HouseCustomizationData {
    house_style?: string;
    house_color?: string;
    house_number?: string;
    street_name?: string;
    garden_items?: string[];
room_decorations?: Partial<RoomDecorations>;
  }

  const handleHouseCustomization = async (customization: HouseCustomizationData) => {
    if (!user || !profile) return;

    try {
      // Cria um objeto de atualização seguro para o Supabase
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString()
      };
      
      // Adiciona apenas as propriedades definidas
      if (customization.house_style !== undefined) updateData.house_style = customization.house_style;
      if (customization.house_color !== undefined) updateData.house_color = customization.house_color;
      if (customization.house_number !== undefined) updateData.house_number = customization.house_number;
      if (customization.street_name !== undefined) updateData.street_name = customization.street_name;
      if (customization.garden_items !== undefined) updateData.garden_items = customization.garden_items;
      if (customization.room_decorations !== undefined) updateData.room_decorations = customization.room_decorations;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Casa personalizada!",
        description: "Sua fachada foi atualizada com sucesso."
      });

      fetchProfile();
    } catch (error) {
      console.error('Error updating house customization:', error);
      toast({
        title: "Erro ao personalizar",
        description: "Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-muted rounded-xl"></div>
            <div className="h-32 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile && isOwnProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <Card>
            <CardContent className="py-8">
              <h2 className="text-xl font-semibold mb-4">Casa em Construção</h2>
              <p className="text-muted-foreground mb-4">
                Sua casa virtual está sendo preparada. Isso pode levar alguns instantes.
              </p>
              <Button onClick={() => window.location.reload()}>
                Verificar novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <Card>
            <CardContent className="py-8">
              <h2 className="text-xl font-semibold mb-4">Casa Não Encontrada</h2>
              <p className="text-muted-foreground mb-4">
                Esta casa virtual não existe ou não é pública.
              </p>
              <Button onClick={() => navigate('/')}>
                <Home className="h-4 w-4 mr-2" />
                Voltar à Praça Central
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleCoverChange = async (file: File) => {
    if (!user || !profile) return;

    if (!profile.custom_background_unlocked) {
      toast({
        title: "Recurso bloqueado",
        description: "Você precisa atingir o nível 5 para personalizar o background",
        variant: "destructive"
      });
      return;
    }

    try {
      // Gera um nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `covers/${fileName}`;
  
      // Upload do arquivo para o storage do Supabase
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
  
      if (uploadError) throw uploadError;
  
      // Obtém a URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
  
      // Atualiza o perfil com a nova URL do background
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ background_url: publicUrl })
        .eq('user_id', user.id);
  
      if (updateError) throw updateError;
  
      // Atualiza o estado local
      setProfile(prev => prev ? { ...prev, background_url: publicUrl } : null);
  
      toast({
        title: "Background atualizado!",
        description: "A imagem de fundo foi atualizada com sucesso."
      });
  
    } catch (error) {
      console.error('Error updating background:', error);
      toast({
        title: "Erro ao atualizar background",
        description: "Não foi possível fazer o upload da imagem. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleAvatarChange = async (file: File) => {
    if (!user || !profile) return;

    try {
      // Gera um nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
  
      // Upload do arquivo para o storage do Supabase
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
  
      if (uploadError) throw uploadError;
  
      // Obtém a URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
  
      // Atualiza o perfil com a nova URL do avatar
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);
  
      if (updateError) throw updateError;
  
      // Atualiza o estado local
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
  
      toast({
        title: "Avatar atualizado!",
        description: "Sua foto de perfil foi atualizada com sucesso."
      });
  
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast({
        title: "Erro ao atualizar avatar",
        description: "Não foi possível fazer o upload da imagem. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleStatusUpdate = () => {
    if (tempStatus.trim()) {
      setStatus(tempStatus);
    }
    setIsEditingStatus(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Cabeçalho com capa e avatar */}
        <Card className="overflow-hidden mb-6">
          <HouseFacade 
            coverUrl={profile?.cover_url} 
            avatarUrl={profile?.avatar_url}
            status={status}
            onCoverChange={handleCoverChange}
            onAvatarChange={handleAvatarChange}
            level={profile?.reputation_points || 1}
            customBackgroundUnlocked={(profile?.reputation_points || 0) >= 5}
          />
          
          <CardContent className="pt-20 pb-6 px-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile?.casa_name}</h1>
                
                {/* Status editável */}
                <div className="mt-1">
                  {isEditingStatus ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={tempStatus}
                        onChange={(e) => setTempStatus(e.target.value)}
                        placeholder="Como você está se sentindo?"
                        className="flex-1 max-w-md"
                        autoFocus
                      />
                      <Button size="sm" onClick={handleStatusUpdate}>
                        Salvar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsEditingStatus(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => isOwnProfile && setIsEditingStatus(true)}
                    >
                      {status || 'Adicionar status...'}
                    </div>
                  )}
                </div>
                
                {/* Localização */}
                {profile?.location && (
                  <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                {/* Data de criação */}
                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Criada em {new Date(profile?.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              {/* Botões de ação */}
              <div className="flex items-center gap-2">
                {isOwnProfile ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Editar Casa
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Casa</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="casa_name">Nome da Casa</Label>
                          <Input
                            id="casa_name"
                            value={editData.casa_name}
                            onChange={(e) => setEditData(prev => ({ ...prev, casa_name: e.target.value }))}
                            placeholder="Nome da sua casa virtual"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Sobre</Label>
                          <Textarea
                            id="bio"
                            value={editData.bio}
                            onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Conte sobre sua casa virtual..."
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Localização</Label>
                          <Input
                            id="location"
                            value={editData.location}
                            onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Sua cidade ou região"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="house_motto">Lema da Casa</Label>
                          <Input
                            id="house_motto"
                            value={editData.house_motto}
                            onChange={(e) => setEditData(prev => ({ ...prev, house_motto: e.target.value }))}
                            placeholder="Um lema que representa sua casa"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button onClick={handleSaveProfile} className="flex-1">
                            Salvar
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <>
                    <Button variant="default" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Adicionar Amigo
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Enviar Mensagem
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Abas dos cômodos */}
        <Tabs defaultValue="living-room" className="space-y-6">
          <TabsList className="grid grid-cols-6 gap-4">
            <TabsTrigger value="living-room" className="flex items-center gap-2">
              <Sofa className="h-4 w-4" />
              <span className="hidden sm:inline">Sala</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Biblioteca</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Galeria</span>
            </TabsTrigger>
            <TabsTrigger value="garden" className="flex items-center gap-2">
              <Flower className="h-4 w-4" />
              <span className="hidden sm:inline">Jardim</span>
            </TabsTrigger>
            <TabsTrigger value="trophy-room" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Troféus</span>
            </TabsTrigger>
            <TabsTrigger value="cinema" className="flex items-center gap-2">
              <Film className="h-4 w-4" />
              <span className="hidden sm:inline">Cinema</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="living-room">
            <HouseRoom
              title="Sala de Estar"
              icon={<Sofa className="h-5 w-5" />}
              isOwner={isOwnProfile}
              decorations={['📺', '🛋️', '🖼️']}
            >
              <SalaDeEstar />
            </HouseRoom>
          </TabsContent>

          <TabsContent value="library">
            <Biblioteca />
          </TabsContent>

          <TabsContent value="gallery">
            <HouseRoom
              title="Galeria"
              icon={<Image className="h-5 w-5" />}
              isOwner={isOwnProfile}
              decorations={['📸', '🖼️', '🎨']}
            >
              <div className="text-center py-8 text-muted-foreground">
                <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Galeria em construção</p>
              </div>
            </HouseRoom>
          </TabsContent>

          <TabsContent value="garden">
            <HouseRoom
              title="Jardim"
              icon={<Flower className="h-5 w-5" />}
              isOwner={isOwnProfile}
              decorations={['🌺', '🌳', '🪴']}
            >
              <div className="text-center py-8 text-muted-foreground">
                <Flower className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Jardim em construção</p>
              </div>
            </HouseRoom>
          </TabsContent>

          <TabsContent value="trophy-room">
            <HouseRoom
              title="Sala de Troféus"
              icon={<Award className="h-5 w-5" />}
              isOwner={isOwnProfile}
              decorations={['🏆', '🎖️', '⭐']}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Estatísticas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>Visitas</span>
                      </div>
                      <span className="font-semibold">{profile.visit_count}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span>Reputação</span>
                      </div>
                      <span className="font-semibold">{profile.reputation_points}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Amigos</span>
                      </div>
                      <span className="font-semibold">0</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Conquistas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Conquistas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile.badges.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.badges.map((badge, index) => (
                          <Badge key={index} variant="secondary">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Nenhuma conquista ainda</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </HouseRoom>
          </TabsContent>

          <TabsContent value="cinema">
            <HouseRoom
              title="Cinema"
              icon={<Film className="h-5 w-5" />}
              isOwner={isOwnProfile}
              decorations={['🎬', '🎥', '🍿']}
            >
              <div className="text-center py-8 text-muted-foreground">
                <Film className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Cinema em construção</p>
              </div>
            </HouseRoom>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;