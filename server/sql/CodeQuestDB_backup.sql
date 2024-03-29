PGDMP                         {         	   CodeQuest    15.3    15.3      $           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            %           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            &           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            '           1262    16491 	   CodeQuest    DATABASE     �   CREATE DATABASE "CodeQuest" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Philippines.1252';
    DROP DATABASE "CodeQuest";
                postgres    false            �            1255    16549    update_timestamp()    FUNCTION     �   CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.status = 'unlocked' THEN
    NEW.date_achieved := CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$;
 )   DROP FUNCTION public.update_timestamp();
       public          postgres    false            �            1259    16532    achievements    TABLE     �   CREATE TABLE public.achievements (
    id integer NOT NULL,
    name text NOT NULL,
    status text NOT NULL,
    description text NOT NULL,
    date_achieved timestamp without time zone
);
     DROP TABLE public.achievements;
       public         heap    postgres    false            �            1259    16535    achievements_id_seq    SEQUENCE     �   ALTER TABLE public.achievements ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.achievements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    222            �            1259    16492 	   character    TABLE       CREATE TABLE public."character" (
    character_name character(50) NOT NULL,
    level integer NOT NULL,
    experience integer NOT NULL,
    id integer NOT NULL,
    player_id integer NOT NULL,
    character_bio character(40),
    completed_quests text[]
);
    DROP TABLE public."character";
       public         heap    postgres    false            �            1259    16523    dialog    TABLE     ^   CREATE TABLE public.dialog (
    id integer NOT NULL,
    dialog text,
    quest_hint text
);
    DROP TABLE public.dialog;
       public         heap    postgres    false            �            1259    16522    dialog_id_seq    SEQUENCE     �   ALTER TABLE public.dialog ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.dialog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    221            �            1259    16501    npc    TABLE     �   CREATE TABLE public.npc (
    id integer NOT NULL,
    npc_name character(50) NOT NULL,
    admin_id integer,
    quest_id integer,
    dialog_id integer
);
    DROP TABLE public.npc;
       public         heap    postgres    false            �            1259    16504 
   npc_id_seq    SEQUENCE     �   ALTER TABLE public.npc ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.npc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    215            �            1259    16505    player    TABLE     
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
       public         heap    postgres    false            �            1259    16508    quest    TABLE     %  CREATE TABLE public.quest (
    id integer NOT NULL,
    quest_title character(100) NOT NULL,
    quest_description text NOT NULL,
    quest_status character(100) NOT NULL,
    quest_type character(100) NOT NULL,
    code_template text,
    quest_answer text,
    required_quest_id integer
);
    DROP TABLE public.quest;
       public         heap    postgres    false            �            1259    16513    quest_id_seq    SEQUENCE     �   ALTER TABLE public.quest ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.quest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    218                       0    16532    achievements 
   TABLE DATA           T   COPY public.achievements (id, name, status, description, date_achieved) FROM stdin;
    public          postgres    false    222   $                 0    16492 	   character 
   TABLE DATA           x   COPY public."character" (character_name, level, experience, id, player_id, character_bio, completed_quests) FROM stdin;
    public          postgres    false    214   �$                 0    16523    dialog 
   TABLE DATA           8   COPY public.dialog (id, dialog, quest_hint) FROM stdin;
    public          postgres    false    221   �$                 0    16501    npc 
   TABLE DATA           J   COPY public.npc (id, npc_name, admin_id, quest_id, dialog_id) FROM stdin;
    public          postgres    false    215   V&                 0    16505    player 
   TABLE DATA           `   COPY public.player (first_name, last_name, email, password, gender, created_at, id) FROM stdin;
    public          postgres    false    217   �&                 0    16508    quest 
   TABLE DATA           �   COPY public.quest (id, quest_title, quest_description, quest_status, quest_type, code_template, quest_answer, required_quest_id) FROM stdin;
    public          postgres    false    218   �&       (           0    0    achievements_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.achievements_id_seq', 2, true);
          public          postgres    false    223            )           0    0    dialog_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.dialog_id_seq', 3, true);
          public          postgres    false    220            *           0    0 
   npc_id_seq    SEQUENCE SET     8   SELECT pg_catalog.setval('public.npc_id_seq', 3, true);
          public          postgres    false    216            +           0    0    quest_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.quest_id_seq', 4, true);
          public          postgres    false    219            �           2606    16542    achievements achievements_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.achievements DROP CONSTRAINT achievements_pkey;
       public            postgres    false    222            ~           2606    16515    character character_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."character"
    ADD CONSTRAINT character_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."character" DROP CONSTRAINT character_pkey;
       public            postgres    false    214            �           2606    16529    dialog dialog_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.dialog
    ADD CONSTRAINT dialog_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.dialog DROP CONSTRAINT dialog_pkey;
       public            postgres    false    221            �           2606    16517    npc npc_pkey 
   CONSTRAINT     J   ALTER TABLE ONLY public.npc
    ADD CONSTRAINT npc_pkey PRIMARY KEY (id);
 6   ALTER TABLE ONLY public.npc DROP CONSTRAINT npc_pkey;
       public            postgres    false    215            �           2606    16519    player player_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.player DROP CONSTRAINT player_pkey;
       public            postgres    false    217            �           2606    16521    quest quest_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.quest
    ADD CONSTRAINT quest_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.quest DROP CONSTRAINT quest_pkey;
       public            postgres    false    218            �           2620    16551 %   achievements update_timestamp_trigger    TRIGGER     �   CREATE TRIGGER update_timestamp_trigger BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
 >   DROP TRIGGER update_timestamp_trigger ON public.achievements;
       public          postgres    false    222    224                t   x�=�A
�0��ur�����݈p#�XC�L&�ܾi7o���Fb�;�^�#�J��Фj!�`�	Ab��_�L�4��ݿ��][�b'$�v��57���������.$            x������ � �         �  x�uRM��0=o~�D�L���{,=l.��
{�D�XD�i� J�{g�8ݖ-�`[�����O�L12��_�z< ����!����"p��'���L+׹m���&��<C(p�:S�w.�|�/����aD��{11�C"����o�+�d5�$�w�]=_��S�MXOǩQ����j�9z�������cK[���蔌Üb��=c�i��꟯��kC{N�jQ󈁋p&͆�
�˳9���@0�,'��qw��a��
~�+\�V�d�^�9	��q��I3�R̄��d�Ӟ<�P<t��-�90�5�Յ~dH8�Z��ԡ��Yڄ�����#K0�W��ǣ����O[�P�Y���neӵ�7;~����&ݶ����SRGz%������@��S�����b����         <   x�3�N�-�I�p6T p��qrr!���׈ӈ˘�1'��X]�Ɯ�\1z\\\ ] $            x������ � �         m  x��U�J�0=�_1���'�{񲨈��m�6�fJ2�Rd�ݤ݂B�K+�2�3�7�5�f;B��� �A[B8
���(#-F�Ӓi+2�G5�g�|��L�A�jot�ރϜ.	�Ss�'A!QK(����c��_^�}u\���;YQ(�#_�U�b[K!�S:<8Q�nlZ[�+�P*�Ɠ*XѢ]�����_5��+׵�o@bl�r�o`�-������?�``������m�1O茼��݃�E��|���9�Pced��lYQ����g~��-'hA~�y;ĺ��%{��b���n���["��<\�Yy�3,J�H�);��"wE����o7�6]$I�_�     