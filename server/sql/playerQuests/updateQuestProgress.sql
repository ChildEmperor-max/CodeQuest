UPDATE player_quests 
SET quest_status = $1
WHERE player_id = $2 AND quest_id = $3