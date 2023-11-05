SELECT n.id, n.npc_name
FROM npc AS n
LEFT JOIN player_quests AS p
ON n.id = p.npc_id
WHERE p.quest_id = $1 AND p.player_id = $2