PGDMP         7                {         	   CodeQuest    15.3    15.3                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16663 	   CodeQuest    DATABASE     �   CREATE DATABASE "CodeQuest" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE "CodeQuest";
                postgres    false            �            1259    16664 	   character    TABLE     �   CREATE TABLE public."character" (
    character_name character(50) NOT NULL,
    level integer NOT NULL,
    experience integer NOT NULL,
    id integer NOT NULL,
    player_id integer NOT NULL
);
    DROP TABLE public."character";
       public         heap    postgres    false            �            1259    16667    dialog    TABLE     g   CREATE TABLE public.dialog (
    quest_hint text,
    dialog text NOT NULL,
    id integer NOT NULL
);
    DROP TABLE public.dialog;
       public         heap    postgres    false            �            1259    16672    dialog_id_seq    SEQUENCE     �   ALTER TABLE public.dialog ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.dialog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    215            �            1259    16673    npc    TABLE     �   CREATE TABLE public.npc (
    id integer NOT NULL,
    npc_name character(50) NOT NULL,
    admin_id integer,
    quest_id integer,
    dialog_id integer
);
    DROP TABLE public.npc;
       public         heap    postgres    false            �            1259    16676 
   npc_id_seq    SEQUENCE     �   ALTER TABLE public.npc ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.npc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    217            �            1259    16677    player    TABLE     
  CREATE TABLE public.player (
    first_name character(100) NOT NULL,
    last_name character(100) NOT NULL,
    email character(100) NOT NULL,
    password character(100) NOT NULL,
    gender "char" NOT NULL,
    created_at date NOT NULL,
    id integer NOT NULL
);
    DROP TABLE public.player;
       public         heap    postgres    false            �            1259    16680    quest    TABLE     '  CREATE TABLE public.quest (
    id integer NOT NULL,
    quest_title character(100) NOT NULL,
    quest_description text NOT NULL,
    quest_status character(100) NOT NULL,
    quest_type character(100) NOT NULL,
    required_quest_id integer[],
    code_template text,
    quest_answer text
);
    DROP TABLE public.quest;
       public         heap    postgres    false            �            1259    16685    quest_id_seq    SEQUENCE     �   ALTER TABLE public.quest ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.quest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    220                      0    16664 	   character 
   TABLE DATA           W   COPY public."character" (character_name, level, experience, id, player_id) FROM stdin;
    public          postgres    false    214   �                 0    16667    dialog 
   TABLE DATA           8   COPY public.dialog (quest_hint, dialog, id) FROM stdin;
    public          postgres    false    215   �                 0    16673    npc 
   TABLE DATA           J   COPY public.npc (id, npc_name, admin_id, quest_id, dialog_id) FROM stdin;
    public          postgres    false    217                    0    16677    player 
   TABLE DATA           `   COPY public.player (first_name, last_name, email, password, gender, created_at, id) FROM stdin;
    public          postgres    false    219   O                 0    16680    quest 
   TABLE DATA           �   COPY public.quest (id, quest_title, quest_description, quest_status, quest_type, required_quest_id, code_template, quest_answer) FROM stdin;
    public          postgres    false    220   l                  0    0    dialog_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.dialog_id_seq', 2, true);
          public          postgres    false    216                       0    0 
   npc_id_seq    SEQUENCE SET     8   SELECT pg_catalog.setval('public.npc_id_seq', 2, true);
          public          postgres    false    218                       0    0    quest_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.quest_id_seq', 2, true);
          public          postgres    false    221            x           2606    16687    character character_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."character"
    ADD CONSTRAINT character_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."character" DROP CONSTRAINT character_pkey;
       public            postgres    false    214            z           2606    16689    npc npc_pkey 
   CONSTRAINT     J   ALTER TABLE ONLY public.npc
    ADD CONSTRAINT npc_pkey PRIMARY KEY (id);
 6   ALTER TABLE ONLY public.npc DROP CONSTRAINT npc_pkey;
       public            postgres    false    217            |           2606    16691    player player_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.player DROP CONSTRAINT player_pkey;
       public            postgres    false    219            ~           2606    16693    quest quest_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.quest
    ADD CONSTRAINT quest_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.quest DROP CONSTRAINT quest_pkey;
       public            postgres    false    220                  x������ � �         '  x�]��j�0���S�>m���e�1z�E���Ա��$��w����#�>�}[}�-y�pqv;�p"@�ς}��9��z8���#(Cd?Qcj��P5c�[�2�s�D��s�D��^Q�#'0�v9�G�ŴK�w��OpdK`ޗ��7<j3���ã���f�-�StK�t(~��,ޚ���S�^m�5�r�.!�ȝ�Pa'��6n�e����'u�t䠘ZL>��,��P1!~��}v�5v�=(�K��C긾�A�����#W
�_�*�m۫]���{���j�������         .   x�3�N�-�I�p6T p��qrr!���׈ӈ+F��� o�k            x������ � �         �   x�푱N�0���)L���*�zB�7�rʐk��R.�b��	ݻ�6E���^َ������:�%Dgn`�O���!�Co!�C�u��s�}D��o*u]a�����'��m.F�f�B���]K�r�YyE^��E��[h�&j#����K�XsNC@g�~s�8٫�^ߪ��)�������i��>�3{Um�x���YZ�����!Z�9�W�
��ڰ����G�e�p}�XmeSK)?���v     