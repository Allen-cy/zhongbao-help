import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ data: [], error: null });
  }
  const supabase = getSupabase()!;
  const { data, error } = await supabase
    .from('trash_orders')
    .select('*')
    .order('score', { ascending: false })
    .limit(20);
  return NextResponse.json({ data: data || [], error });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ data: { ...body, id: Date.now().toString(), created_at: new Date().toISOString() }, error: null });
  }
  const supabase = getSupabase()!;
  const { data, error } = await supabase
    .from('trash_orders')
    .insert([{
      ...body,
      custom_tag: body.custom_tag || null,
      hygiene_score: body.hygiene_score || null,
      has_physical_store: body.has_physical_store,
      store_name: body.store_name || null,
    }])
    .select()
    .single();
  return NextResponse.json({ data, error });
}
