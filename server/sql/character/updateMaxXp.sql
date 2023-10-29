UPDATE character
SET xp = jsonb_set(xp, '{max_xp}', $2)
WHERE player_id = $1