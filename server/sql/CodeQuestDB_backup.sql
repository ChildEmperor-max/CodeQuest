PGDMP     #    "                {         	   CodeQuest    15.3    15.3                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16484 	   CodeQuest    DATABASE     �   CREATE DATABASE "CodeQuest" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE "CodeQuest";
                postgres    false            �            1259    16485 	   character    TABLE     �   CREATE TABLE public."character" (
    character_name character(50) NOT NULL,
    level integer NOT NULL,
    experience integer NOT NULL,
    id integer NOT NULL,
    player_id integer NOT NULL
);
    DROP TABLE public."character";
       public         heap    postgres    false            �            1259    16488    dialog    TABLE     g   CREATE TABLE public.dialog (
    quest_hint text,
    dialog text NOT NULL,
    id integer NOT NULL
);
    DROP TABLE public.dialog;
       public         heap    postgres    false            �            1259    16493    dialog_id_seq    SEQUENCE     �   ALTER TABLE public.dialog ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.dialog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    215            �            1259    16494    npc    TABLE     �   CREATE TABLE public.npc (
    id integer NOT NULL,
    npc_name character(50) NOT NULL,
    admin_id integer,
    quest_id integer,
    dialog_id integer
);
    DROP TABLE public.npc;
       public         heap    postgres    false            �            1259    16499 
   npc_id_seq    SEQUENCE     �   ALTER TABLE public.npc ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.npc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    217            �            1259    16500    player    TABLE     
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
       public         heap    postgres    false            �            1259    16503    quest    TABLE     �   CREATE TABLE public.quest (
    id integer NOT NULL,
    quest_title character(100) NOT NULL,
    quest_description text NOT NULL,
    quest_status character(100) NOT NULL,
    quest_type character(100) NOT NULL,
    required_quest_id integer[]
);
    DROP TABLE public.quest;
       public         heap    postgres    false            �            1259    16508    quest_id_seq    SEQUENCE     �   ALTER TABLE public.quest ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.quest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    220                      0    16485 	   character 
   TABLE DATA           W   COPY public."character" (character_name, level, experience, id, player_id) FROM stdin;
    public          postgres    false    214   q                 0    16488    dialog 
   TABLE DATA           8   COPY public.dialog (quest_hint, dialog, id) FROM stdin;
    public          postgres    false    215   �                 0    16494    npc 
   TABLE DATA           J   COPY public.npc (id, npc_name, admin_id, quest_id, dialog_id) FROM stdin;
    public          postgres    false    217   �                 0    16500    player 
   TABLE DATA           `   COPY public.player (first_name, last_name, email, password, gender, created_at, id) FROM stdin;
    public          postgres    false    219                    0    16503    quest 
   TABLE DATA           p   COPY public.quest (id, quest_title, quest_description, quest_status, quest_type, required_quest_id) FROM stdin;
    public          postgres    false    220   !                  0    0    dialog_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.dialog_id_seq', 2, true);
          public          postgres    false    216                       0    0 
   npc_id_seq    SEQUENCE SET     8   SELECT pg_catalog.setval('public.npc_id_seq', 2, true);
          public          postgres    false    218                       0    0    quest_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.quest_id_seq', 2, true);
          public          postgres    false    221            x           2606    16510    character character_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."character"
    ADD CONSTRAINT character_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."character" DROP CONSTRAINT character_pkey;
       public            postgres    false    214            z           2606    16512    npc npc_pkey 
   CONSTRAINT     J   ALTER TABLE ONLY public.npc
    ADD CONSTRAINT npc_pkey PRIMARY KEY (id);
 6   ALTER TABLE ONLY public.npc DROP CONSTRAINT npc_pkey;
       public            postgres    false    217            |           2606    16514    player player_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.player DROP CONSTRAINT player_pkey;
       public            postgres    false    219            ~           2606    16516    quest quest_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.quest
    ADD CONSTRAINT quest_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.quest DROP CONSTRAINT quest_pkey;
       public            postgres    false    220                  x������ � �         (  x�]��j�0���S�9m���e�1z�E���Ա�����w��Ҏ��?I�ݽ?|�
����
���L�0
����S^�pd��'P��a��n�]�j���b��'�� �$�=I�]�EA{�#j�S}�\L{���|�;���?��4�<i;����7��.<W�[|�JZ;�ɫێ%8ۭ��~x������7.�9�<�c*���Ѭ�^��]�ؔK��֪yi����9��!a�����5��(�s�Žu�\�m����+�7K����ٛ���#����RumUU?݈��         .   x�3�N�-�I�p6T p��qqr!���אӈ+F��� pk            x������ � �         �   x��Q;�0��S�L �Jp�N,��t	M��B\%N�ޞP�p�,x��,���껳ʍ�i���30S��,��'��:G
�gl\�@���h
�%XHڳ<��%�(8�)���O��c��=���P]���UQ�jȩ��۝�C�SL����`0k3_���i+)��8��     