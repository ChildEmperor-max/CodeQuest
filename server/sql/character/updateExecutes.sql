UPDATE character
SET code_profile = jsonb_set(code_profile, '{executes}', $2)
WHERE player_id = $1