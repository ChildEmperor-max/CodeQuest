UPDATE character
SET avatar_path = $2
WHERE player_id = $1;
