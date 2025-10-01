import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, Eye, Flag, MessageSquare, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';

interface ModerationCase {
  id: string;
  type: 'spam' | 'harassment' | 'inappropriate' | 'fake_news' | 'violence';
  status: 'pending' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reportedUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  reportedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  description: string;
  evidence: string[];
  createdAt: string;
  resolvedAt?: string;
  assignedTo?: {
    id: string;
    name: string;
  };
}

const mockCases: ModerationCase[] = [
  {
    id: '1',
    type: 'harassment',
    status: 'pending',
    priority: 'high',
    reportedUser: {
      id: 'user1',
      name: 'João Silva',
      avatar: ''
    },
    reportedBy: {
      id: 'user2',
      name: 'Maria Santos',
      avatar: ''
    },
    description: 'Usuário está enviando mensagens ofensivas repetidamente no grupo Moradores do Centro.',
    evidence: ['Screenshot das mensagens', 'Histórico de conversas'],
    createdAt: '2024-01-15T10:30:00Z',
    assignedTo: {
      id: 'mod1',
      name: 'Moderador Carlos'
    }
  },
  {
    id: '2',
    type: 'spam',
    status: 'resolved',
    priority: 'medium',
    reportedUser: {
      id: 'user3',
      name: 'Pedro Costa'
    },
    reportedBy: {
      id: 'user4',
      name: 'Ana Oliveira'
    },
    description: 'Usuário está enviando links suspeitos e propagandas não solicitadas.',
    evidence: ['Capturas de tela', 'URLs reportadas'],
    createdAt: '2024-01-14T15:20:00Z',
    resolvedAt: '2024-01-15T09:15:00Z'
  },
  {
    id: '3',
    type: 'inappropriate',
    status: 'pending',
    priority: 'urgent',
    reportedUser: {
      id: 'user5',
      name: 'Carlos Mendes'
    },
    reportedBy: {
      id: 'user6',
      name: 'Lucia Ferreira'
    },
    description: 'Conteúdo inapropriado sendo compartilhado em grupo público.',
    evidence: ['Imagens reportadas', 'Testemunhas'],
    createdAt: '2024-01-15T14:45:00Z'
  }
];

const typeLabels = {
  spam: 'Spam',
  harassment: 'Assédio',
  inappropriate: 'Conteúdo Inapropriado',
  fake_news: 'Notícias Falsas',
  violence: 'Violência'
};

const statusLabels = {
  pending: 'Pendente',
  resolved: 'Resolvido',
  dismissed: 'Arquivado'
};

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente'
};

const priorityColors = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
};

const Police = () => {
  const { user, loading: authLoading } = useAuth();
  const [cases, setCases] = useState<ModerationCase[]>(mockCases);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(false);

  const filteredCases = cases.filter(case_ => {
    if (activeTab === 'all') return true;
    return case_.status === activeTab;
  });

  const stats = {
    total: cases.length,
    pending: cases.filter(c => c.status === 'pending').length,
    resolved: cases.filter(c => c.status === 'resolved').length,
    urgent: cases.filter(c => c.priority === 'urgent').length
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-muted rounded-xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
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
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-city p-3 rounded-xl shadow-glow">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Delegacia Virtual</h1>
              <p className="text-muted-foreground">
                Centro de moderação e segurança da comunidade
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Casos</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Eye className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolvidos</p>
                  <p className="text-2xl font-bold text-green-500">{stats.resolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Urgentes</p>
                  <p className="text-2xl font-bold text-red-500">{stats.urgent}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cases Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Casos de Moderação</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pending">Pendentes ({stats.pending})</TabsTrigger>
                <TabsTrigger value="resolved">Resolvidos ({stats.resolved})</TabsTrigger>
                <TabsTrigger value="dismissed">Arquivados</TabsTrigger>
                <TabsTrigger value="all">Todos ({stats.total})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="space-y-4">
                  {filteredCases.map(case_ => (
                    <Card key={case_.id} className="hover:shadow-elegant transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${priorityColors[case_.priority]}`}></div>
                                <Badge variant="secondary">
                                  {typeLabels[case_.type]}
                                </Badge>
                                <Badge 
                                  variant={case_.status === 'resolved' ? 'default' : 
                                          case_.status === 'pending' ? 'destructive' : 'secondary'}
                                >
                                  {statusLabels[case_.status]}
                                </Badge>
                                <Badge variant="outline">
                                  Prioridade: {priorityLabels[case_.priority]}
                                </Badge>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                #{case_.id}
                              </span>
                            </div>

                            <p className="text-sm mb-4 leading-relaxed">
                              {case_.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-3">
                                <Flag className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">Usuário Reportado</p>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={case_.reportedUser.avatar} />
                                      <AvatarFallback className="text-xs">
                                        {case_.reportedUser.name.slice(0, 2).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-muted-foreground">
                                      {case_.reportedUser.name}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">Reportado por</p>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={case_.reportedBy.avatar} />
                                      <AvatarFallback className="text-xs">
                                        {case_.reportedBy.name.slice(0, 2).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-muted-foreground">
                                      {case_.reportedBy.name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  Criado em {new Date(case_.createdAt).toLocaleDateString('pt-BR')} às {new Date(case_.createdAt).toLocaleTimeString('pt-BR')}
                                </span>
                              </div>
                              {case_.assignedTo && (
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4" />
                                  <span>Atribuído a {case_.assignedTo.name}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            {case_.status === 'pending' && (
                              <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Resolver
                                </Button>
                                <Button size="sm" variant="outline">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Comentar
                                </Button>
                                <Button size="sm" variant="destructive">
                                  <AlertTriangle className="h-4 w-4 mr-2" />
                                  Escalar
                                </Button>
                              </>
                            )}
                            {case_.status === 'resolved' && case_.resolvedAt && (
                              <div className="text-sm text-green-600">
                                <CheckCircle className="h-4 w-4 inline mr-1" />
                                Resolvido em {new Date(case_.resolvedAt).toLocaleDateString('pt-BR')}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredCases.length === 0 && (
                    <Card className="text-center py-12">
                      <CardContent>
                        <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">Nenhum caso encontrado</h3>
                        <p className="text-muted-foreground">
                          {activeTab === 'pending' 
                            ? 'Não há casos pendentes no momento.' 
                            : `Não há casos ${statusLabels[activeTab as keyof typeof statusLabels]?.toLowerCase()} no momento.`}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Police;