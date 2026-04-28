-- =============================================
-- LANGFANG_OPS Supabase Schema
-- 廊坊运营 - 骑手垃圾单标记应用数据库
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------
-- Table: riders (骑手表)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS riders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  avatar_url TEXT,
  rider_code VARCHAR(20) UNIQUE NOT NULL,
  total_marks INTEGER DEFAULT 0,
  credit_score DECIMAL(5,2) DEFAULT 100.00,
  rank_percent DECIMAL(5,2) DEFAULT 100.00,
  is_elite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------
-- Table: trash_orders (垃圾单记录表)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS trash_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rider_id UUID REFERENCES riders(id) ON DELETE SET NULL,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  location_name VARCHAR(200) NOT NULL,
  address VARCHAR(300),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  difficulty_label VARCHAR(50) NOT NULL,
  pickup_tags TEXT[] DEFAULT '{}',
  delivery_tags TEXT[] DEFAULT '{}',
  order_value_tags TEXT[] DEFAULT '{}',
  custom_tag VARCHAR(100),
  store_name VARCHAR(100),
  hygiene_score INTEGER CHECK (hygiene_score >= 1 AND hygiene_score <= 5),
  has_physical_store BOOLEAN,
  status VARCHAR(20) DEFAULT 'pending',
  verified_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------
-- Table: rankings (排行表)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_name VARCHAR(200) NOT NULL,
  address VARCHAR(300),
  score INTEGER NOT NULL,
  difficulty_label VARCHAR(50) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  rank INTEGER NOT NULL,
  period VARCHAR(20) DEFAULT 'daily',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(location_name)
);

-- -------------------------------------------
-- Table: difficulty_tags (难度标签字典)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS difficulty_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  score_weight INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default tags
INSERT INTO difficulty_tags (category, name, score_weight) VALUES
  ('pickup', '商场难找', 20), ('pickup', '出餐慢', 15), ('pickup', '态度恶劣', 10),
  ('delivery', '无电梯', 30), ('delivery', '门禁严格', 25), ('delivery', '坡度陡', 15),
  ('value', '单价极低', 10), ('value', '大件重物', 20)
ON CONFLICT DO NOTHING;

-- -------------------------------------------
-- Row Level Security (RLS) Policies
-- -------------------------------------------
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE trash_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE difficulty_tags ENABLE ROW LEVEL SECURITY;

-- Public read for all tables
CREATE POLICY "Public read riders" ON riders FOR SELECT USING (true);
CREATE POLICY "Public read trash_orders" ON trash_orders FOR SELECT USING (true);
CREATE POLICY "Public read rankings" ON rankings FOR SELECT USING (true);
CREATE POLICY "Public read difficulty_tags" ON difficulty_tags FOR SELECT USING (true);

-- Authenticated insert for trash_orders
CREATE POLICY "Public insert trash_orders" ON trash_orders FOR INSERT WITH CHECK (true);

-- -------------------------------------------
-- Functions
-- -------------------------------------------

-- Auto-update rider stats after new trash order
CREATE OR REPLACE FUNCTION update_rider_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE riders SET
    total_marks = total_marks + 1,
    updated_at = NOW()
  WHERE id = NEW.rider_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_rider_stats
  AFTER INSERT ON trash_orders
  FOR EACH ROW EXECUTE FUNCTION update_rider_stats();

-- Auto-update rankings based on trash_orders
CREATE OR REPLACE FUNCTION refresh_rankings()
RETURNS void AS $$
BEGIN
  WITH ranked AS (
    SELECT
      location_name,
      address,
      AVG(score)::INTEGER as avg_score,
      CASE
        WHEN AVG(score) >= 90 THEN '极其危险'
        WHEN AVG(score) >= 75 THEN '严重'
        WHEN AVG(score) >= 50 THEN '高难度'
        ELSE '一般'
      END as difficulty_label,
      ARRAY_AGG(DISTINCT UNNEST(pickup_tags || delivery_tags || order_value_tags)) as tags,
      ROW_NUMBER() OVER (ORDER BY AVG(score) DESC) as rank
    FROM trash_orders
    WHERE created_at > NOW() - INTERVAL '24 hours'
    GROUP BY location_name, address
  )
  INSERT INTO rankings (location_name, address, score, difficulty_label, tags, rank)
  SELECT location_name, address, avg_score, difficulty_label, tags, rank
  FROM ranked
  ON CONFLICT (location_name) DO UPDATE SET
    score = EXCLUDED.score,
    difficulty_label = EXCLUDED.difficulty_label,
    tags = EXCLUDED.tags,
    rank = EXCLUDED.rank,
    created_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- -------------------------------------------
-- Enable Realtime (optional)
-- -------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE trash_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE rankings;
