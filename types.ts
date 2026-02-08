
export interface Chocolate {
  id: string;
  name: string;
  description: string;
  note: string;
  type: 'Dark' | 'Milk' | 'White' | 'Caramel' | 'Hazelnut';
  emoji: string;
  color: string;
  texture: string;
}

export interface LoveQuote {
  text: string;
  author?: string;
}
