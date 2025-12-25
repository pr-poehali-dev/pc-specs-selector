import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface PCBuild {
  id: number;
  name: string;
  level: string;
  price: string;
  priceNum: number;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  fps: string;
  fpsNum: number;
  stores: { name: string; url: string }[];
}

const pcBuilds: PCBuild[] = [
  {
    id: 1,
    name: 'Начальный уровень',
    level: 'entry',
    price: '₽45,000',
    priceNum: 45000,
    cpu: 'Intel i3-12100F',
    gpu: 'GTX 1650',
    ram: '16GB DDR4',
    storage: '500GB NVMe',
    fps: '60 FPS в Full HD',
    fpsNum: 60,
    stores: [
      { name: 'DNS', url: '#' },
      { name: 'Ситилинк', url: '#' },
    ],
  },
  {
    id: 2,
    name: 'Средний уровень',
    level: 'mid',
    price: '₽85,000',
    priceNum: 85000,
    cpu: 'AMD Ryzen 5 5600X',
    gpu: 'RTX 4060',
    ram: '32GB DDR4',
    storage: '1TB NVMe',
    fps: '100+ FPS в Full HD',
    fpsNum: 100,
    stores: [
      { name: 'DNS', url: '#' },
      { name: 'МВидео', url: '#' },
    ],
  },
  {
    id: 3,
    name: 'Топовый уровень',
    level: 'high',
    price: '₽180,000',
    priceNum: 180000,
    cpu: 'AMD Ryzen 7 7800X3D',
    gpu: 'RTX 4080',
    ram: '32GB DDR5',
    storage: '2TB NVMe',
    fps: '144+ FPS в 2K',
    fpsNum: 144,
    stores: [
      { name: 'DNS', url: '#' },
      { name: 'Регард', url: '#' },
    ],
  },
];

