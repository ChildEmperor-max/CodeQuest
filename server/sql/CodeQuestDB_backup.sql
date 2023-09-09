PGDMP     ,    '        	        {         	   CodeQuest    15.3    15.3      $           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            %           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            &           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            '           1262    24727 	   CodeQuest    DATABASE     �   CREATE DATABASE "CodeQuest" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Philippines.1252';
    DROP DATABASE "CodeQuest";
                postgres    false            �            1255    24728    update_timestamp()    FUNCTION     �   CREATE FUNCTION public.update_timestamp() RETURNS trigger
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
       public          postgres    false            �            1259    24729    achievements    TABLE     �   CREATE TABLE public.achievements (
    id integer NOT NULL,
    name text NOT NULL,
    status text NOT NULL,
    description text NOT NULL,
    date_achieved timestamp without time zone
);
     DROP TABLE public.achievements;
       public         heap    postgres    false            �            1259    24734    achievements_id_seq    SEQUENCE     �   ALTER TABLE public.achievements ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.achievements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    214            �            1259    24735 	   character    TABLE       CREATE TABLE public."character" (
    character_name character(50) NOT NULL,
    level integer NOT NULL,
    experience integer NOT NULL,
    id integer NOT NULL,
    player_id integer NOT NULL,
    character_bio character(40),
    completed_quests text[]
);
    DROP TABLE public."character";
       public         heap    postgres    false            �            1259    24740    dialog    TABLE     �   CREATE TABLE public.dialog (
    id integer NOT NULL,
    dialog text,
    quest_hint text,
    response_to integer,
    npc_id integer,
    page_number integer,
    branch integer,
    is_array boolean,
    stage text
);
    DROP TABLE public.dialog;
       public         heap    postgres    false            �            1259    24745    dialog_id_seq    SEQUENCE     �   ALTER TABLE public.dialog ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.dialog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    217            �            1259    24746    npc    TABLE     �   CREATE TABLE public.npc (
    id integer NOT NULL,
    npc_name character(50) NOT NULL,
    admin_id integer,
    quest_id integer,
    dialog_id integer
);
    DROP TABLE public.npc;
       public         heap    postgres    false            �            1259    24749 
   npc_id_seq    SEQUENCE     �   ALTER TABLE public.npc ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.npc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    219            �            1259    24750    player    TABLE     
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
       public         heap    postgres    false            �            1259    24753    quest    TABLE     <  CREATE TABLE public.quest (
    id integer NOT NULL,
    quest_title character(100) NOT NULL,
    quest_description text NOT NULL,
    quest_status character(100) NOT NULL,
    quest_type character(100) NOT NULL,
    code_template text,
    quest_answer text,
    required_quest_id integer,
    dialog_id integer
);
    DROP TABLE public.quest;
       public         heap    postgres    false            �            1259    24758    quest_id_seq    SEQUENCE     �   ALTER TABLE public.quest ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.quest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    222                      0    24729    achievements 
   TABLE DATA           T   COPY public.achievements (id, name, status, description, date_achieved) FROM stdin;
    public          postgres    false    214   �$                 0    24735 	   character 
   TABLE DATA           x   COPY public."character" (character_name, level, experience, id, player_id, character_bio, completed_quests) FROM stdin;
    public          postgres    false    216   �%                 0    24740    dialog 
   TABLE DATA           s   COPY public.dialog (id, dialog, quest_hint, response_to, npc_id, page_number, branch, is_array, stage) FROM stdin;
    public          postgres    false    217   �%                 0    24746    npc 
   TABLE DATA           J   COPY public.npc (id, npc_name, admin_id, quest_id, dialog_id) FROM stdin;
    public          postgres    false    219   �)                 0    24750    player 
   TABLE DATA           `   COPY public.player (first_name, last_name, email, password, gender, created_at, id) FROM stdin;
    public          postgres    false    221   �)                  0    24753    quest 
   TABLE DATA           �   COPY public.quest (id, quest_title, quest_description, quest_status, quest_type, code_template, quest_answer, required_quest_id, dialog_id) FROM stdin;
    public          postgres    false    222   *       (           0    0    achievements_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.achievements_id_seq', 7, true);
          public          postgres    false    215            )           0    0    dialog_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.dialog_id_seq', 16, true);
          public          postgres    false    218            *           0    0 
   npc_id_seq    SEQUENCE SET     8   SELECT pg_catalog.setval('public.npc_id_seq', 3, true);
          public          postgres    false    220            +           0    0    quest_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.quest_id_seq', 4, true);
          public          postgres    false    223            ~           2606    24760    achievements achievements_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.achievements DROP CONSTRAINT achievements_pkey;
       public            postgres    false    214            �           2606    24762    character character_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."character"
    ADD CONSTRAINT character_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."character" DROP CONSTRAINT character_pkey;
       public            postgres    false    216            �           2606    24764    dialog dialog_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.dialog
    ADD CONSTRAINT dialog_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.dialog DROP CONSTRAINT dialog_pkey;
       public            postgres    false    217            �           2606    24766    npc npc_pkey 
   CONSTRAINT     J   ALTER TABLE ONLY public.npc
    ADD CONSTRAINT npc_pkey PRIMARY KEY (id);
 6   ALTER TABLE ONLY public.npc DROP CONSTRAINT npc_pkey;
       public            postgres    false    219            �           2606    24768    player player_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.player DROP CONSTRAINT player_pkey;
       public            postgres    false    221            �           2606    24770    quest quest_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.quest
    ADD CONSTRAINT quest_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.quest DROP CONSTRAINT quest_pkey;
       public            postgres    false    222            �           2620    24771 %   achievements update_timestamp_trigger    TRIGGER     �   CREATE TRIGGER update_timestamp_trigger BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
 >   DROP TRIGGER update_timestamp_trigger ON public.achievements;
       public          postgres    false    214    224               �   x�eO�N�@<�~���F�>��{%� >��*qi�UV�xU��$i� �e�#�g�)�Q����pw_��3ǘ��r�T�/��ԕ�aJ%�O 	��Ц�޿�6vW�]���غA��Դj�V����a����������56�UY"z�ڮ'�7��gx������	�x�n�ܒ©ϣ,!���S8p�)���\�8��`����Z�h            x������ � �         �  x�eU_o�6�?��/}q�:N��/���zز+P��Y:K�)R#�(���;*r��mP��~�Nw�7����b[�;���]��/��y��X���p�D�.��@�	�Ώ�G?$����G?n�H'F��0$�C���h��J-��'���A�ʠ��PE�O`��0�31�����aG%|m�;j�Z8@%_�p����ǵ �SL3��C�פ�Ⲕ�{ް[@�Z�=�>C�
