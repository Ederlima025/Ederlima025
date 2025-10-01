import { useState, useEffect } from 'react';
import { Users, MapPin, Shield, MessageSquare, Calendar, TrendingUp, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  isPublic: boolean;
  createdAt: string;
  avatarUrl?: string;
  recentActivity: number;
}

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Moradores do Centro',
    description: 'Grupo para discussões sobre melhorias no centro de T-Ville.',
    memberCount: 156,
    category: 'Bairro',
    isPublic: true,
    createdAt: '2024-01-15',
    recentActivity: 24
  },
  {
    id: '2',
    name: 'Gamers Unidos',
    description: 'Comunidade de jogadores para organizar eventos e campeonatos.',
    memberCount: 89,
    category: 'Entretenimento',
    isPublic: true,
    createdAt: '2024-02-20',
    recentActivity: 48
  },
  {
    id: '3',
    name: 'Empreendedores Virtuais',
    description: 'Networking e discussões sobre negócios em T-Ville.',
    memberCount: 234,
    category: 'Negócios',
    isPublic: true,
    createdAt: '2024-01-05',
    recentActivity: 12
  },
  {
    id: '4',
    name: 'Arte & Cultura',
    description: 'Espaço para artistas e apreciadores de cultura compartilharem criações.',
    memberCount: 78,
    category: 'Cultura',
    isPublic: true,
    createdAt: '2024-03-01',
    recentActivity: 72
  }
];

const categories = ['Todos', 'Bairro', 'Entretenimento', 'Negócios', 'Cultura', 'Esportes', 'Tecnologia'];

const Neighborhood = () => {
  const { user, loading: authLoading } = useAuth();
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(false);

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-muted rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Vizinhança</h1>
              <p className="text-muted-foreground">
                Descubra e participe dos grupos da sua comunidade virtual
              </p>
            </div>
            <Button className="bg-gradient-city shadow-glow">
              <Plus className="h-4 w-4 mr-2" />
              Criar Grupo
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar grupos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Grupos</p>
                  <p className="text-2xl font-bold">{groups.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Membros</p>
                  <p className="text-2xl font-bold">{groups.reduce((acc, group) => acc + group.memberCount, 0)}</p>
                </div>
                <MapPin className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Grupos Ativos</p>
                  <p className="text-2xl font-bold">{groups.filter(g => g.recentActivity < 48).length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categorias</p>
                  <p className="text-2xl font-bold">{categories.length - 1}</p>
                </div>
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map(group => (
            <Card key={group.id} className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={group.avatarUrl} />
                      <AvatarFallback className="bg-gradient-sunset text-white">
                        {group.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {group.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {group.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{group.memberCount} membros</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {group.recentActivity < 24 ? 'Ativo hoje' : 
                         group.recentActivity < 48 ? 'Ativo ontem' : 
                         `${Math.floor(group.recentActivity / 24)} dias atrás`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Criado em {new Date(group.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4">
                    Participar do Grupo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Nenhum grupo encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory !== 'Todos' 
                  ? 'Tente ajustar seus filtros de busca.' 
                  : 'Seja o primeiro a criar um grupo na vizinhança!'}
              </p>
              {!searchTerm && selectedCategory === 'Todos' && (
                <Button className="bg-gradient-city shadow-glow">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Grupo
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Neighborhood;