SELECT p.quest_status 
FROM player_quests as p
LEFT JOIN npc as n
ON n.quest_id = p.quest_id
WHERE n.id = $1