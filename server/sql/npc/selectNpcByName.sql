SELECT p.npc_id, p.dialog_id, p.quest_id, n.npc_name
FROM player_quests as p
LEFT JOIN quest as q
ON q.quest_id = p.quest_id
LEFT JOIN npc as n
ON n.id = p.npc_id
WHERE p.player_id = $1 and n.npc_name = $2