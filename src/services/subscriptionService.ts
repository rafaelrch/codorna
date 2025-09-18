import { supabase } from '@/lib/supabase'

export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'unpaid' | 'paused'

export interface Subscriber {
  id: string
  user_id: string | null
  email: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  status: SubscriptionStatus
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export async function fetchSubscriber(): Promise<{ subscriber: Subscriber | null; error: any }> {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { subscriber: null, error: authError || new Error('Not authenticated') }

  const email = user.email
  const userId = user.id

  // Prefer user_id; fallback to email
  const { data, error } = await supabase
    .from<Subscriber>('subscribers')
    .select('*')
    .or(`user_id.eq.${userId},email.eq.${email}`)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) return { subscriber: null, error }
  return { subscriber: data, error: null }
}

export function isSubscriptionActive(subscriber: Subscriber | null): boolean {
  if (!subscriber) return false
  const activeStatuses: SubscriptionStatus[] = ['active', 'trialing']
  if (!activeStatuses.includes(subscriber.status)) return false
  if (!subscriber.current_period_end) return false
  const endsAt = new Date(subscriber.current_period_end).getTime()
  return endsAt > Date.now()
}


