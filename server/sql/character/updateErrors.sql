UPDATE character
SET code_profile = jsonb_set(code_profile, '{errors}', $2)
WHERE player_id = $1