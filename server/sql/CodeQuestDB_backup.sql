PGDMP                         {         	   CodeQuest    15.3    15.3      $           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            %           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            &           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            '           1262    41259 	   CodeQuest    DATABASE     �   CREATE DATABASE "CodeQuest" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE "CodeQuest";
                postgres    false            �            1255    41260    update_timestamp()    FUNCTION     �   CREATE FUNCTION public.update_timestamp() RETURNS trigger
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
       public          postgres    false            �            1259    41261    achievements    TABLE     �   CREATE TABLE public.achievements (
    id integer NOT NULL,
    name text NOT NULL,
    status text NOT NULL,
    description text NOT NULL,
    date_achieved timestamp without time zone
);
     DROP TABLE public.achievements;
       public         heap    postgres    false            �            1259    41266    achievements_id_seq    SEQUENCE     �   ALTER TABLE public.achievements ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.achievements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    214            �            1259    41267 	   character    TABLE       CREATE TABLE public."character" (
    character_name character(50) NOT NULL,
    level integer NOT NULL,
    experience integer NOT NULL,
    id integer NOT NULL,
    player_id integer NOT NULL,
    character_bio character(40),
    completed_quests text[]
);
    DROP TABLE public."character";
       public         heap    postgres    false            �            1259    41272    dialog    TABLE     �   CREATE TABLE public.dialog (
    id integer NOT NULL,
    dialog text,
    quest_hint text,
    response_to integer,
    npc_id integer,
    page_number integer,
    branch integer,
    is_array boolean,
    stage text,
    quest_id integer
);
    DROP TABLE public.dialog;
       public         heap    postgres    false            �            1259    41277    dialog_id_seq    SEQUENCE     �   ALTER TABLE public.dialog ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.dialog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    217            �            1259    41278    npc    TABLE     �   CREATE TABLE public.npc (
    id integer NOT NULL,
    npc_name character varying(50) NOT NULL,
    admin_id integer,
    quest_id integer,
    dialog_id integer
);
    DROP TABLE public.npc;
       public         heap    postgres    false            �            1259    41281 
   npc_id_seq    SEQUENCE     �   ALTER TABLE public.npc ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.npc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    219            �            1259    41282    player    TABLE     
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
       public         heap    postgres    false            �            1259    41285    quest    TABLE     T  CREATE TABLE public.quest (
    id integer NOT NULL,
    quest_title character varying(100) NOT NULL,
    quest_description text NOT NULL,
    quest_status character varying(100) NOT NULL,
    quest_type character varying(100) NOT NULL,
    code_template text,
    quest_answer text,
    required_quest_id integer,
    dialog_id integer
);
    DROP TABLE public.quest;
       public         heap    postgres    false            �            1259    41290    quest_id_seq    SEQUENCE     �   ALTER TABLE public.quest ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.quest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    222                      0    41261    achievements 
   TABLE DATA           T   COPY public.achievements (id, name, status, description, date_achieved) FROM stdin;
    public          postgres    false    214   %%                 0    41267 	   character 
   TABLE DATA           x   COPY public."character" (character_name, level, experience, id, player_id, character_bio, completed_quests) FROM stdin;
    public          postgres    false    216   &                 0    41272    dialog 
   TABLE DATA           }   COPY public.dialog (id, dialog, quest_hint, response_to, npc_id, page_number, branch, is_array, stage, quest_id) FROM stdin;
    public          postgres    false    217   (&                 0    41278    npc 
   TABLE DATA           J   COPY public.npc (id, npc_name, admin_id, quest_id, dialog_id) FROM stdin;
    public          postgres    false    219   �)                 0    41282    player 
   TABLE DATA           `   COPY public.player (first_name, last_name, email, password, gender, created_at, id) FROM stdin;
    public          postgres    false    221   8*                  0    41285    quest 
   TABLE DATA           �   COPY public.quest (id, quest_title, quest_description, quest_status, quest_type, code_template, quest_answer, required_quest_id, dialog_id) FROM stdin;
    public          postgres    false    222   U*       (           0    0    achievements_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.achievements_id_seq', 7, true);
          public          postgres    false    215            )           0    0    dialog_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.dialog_id_seq', 16, true);
          public          postgres    false    218            *           0    0 
   npc_id_seq    SEQUENCE SET     8   SELECT pg_catalog.setval('public.npc_id_seq', 3, true);
          public          postgres    false    220            +           0    0    quest_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.quest_id_seq', 4, true);
          public          postgres    false    223            ~           2606    41292    achievements achievements_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.achievements DROP CONSTRAINT achievements_pkey;
       public            postgres    false    214            �           2606    41294    character character_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."character"
    ADD CONSTRAINT character_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."character" DROP CONSTRAINT character_pkey;
       public            postgres    false    216            �           2606    41296    dialog dialog_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.dialog
    ADD CONSTRAINT dialog_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.dialog DROP CONSTRAINT dialog_pkey;
       public            postgres    false    217            �           2606    41298    npc npc_pkey 
   CONSTRAINT     J   ALTER TABLE ONLY public.npc
    ADD CONSTRAINT npc_pkey PRIMARY KEY (id);
 6   ALTER TABLE ONLY public.npc DROP CONSTRAINT npc_pkey;
       public            postgres    false    219            �           2606    41300    player player_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.player DROP CONSTRAINT player_pkey;
       public            postgres    false    221            �           2606    41302    quest quest_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.quest
    ADD CONSTRAINT quest_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.quest DROP CONSTRAINT quest_pkey;
       public            postgres    false    222            �           2620    41303 %   achievements update_timestamp_trigger    TRIGGER     �   CREATE TRIGGER update_timestamp_trigger BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
 >   DROP TRIGGER update_timestamp_trigger ON public.achievements;
       public          postgres    false    214    224               �   x�eO�N�@<�~���F�>��{%� >��*qi�UV�xU��$i� �e�#�g�)�Q����pw_��3ǘ��r�T�/��ԕ�aJ%�O 	��Ц�޿�6vW�]���غA��Դj�V����a����������56�UY"z�ڮ'�7��gx������	�x�n�ܒ©ϣ,!���S8p�)���\�8��`����Z�h            x������ � �         �  x�eUKo�F>S�b�K.2Yr��8�XE�h #@.#rDn��Uw����;3K��$sg��=F��w�ŏ�bU��[������G>Y�6��ɻ�¾�s�&�D]����6�#� w�O�'>c	�~X�>1aH�� ?����7�Z
