UPDATE character
SET achievements = COALESCE(achievements, '{}'::jsonb) || jsonb_build_object($2::text, to_jsonb(now()))
WHERE player_id = $1;
