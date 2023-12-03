UPDATE player_quests
SET npc_id = $3, dialog_id = $4
WHERE quest_id = $2 AND player_id = $1