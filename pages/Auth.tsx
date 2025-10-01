import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Home, UserPlus, LogIn, KeyRound } from 'lucide-react';
import tvilleLogo from '@/assets/t-ville-logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import CityBackground from '@/components/animations/CityBackground';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, signUp, signIn, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    casaName: ''
  });

  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(
      signUpData.email, 
      signUpData.password,
      {
        casa_name: signUpData.casaName || 'Minha Casa',
        bio: 'Bem-vindo à minha casa virtual!'
      }
    );
    
    if (!error) {
      // Reset form
      setSignUpData({ email: '', password: '', confirmPassword: '', casaName: '' });
    }
    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(signInData.email, signInData.password);
    
    if (!error) {
      navigate('/');
    }
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-city flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-purple flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <CityBackground />
      <div className="w-full max-w-lg space-y-6 relative z-10">
        {/* Logo */}
        <div className="text-center space-y-3 animate-fade-in">
          <div className="mx-auto w-32 h-32">
            <img src={tvilleLogo} alt="T-Ville Logo" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">T-Ville</h1>
            <p className="text-white/90 text-lg font-medium mt-1">Sua comunidade urbana digital</p>
            <p className="text-white/70 text-sm mt-2">
              Bem-vindo de volta à T-Ville, onde sua vida digital acontece
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-4 pt-8 px-8">
            <CardTitle className="text-3xl font-bold">Acesso à Cidade</CardTitle>
            <CardDescription className="text-base mt-2">
              Entre na sua casa virtual ou construa uma nova
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-muted/50">
                <TabsTrigger 
                  value="signin" 
                  className="flex items-center gap-2 text-base data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  <LogIn className="h-4 w-4" />
                  Já tenho uma casa
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="flex items-center gap-2 text-base data-[state=active]:bg-gradient-sunset data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <UserPlus className="h-4 w-4" />
                  Sou novo aqui
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-5 mt-8">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-base">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Digite seu e-mail para entrar na Cidade"
                      value={signInData.email}
                      onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password" className="text-base">Senha</Label>
                      <Link to="#" className="text-sm text-primary hover:underline flex items-center gap-1">
                        <KeyRound className="h-3 w-3" />
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Digite sua senha"
                      value={signInData.password}
                      onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full h-14 text-lg bg-gradient-city hover:shadow-glow transition-all duration-300 font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Home className="h-5 w-5 mr-2" />
                    )}
                    Entrar na Cidade
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-5 mt-8">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signup-casa" className="text-base">Nome da sua Casa Virtual</Label>
                    <Input
                      id="signup-casa"
                      type="text"
                      placeholder="Casa do João, Vila Alegre..."
                      value={signUpData.casaName}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, casaName: e.target.value }))}
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-base">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Digite seu melhor e-mail"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-base">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      minLength={6}
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="text-base">Confirmar Senha</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="Repita sua senha"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      minLength={6}
                      className="h-12 text-base"
                    />
                  </div>
                  {signUpData.password && signUpData.confirmPassword && signUpData.password !== signUpData.confirmPassword && (
                    <p className="text-sm text-destructive font-medium">⚠️ As senhas não coincidem</p>
                  )}
                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-lg bg-gradient-sunset hover:shadow-glow transition-all duration-300 font-semibold"
                    disabled={isLoading || signUpData.password !== signUpData.confirmPassword}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <UserPlus className="h-5 w-5 mr-2" />
                    )}
                    Criar Minha Casa Virtual
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-white/70 text-sm space-y-2">
          <p>Ao continuar, você aceita nossos <Link to="#" className="underline hover:text-white">termos de uso</Link> e <Link to="#" className="underline hover:text-white">política de privacidade</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Auth;