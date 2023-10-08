SELECT n.id, n.npc_name, n.quest_id, n.dialog_id
FROM npc AS n
LEFT JOIN player_quests AS p
ON n.quest_id = p.quest_id
WHERE p.quest_id = $1