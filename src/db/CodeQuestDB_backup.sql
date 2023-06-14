PGDMP     "                    {         	   CodeQuest    15.3    15.3                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16398 	   CodeQuest    DATABASE     �   CREATE DATABASE "CodeQuest" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Philippines.1252';
    DROP DATABASE "CodeQuest";
                postgres    false            �            1259    16418 	   character    TABLE     �   CREATE TABLE public."character" (
    character_name character(50) NOT NULL,
    level integer NOT NULL,
    experience integer NOT NULL,
    id integer NOT NULL,
    player_id integer NOT NULL
);
    DROP TABLE public."character";
       public         heap    postgres    false            �            1259    16423    dialog    TABLE     }   CREATE TABLE public.dialog (
    quest_hint text,
    dialog text NOT NULL,
    quest_id integer,
    id integer NOT NULL
);
    DROP TABLE public.dialog;
       public         heap    postgres    false            �            1259    16454    dialog_id_seq    SEQUENCE     �   ALTER TABLE public.dialog ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.dialog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    216            �            1259    16439    npc    TABLE     �   CREATE TABLE public.npc (
    id integer NOT NULL,
    npc_name character(50) NOT NULL,
    admin_id integer,
    quest_id integer[],
    dialog_id integer[]
);
    DROP TABLE public.npc;
       public         heap    postgres    false            �            1259    16438 
   npc_id_seq    SEQUENCE     �   ALTER TABLE public.npc ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.npc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    220            �            1259    16413    player    TABLE     
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
       public         heap    postgres    false            �            1259    16431    quest    TABLE       CREATE TABLE public.quest (
    id integer NOT NULL,
    npc_id integer NOT NULL,
    quest_title character(100) NOT NULL,
    quest_description text NOT NULL,
    quest_status character(100) NOT NULL,
    quest_type character(100) NOT NULL,
    required_quest_id integer[]
);
    DROP TABLE public.quest;
       public         heap    postgres    false            �            1259    16430    quest_id_seq    SEQUENCE     �   ALTER TABLE public.quest ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.quest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    218                      0    16418 	   character 
   TABLE DATA           W   COPY public."character" (character_name, level, experience, id, player_id) FROM stdin;
    public          postgres    false    215   �                 0    16423    dialog 
   TABLE DATA           B   COPY public.dialog (quest_hint, dialog, quest_id, id) FROM stdin;
    public          postgres    false    216   �                 0    16439    npc 
   TABLE DATA           J   COPY public.npc (id, npc_name, admin_id, quest_id, dialog_id) FROM stdin;
    public          postgres    false    220                    0    16413    player 
   TABLE DATA           `   COPY public.player (first_name, last_name, email, password, gender, created_at, id) FROM stdin;
    public          postgres    false    214   M                 0    16431    quest 
   TABLE DATA           x   COPY public.quest (id, npc_id, quest_title, quest_description, quest_status, quest_type, required_quest_id) FROM stdin;
    public          postgres    false    218   j                  0    0    dialog_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.dialog_id_seq', 2, true);
          public          postgres    false    221                       0    0 
   npc_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.npc_id_seq', 22, true);
          public          postgres    false    219                       0    0    quest_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.quest_id_seq', 6, true);
          public          postgres    false    217            z           2606    16451    character character_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."character"
    ADD CONSTRAINT character_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."character" DROP CONSTRAINT character_pkey;
       public            postgres    false    215            ~           2606    16445    npc npc_pkey 
   CONSTRAINT     J   ALTER TABLE ONLY public.npc
    ADD CONSTRAINT npc_pkey PRIMARY KEY (id);
 6   ALTER TABLE ONLY public.npc DROP CONSTRAINT npc_pkey;
       public            postgres    false    220            x           2606    16449    player player_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.player DROP CONSTRAINT player_pkey;
       public            postgres    false    214            |           2606    16435    quest quest_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.quest
    ADD CONSTRAINT quest_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.quest DROP CONSTRAINT quest_pkey;
       public            postgres    false    218                  x������ � �         .  x�]��j�0���S�9ml��衽�2F/���ژ:V���0��]ڱA����>�}/��-9�p�f;�p"@������~p�É,<�0Dv5U]�;�f�r�aN�(,�,
�5�ґ0�t)�3�f�)�'���m��D���Q�!X/�?<�q�0��Ln��a̱zL"�n{��n�w�R<���{Y��3z�))͌�r��z�5�-��,����j&	��q#�d�;���A�]�1t��*�a\nW�Rx�G17��%$�f�+Xx�3���e۔e�ԥD         )   x�32�N�-�I�p6T p��A��B���c���� '��            x������ � �         �   x�ݑ1�0E��&H��`e�Ă��Kh��*I[���� ȂK߲���V�Q����, S�S w��R K�oаAP�)D|�Ǣ��u˕ZC�#��[���]�:&�P_��9�D0����@&+`���e)�ړ�Z9a�O�!�GЩ�ׯ�+ ���c�߲�)�`��     