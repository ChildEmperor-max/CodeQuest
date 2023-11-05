SELECT p.quest_status 
FROM player_quests as p
LEFT JOIN quest as q
ON q.quest_id = p.quest_id
WHERE q.npc_id = $1 AND p.player_id = $2