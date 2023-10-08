SELECT n.npc_name, q.quest_title, q.quest_type, q.quest_description, d.dialog, q.code_template, q.quest_answer, q.quest_id, q.pseudo_code, q.hint, q.script_name
FROM public.npc AS n
LEFT JOIN public.quest as q
ON q.quest_id = n.quest_id
LEFT JOIN public.dialog as d
ON d.id = n.dialog_id