K�w�;�*��AGC�߃q���d����h\7R;�ÎJxj�;j�Z�B%|��������B�ձ�#�G�!��R�n8f}9��X|	D��ƫ���=&�#X���A�vpow�����5��������ǭ)��q΀5�~q#P`H�s��	zg}u�n�Z������]'�}�*��\���,�Lտt��%HT��[ߌ0���T0����Rq�D�e��>���0R�t��]��DP��0m8�Ѥ���z�	e�08iV'�$�3n���|G�PiP�r%
M+�&�q >ؚaֶ���,Wz9ZQ�܉�����ty|���J�Fz��i���4k�����l��?gLZgG���Q>�L�U�����oAN���<ȼr�������͎ʂ�פ�T��D�ثb�Z9`:\:E�u}��XܟP��&���('Ňi���!D'�����V�⑞)p��^]��cCy_۾:̵��������b�O��L�ϞAMh�W��R�J���̹6�\��G/��:NB�<�
gt����
f��鱡��}ׁ�(q�d�B�r���J�+�*jCu+���8����u%C_��:�7��J�y*YIw�����I�<U۷�q�5�w�4�Ӧ�tTW���J�lwz��/	��<<�{择S��m�����ܥ�_&��q[�4m	'K K�-�|�˞K������p�M�,�<�`x�wXj�S�[�o��k�N?1�t�o�b8��� 2��� ��̳�1�EP^�V�2+0+��[)��-4^v`y��Wìf?��l�?R�a`         4   x�3�N�-�I�p6�� .C��!HȐӂ˘�1'��3�4����� ��Y            x������ � �          e  x��R=O�0��_qxj�*-[�X� !��Ħ1r|�}IT��w�I
X�ɧ���}�Z<�`U�L;`��i8`�0P|�� w�9�`=���;֫�loD�ڈ�+���r*F�U�-�W���I_=Z��~�8�Wa�ޗ't:Su,�Q̠:q�[�c!��x�/ۈ{O�ڀ������UԪ7`|��'�f��!ri���姩(i���Rb��Xc��F�5�j�d@�M��V��R~&��:���Ĺɱ��e89��^5F.OܰG8NҊ���F��-�H닱�@�`
k$��D�Z�{/��O1�f7��&�_�6 ���+�|E���h�n����f�����L�:�"3*�,˾h�'�     