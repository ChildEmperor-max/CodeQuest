PGDMP                         {         	   CodeQuest    15.3    15.3 
    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                        0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16398 	   CodeQuest    DATABASE     �   CREATE DATABASE "CodeQuest" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Philippines.1252';
    DROP DATABASE "CodeQuest";
                postgres    false            �            1259    16406    npc    TABLE     �   CREATE TABLE public.npc (
    id "char" NOT NULL,
    npc_name character(100) NOT NULL,
    assigned_quests text[],
    admin_id "char",
    dialog text[]
);
    DROP TABLE public.npc;
       public         heap    postgres    false            �            1259    16399    quests    TABLE       CREATE TABLE public.quests (
    id "char" NOT NULL,
    npc_id "char" NOT NULL,
    quest_title character(100) NOT NULL,
    quest_description text NOT NULL,
    quest_status character(100) NOT NULL,
    quest_type character(100),
    level_restriction bigint
);
    DROP TABLE public.quests;
       public         heap    postgres    false            �          0    16406    npc 
   TABLE DATA           N   COPY public.npc (id, npc_name, assigned_quests, admin_id, dialog) FROM stdin;
    public          postgres    false    215   9
       �          0    16399    quests 
   TABLE DATA           y   COPY public.quests (id, npc_id, quest_title, quest_description, quest_status, quest_type, level_restriction) FROM stdin;
    public          postgres    false    214   d
       k           2606    16412    npc npc_pkey 
   CONSTRAINT     J   ALTER TABLE ONLY public.npc
    ADD CONSTRAINT npc_pkey PRIMARY KEY (id);
 6   ALTER TABLE ONLY public.npc DROP CONSTRAINT npc_pkey;
       public            postgres    false    215            i           2606    16405    quests quests_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.quests
    ADD CONSTRAINT quests_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.quests DROP CONSTRAINT quests_pkey;
       public            postgres    false    214            �      x�3�t�I�T�1��� �=... ���      �   I   x�3�4�,N�-�IU(,M-.Q(�,��8!���'e�d��)�V�����K���K�������W� ��,�     