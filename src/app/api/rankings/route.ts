import { NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'daily';

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ data: [], error: null });
  }

  const supabase = getSupabase()!;
  const { data, error } = await supabase
    .from('rankings')
    .select('*')
    .eq('period', period)
    .order('rank')
    .limit(20);

  return NextResponse.json({ data: data || [], error });
}
