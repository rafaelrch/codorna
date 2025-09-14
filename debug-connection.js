import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vvxpqdxmoapmceaggikl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2eHBxZHhtb2FwbWNlYWdnaWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTgwODUsImV4cCI6MjA3MzAzNDA4NX0.tpCp1XxwzGZAt6aQPQnkyFbC4x5SGs1_2Y59VzOU1aQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    // Test 1: Check categories
    console.log('\n📂 Testing categories...')
    const { data: expenseCategories, error: expenseError } = await supabase
      .from('categories_output')
      .select('*')
      .limit(3)
    
    if (expenseError) {
      console.error('❌ Error fetching expense categories:', expenseError)
    } else {
      console.log('✅ Expense categories:', expenseCategories)
    }

    const { data: incomeCategories, error: incomeError } = await supabase
      .from('categories_input')
      .select('*')
      .limit(3)
    
    if (incomeError) {
      console.error('❌ Error fetching income categories:', incomeError)
    } else {
      console.log('✅ Income categories:', incomeCategories)
    }

    // Test 2: Check auth
    console.log('\n🔐 Testing auth...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.log('ℹ️ No authenticated user (expected if not logged in)')
    } else if (user) {
      console.log('✅ Current user:', user.email)
      
      // Test 3: Check user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileError) {
        console.error('❌ Error fetching user profile:', profileError)
      } else {
        console.log('✅ User profile:', profile)
      }
    } else {
      console.log('ℹ️ No user logged in')
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error)
  }
}

testConnection()
