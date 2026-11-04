
import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const supabaseReady = Boolean(url && key);
export const supabase = supabaseReady ? createClient(url!, key!) : null;
export type Photo = { id?: string; apartment_id?: string; src: string; label: string; alt: string; sort_order?: number };
export type Apartment = { id: string; title: string; detail: string; nightly: number; sort_order?: number; photos: Photo[] };
export const adminEmail = 'boujeelux24@gmail.com';
