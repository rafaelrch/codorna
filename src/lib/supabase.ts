import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  first_name: string
  last_name: string
  phone: string
  email: string
}

export interface CategoryOutput {
  id: number
  name: string
}

export interface CategoryInput {
  id: number
  name: string
}

// Transaction interface moved to transactionService.ts

export interface Goal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string
  created_at: string
  updated_at: string
}

// Auth types
export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    first_name?: string
    last_name?: string
    phone?: string
  }
}