const articles = [
  {
    id: 1,
    title: 'Как выбрать процессор для игр в 2024',
    description: 'Разбираем Intel vs AMD и какие модели подходят под разный бюджет',
    icon: 'Cpu',
  },
  {
    id: 2,
    title: 'Видеокарта: на что обратить внимание',
    description: 'VRAM, частоты, охлаждение - всё, что нужно знать о GPU',
    icon: 'Monitor',
  },
  {
    id: 3,
    title: 'Оперативная память: сколько нужно геймеру',
    description: 'Разница между DDR4 и DDR5, частоты и тайминги',
    icon: 'HardDrive',
  },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('builds');
  const [budgetFilter, setBudgetFilter] = useState<number>(200000);
  const [selectedGame, setSelectedGame] = useState('valorant');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Привет! Я помогу подобрать идеальную сборку ПК. Какой у тебя бюджет?' }
  ]);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('favoritePCBuilds');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id: number) => {
    const updated = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('favoritePCBuilds', JSON.stringify(updated));
  };

  const handleChatSend = () => {
    if (!userInput.trim()) return;
    
    const userMessage = { role: 'user' as const, text: userInput };
    setChatMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      let botResponse = '';
      const budget = userInput.match(/\d+/);
      
      if (budget) {
        const num = parseInt(budget[0]);
        if (num < 50000) {
          botResponse = 'Для бюджета до 50к подойдёт начальная сборка с i3 и GTX 1650. Она потянет большинство игр в Full HD на средних настройках!';
        } else if (num < 100000) {
          botResponse = 'С таким бюджетом рекомендую среднюю сборку на Ryzen 5 и RTX 4060. Отличное соотношение цена/качество для 1080p gaming!';
        } else {
          botResponse = 'При таком бюджете можно взять топовую сборку! Ryzen 7 7800X3D + RTX 4080 = ультра настройки в 2K с высоким FPS.';
        }
      } else if (userInput.toLowerCase().includes('игр')) {
        botResponse = 'Для онлайн-игр (Valorant, CS:GO) важны высокие FPS - от 144. Для AAA-игр (Cyberpunk, RDR2) нужна мощная видеокарта. Какие игры планируешь?';
      } else {
        botResponse = 'Чтобы помочь точнее, расскажи: какой у тебя бюджет и в какие игры хочешь играть? Например: "У меня 80 тысяч, играю в Valorant"';
      }
      
      setChatMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 800);
    
    setUserInput('');
  };

  const filteredBuilds = pcBuilds.filter(build => build.priceNum <= budgetFilter);
  const favoriteBuilds = pcBuilds.filter(build => favorites.includes(build.id));

  const gameRequirements = {
    valorant: { name: 'Valorant', minFps: 60, recFps: 144 },
    csgo: { name: 'CS:GO', minFps: 60, recFps: 144 },
    cyberpunk: { name: 'Cyberpunk 2077', minFps: 30, recFps: 60 },
    rdr2: { name: 'RDR 2', minFps: 30, recFps: 60 },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-glow-pulse blur-3xl" />
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-heading font-extrabold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              PC BUILD HUB
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Найди идеальную сборку для своих задач
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                <Icon name="Rocket" className="mr-2" size={20} />
                Подобрать сборку
              </Button>
              <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
                <Icon name="BookOpen" className="mr-2" size={20} />
                Читать гайды
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 mb-8">
              <TabsTrigger value="builds" className="data-[state=active]:bg-primary">
                <Icon name="Cpu" className="mr-2" size={16} />
                Сборки
              </TabsTrigger>
              <TabsTrigger value="favorites" className="data-[state=active]:bg-primary relative">
                <Icon name="Heart" className="mr-2" size={16} />
                Избранное
                {favorites.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-secondary text-xs">
                    {favorites.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="calculator" className="data-[state=active]:bg-primary">
                <Icon name="Calculator" className="mr-2" size={16} />
                Калькулятор
              </TabsTrigger>
              <TabsTrigger value="compare" className="data-[state=active]:bg-primary">
                <Icon name="GitCompare" className="mr-2" size={16} />
                Сравнение
              </TabsTrigger>
              <TabsTrigger value="articles" className="data-[state=active]:bg-primary">
                <Icon name="FileText" className="mr-2" size={16} />
                Статьи
              </TabsTrigger>
            </TabsList>

            <TabsContent value="builds" className="animate-fade-in">
              <Card className="border-primary/20 mb-6">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Фильтр по бюджету</CardTitle>
                  <CardDescription>Найди сборку в своём ценовом диапазоне</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Максимальная цена:</span>
                      <span className="text-2xl font-bold text-primary">₽{budgetFilter.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="30000"
                      max="200000"
                      step="5000"
                      value={budgetFilter}
                      onChange={(e) => setBudgetFilter(Number(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₽30,000</span>
                      <span>₽200,000</span>
                    </div>
                    <div className="text-center pt-2">
                      <Badge variant="outline" className="text-accent border-accent">
                        Найдено: {filteredBuilds.length} {filteredBuilds.length === 1 ? 'сборка' : 'сборки'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBuilds.map((build) => (
                  <Card
                    key={build.id}
                    className="border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="outline"
                          className={
                            build.level === 'entry'
                              ? 'border-accent text-accent'
                              : build.level === 'mid'
                              ? 'border-primary text-primary'
                              : 'border-secondary text-secondary'
                          }
                        >
                          {build.level === 'entry' ? 'НАЧАЛЬНЫЙ' : build.level === 'mid' ? 'СРЕДНИЙ' : 'ТОПОВЫЙ'}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-secondary/20"
                            onClick={() => toggleFavorite(build.id)}
                          >
                            <Icon
                              name={favorites.includes(build.id) ? 'Heart' : 'Heart'}
                              size={18}
                              className={favorites.includes(build.id) ? 'text-secondary fill-secondary' : 'text-muted-foreground'}
                            />
                          </Button>
                          <span className="text-2xl font-bold text-primary">{build.price}</span>
                        </div>
                      </div>
                      <CardTitle className="font-heading text-2xl">{build.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Icon name="Zap" size={16} className="text-accent" />
                        {build.fps}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Icon name="Cpu" size={16} className="text-primary" />
                        <span className="text-sm">{build.cpu}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Monitor" size={16} className="text-secondary" />
                        <span className="text-sm">{build.gpu}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="MemoryStick" size={16} className="text-accent" />
                        <span className="text-sm">{build.ram}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="HardDrive" size={16} className="text-primary" />
                        <span className="text-sm">{build.storage}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      {build.stores.map((store, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-primary/30 hover:bg-primary/20"
                          asChild
                        >
                          <a href={store.url} target="_blank" rel="noopener noreferrer">
                            <Icon name="ExternalLink" size={14} className="mr-1" />
                            {store.name}
                          </a>
                        </Button>
                      ))}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="animate-fade-in">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="font-heading text-3xl">Избранные сборки</CardTitle>
                  <CardDescription>
                    {favoriteBuilds.length === 0
                      ? 'Добавь сборки в избранное, чтобы быстро к ним вернуться'
                      : `Сохранено: ${favoriteBuilds.length} ${favoriteBuilds.length === 1 ? 'сборка' : 'сборки'}`}
                  </CardDescription>
                </CardHeader>
                {favoriteBuilds.length > 0 && (
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteBuilds.map((build) => (
                        <Card
                          key={build.id}
                          className="border-secondary/30 hover:border-secondary transition-all hover:shadow-lg hover:shadow-secondary/20"
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                              <CardTitle className="text-xl">{build.name}</CardTitle>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-destructive/20"
                                onClick={() => toggleFavorite(build.id)}
                              >
                                <Icon name="X" size={16} className="text-destructive" />
                              </Button>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Icon name="Cpu" size={14} className="text-primary" />
                                <span>{build.cpu}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Icon name="Monitor" size={14} className="text-secondary" />
                                <span>{build.gpu}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Icon name="Zap" size={14} className="text-accent" />
                                <span>{build.fps}</span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardFooter className="flex flex-col gap-2">
                            <div className="text-2xl font-bold text-primary w-full text-center">{build.price}</div>
                            <div className="flex gap-2 w-full">
                              {build.stores.map((store, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 border-primary/30 hover:bg-primary/20"
                                  asChild
                                >
                                  <a href={store.url} target="_blank" rel="noopener noreferrer">
                                    {store.name}
                                  </a>
                                </Button>
                              ))}
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="calculator" className="animate-fade-in">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="font-heading text-3xl">Калькулятор производительности</CardTitle>
                  <CardDescription>Узнай, какая сборка подойдёт для твоей игры</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Выбери игру:</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(gameRequirements).map(([key, game]) => (
                        <Button
                          key={key}
                          variant={selectedGame === key ? 'default' : 'outline'}
                          onClick={() => setSelectedGame(key)}
                          className={selectedGame === key ? 'bg-primary' : 'border-primary/30 hover:bg-primary/20'}
                        >
                          {game.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                    <h3 className="font-heading text-xl text-center mb-4">
                      Требования для {gameRequirements[selectedGame as keyof typeof gameRequirements].name}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-card border border-accent/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name="CheckCircle" size={20} className="text-accent" />
                          <span className="font-heading font-semibold">Минимум</span>
                        </div>
                        <p className="text-2xl font-bold text-accent">
                          {gameRequirements[selectedGame as keyof typeof gameRequirements].minFps} FPS
                        </p>
                      </div>
                      <div className="bg-card border border-primary/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name="Zap" size={20} className="text-primary" />
                          <span className="font-heading font-semibold">Рекомендуется</span>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          {gameRequirements[selectedGame as keyof typeof gameRequirements].recFps} FPS
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading text-xl mb-4">Подходящие сборки:</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {pcBuilds.map((build) => {
                        const gameReq = gameRequirements[selectedGame as keyof typeof gameRequirements];
                        const meetsMin = build.fpsNum >= gameReq.minFps;
                        const meetsRec = build.fpsNum >= gameReq.recFps;
                        
                        return (
                          <Card
                            key={build.id}
                            className={`border-2 transition-all ${
                              meetsRec
                                ? 'border-primary bg-primary/5'
                                : meetsMin
                                ? 'border-accent bg-accent/5'
                                : 'border-destructive/30 opacity-60'
                            }`}
                          >
                            <CardHeader>
                              <div className="flex items-center justify-between mb-2">
                                <CardTitle className="text-lg">{build.name}</CardTitle>
                                {meetsRec ? (
                                  <Badge className="bg-primary">
                                    <Icon name="Star" size={14} className="mr-1" />
                                    Отлично
                                  </Badge>
                                ) : meetsMin ? (
                                  <Badge variant="outline" className="border-accent text-accent">
                                    Подойдёт
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="border-destructive text-destructive">
                                    Слабо
                                  </Badge>
                                )}
                              </div>
                              <CardDescription className="flex items-center gap-2">
                                <Icon name="Zap" size={16} />
                                {build.fps}
                              </CardDescription>
                            </CardHeader>
                            <CardFooter className="flex flex-col gap-2">
                              <div className="text-2xl font-bold text-primary">{build.price}</div>
                              {meetsRec && (
                                <p className="text-xs text-center text-muted-foreground">
                                  Рекомендуем для комфортной игры
                                </p>
                              )}
                            </CardFooter>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compare" className="animate-fade-in">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="font-heading text-3xl">Сравнение характеристик</CardTitle>
                  <CardDescription>Выбери сборки для детального сравнения</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-primary/20">
                          <th className="text-left p-4 font-heading">Характеристика</th>
                          {pcBuilds.map((build) => (
                            <th key={build.id} className="text-center p-4 font-heading">
                              {build.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-primary/10 hover:bg-primary/5">
                          <td className="p-4 font-medium">Процессор</td>
                          {pcBuilds.map((build) => (
                            <td key={build.id} className="p-4 text-center">
                              {build.cpu}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-primary/10 hover:bg-primary/5">
                          <td className="p-4 font-medium">Видеокарта</td>
                          {pcBuilds.map((build) => (
                            <td key={build.id} className="p-4 text-center">
                              {build.gpu}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-primary/10 hover:bg-primary/5">
                          <td className="p-4 font-medium">Память</td>
                          {pcBuilds.map((build) => (
                            <td key={build.id} className="p-4 text-center">
                              {build.ram}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-primary/10 hover:bg-primary/5">
                          <td className="p-4 font-medium">Накопитель</td>
                          {pcBuilds.map((build) => (
                            <td key={build.id} className="p-4 text-center">
                              {build.storage}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-primary/10 hover:bg-primary/5">
                          <td className="p-4 font-medium">FPS</td>
                          {pcBuilds.map((build) => (
                            <td key={build.id} className="p-4 text-center font-bold text-accent">
                              {build.fps}
                            </td>
                          ))}
                        </tr>
                        <tr className="hover:bg-primary/5">
                          <td className="p-4 font-medium">Цена</td>
                          {pcBuilds.map((build) => (
                            <td key={build.id} className="p-4 text-center font-bold text-primary text-lg">
                              {build.price}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="articles" className="animate-fade-in">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Card
                    key={article.id}
                    className="border-primary/20 hover:border-secondary/50 transition-all hover:shadow-lg hover:shadow-secondary/20 cursor-pointer group"
                  >
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon name={article.icon as any} size={24} className="text-white" />
                      </div>
                      <CardTitle className="font-heading text-xl">{article.title}</CardTitle>
                      <CardDescription>{article.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="ghost" className="w-full group-hover:bg-primary/10">
                        Читать далее
                        <Icon name="ArrowRight" size={16} className="ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <footer className="border-t border-primary/20 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 PC Build Hub. Помогаем выбрать лучшую сборку для игр</p>
        </div>
      </footer>

      {chatOpen && (
        <Card className="fixed bottom-4 right-4 w-96 max-h-[600px] border-primary/30 shadow-2xl shadow-primary/20 z-50 animate-slide-in-right">
          <CardHeader className="bg-gradient-to-r from-primary to-secondary p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon name="MessageCircle" size={20} className="text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">Ассистент PC Builder</CardTitle>
                  <CardDescription className="text-white/80 text-xs">Онлайн</CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => setChatOpen(false)}
              >
                <Icon name="X" size={18} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 h-[400px] overflow-y-auto space-y-3">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="p-4 border-t border-primary/20">
            <div className="flex gap-2 w-full">
              <input
                type="text"
                placeholder="Напиши сообщение..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                className="flex-1 px-3 py-2 bg-muted border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <Button
                size="sm"
                onClick={handleChatSend}
                disabled={!userInput.trim()}
                className="bg-primary hover:opacity-90"
              >
                <Icon name="Send" size={16} />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      <Button
        size="lg"
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/30 z-40 animate-glow-pulse"
      >
        <Icon name={chatOpen ? 'X' : 'MessageCircle'} size={24} />
      </Button>
    </div>
  );
}