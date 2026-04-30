ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Remove old broken policies (safe)
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;

-- INSERT: user can create their own profile
CREATE POLICY "profiles_insert_own"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- SELECT: user can read their own profile
CREATE POLICY "profiles_select_own"
ON profiles
FOR SELECT
USING (auth.uid() = id);

-- UPDATE: user can update their own profile
CREATE POLICY "profiles_update_own"
ON profiles
FOR UPDATE
USING (auth.uid() = id);

ALTER TABLE history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "history_insert_own" ON history;
DROP POLICY IF EXISTS "history_select_own" ON history;
DROP POLICY IF EXISTS "history_update_own" ON history;
DROP POLICY IF EXISTS "history_delete_own" ON history;

-- INSERT
CREATE POLICY "history_insert_own"
ON history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- SELECT
CREATE POLICY "history_select_own"
ON history
FOR SELECT
USING (auth.uid() = user_id);

-- UPDATE
CREATE POLICY "history_update_own"
ON history
FOR UPDATE
USING (auth.uid() = user_id);

-- DELETE
CREATE POLICY "history_delete_own"
ON history
FOR DELETE
USING (auth.uid() = user_id);
