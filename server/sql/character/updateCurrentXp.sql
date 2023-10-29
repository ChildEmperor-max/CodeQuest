UPDATE character
SET xp = jsonb_set(xp, '{current_xp}', $2)
WHERE player_id = $1