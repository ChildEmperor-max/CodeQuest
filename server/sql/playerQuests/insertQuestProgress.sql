INSERT into player_quests (quest_id, quest_status, player_id, npc_id, dialog_id)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (player_id, quest_id)
DO UPDATE SET quest_status = $2;