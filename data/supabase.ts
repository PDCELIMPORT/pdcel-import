import { createClient } from '@supabase/supabase-js';
// Chaves públicas (seguras com RLS). Nunca coloque a service_role aqui.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xeueitmwxglsvptykeii.supabase.co';
export const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldWVpdG13eGdsc3ZwdHlrZWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NjAyNTMsImV4cCI6MjEwODIzNjI1M30.txak2X351y9mkHP10TTReNthY6W9Z0kwsJd2c1JYqpo';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
export type Status = 'disponivel' | 'pronta_entrega' | 'esgotado';
export type Tamanho = 'pequeno' | 'medio' | 'grande';
export type Produto = { id: string; nome: string; preco: number; foto: string | null; especificacoes: string[];
  pagamento: string | null; status: Status; tamanho: Tamanho; ordem: number };
export const STATUS_LABEL: Record<Status, string> = { disponivel: 'Disponível', pronta_entrega: 'Pronta entrega (até 24h)', esgotado: 'Esgotado' };