�|���B�G%����]'�Yt̀m ]�7(����3�r��0895SR��;���"�bb���TQ��?SLԕLt��uR����J3ե4�m��=%.��)/��0���Z�qi�� ���'���'��4䘔��ɨb�e��h�Uz�}�n
l�o\��'��Y_�y[7A-2s��|�>�-\�\��ޮlB������j����`4�U�X%��^���̐�lٰ§j�L�bML�I���VΤ#�Ie�6�ѤIŵ��gk^dTD8�8�{��G"w�J���+{kY�6'I�gښiֶD�}�xD�%gbj��0>�etXIݨ�D�0/l��~��;u� �f��>����H��e(�-qf�*VNC��ٹ�������t�_M�+i�l��T��QS�^��#��U �¥e�v�W����~�+���߁b�����%oy��=�W_&�w�Y���ۡ��w�GU�9�2Z�R�@f��3?`[>'X��ފ񘺆�e�Y�Y�~�����/�'��{;㤏�u�� ��c ר�Gz���ׯ�/�x4x_ۡ:��v�*��W�_����~썄���`#��h��0H}#d|��*)�u���Ѥ�vq6�|�3���2`��̑���Z�9�%Ϫ����s������k(�'���>�z_8�\�z�q�)VAR[f,��{D�|/W��ȸXg         7   x�3�t�I�T 	p��qsrq'���8�����I�m����� Yh�            x������ � �          �  x�ՕMK1���_1R��&�^z)*�z�nb7��,�l�"��N�� ���%!_��>�ܨS�~#X�[��D�PSl"ϔ�X�ݚK]{�T�xvCZHF�v�l	��!��6��Okǥ���m�j���ъ�4c��׷�iwj�Ѿ�{u��6py��[5W�2���K�r.�u�Q�4쨅�L(}�W�0�Q.��܉�{P%Ս3l���E�%�72��U�_R����2i{����3���1&�����J���]dSO��i#~��q>���ڴ,ǍL}���s.���=��| !%T���' ���s �b����t��}Y+ь/��l�<a�:�,�h�aJN>鎜�lP
��&/*�h&=#ymt��Mx�GX������PL�,����      