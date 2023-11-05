SELECT * FROM quest
WHERE quest_id IN (
	SELECT next_quest_id FROM quest
	WHERE quest_id = $1
)