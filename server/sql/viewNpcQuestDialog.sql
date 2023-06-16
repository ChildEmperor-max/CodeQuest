SELECT n.npc_name, q.quest_status, q.quest_title, q.quest_type, q.quest_description, d.dialog
FROM public.npc AS n
LEFT JOIN public.quest as q
ON q.id = n.quest_id
LEFT JOIN public.dialog as d
ON d.id = n.dialog_id