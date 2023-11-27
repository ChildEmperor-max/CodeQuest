UPDATE character
SET inventory = jsonb_set(inventory, `{$2}`, $3)
WHERE player_id = $1