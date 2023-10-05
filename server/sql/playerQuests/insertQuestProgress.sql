INSERT into player_quests (quest_id, quest_status, player_id)
VALUES ($1, $2, $3)
ON CONFLICT (player_id, quest_id)
DO UPDATE SET quest_status = $2;