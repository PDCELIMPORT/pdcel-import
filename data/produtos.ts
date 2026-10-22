// 📦 PRODUTOS — para adicionar, copie um bloco { ... } e edite.
// Foto: coloque o arquivo em public/produtos/ e use '/produtos/nome.jpg' (ou um link https).
export type Produto = {
  id: string; nome: string; preco: number; foto: string;
  especificacoes: string[]; pagamento: string; disponivel?: boolean;
};

export const produtos: Produto[] = [
  { id: 'iphone-13', nome: 'iPhone 13 128GB', preco: 2899, foto: '/produtos/exemplo1.svg',
    especificacoes: ['Tela 6,1"', '128GB', 'Bateria 90%+', 'Com caixa e cabo'],
    pagamento: 'Pix à vista ou até 12x no cartão (com juros)' },
  { id: 'redmi-note-13', nome: 'Xiaomi Redmi Note 13 256GB', preco: 1299, foto: '/produtos/exemplo2.svg',
    especificacoes: ['8GB RAM', '256GB', 'Câmera 108MP', 'Lacrado'],
    pagamento: 'Pix com 5% off ou 10x no cartão' },
  { id: 'airpods', nome: 'AirPods Pro 2ª geração', preco: 1199, foto: '/produtos/exemplo3.svg',
    especificacoes: ['Cancelamento de ruído', 'Estojo USB-C', 'Lacrado'],
    pagamento: 'Pix ou até 6x no cartão', disponivel: false },
];
